import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher' // Giả sử bạn có component Switcher
import { apiCreateAnnouncementAdmin } from '@/services/Announcements' // ← API tạo mới
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useAllCategories from '../../categories/hooks/userAllCategories'
import useAnnouncements from '../hooks/useAnnouncements'

// Schema validation cho form tạo thông báo
const createAnnouncementSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề thông báo'),
    summary: z.string().min(1, 'Vui lòng nhập tóm tắt'),
    content: z.string().min(1, 'Vui lòng nhập nội dung chi tiết'),
    categoryId: z
        .string()
        .uuid('ID danh mục không hợp lệ')
        .or(z.literal(''))
        .optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
        required_error: 'Vui lòng chọn độ ưu tiên',
    }),
    isPublic: z.boolean().default(true),
    publishAt: z.date({ required_error: 'Vui lòng chọn ngày đăng' }),
    expiresAt: z.date().optional().nullable(),
    isPinned: z.boolean().default(false),
    pinnedOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự ghim phải là số không âm')
        .default(0),
    attachmentFileIds: z.array(z.string()).optional(), // Có thể mở rộng sau nếu có upload file
})

const AnnouncementsCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useAnnouncements()

    const { categories, isLoading: isLoadingCategories } = useAllCategories()

    const categoriesOptions = categories.map((vio) => ({
        label: `${vio.name}`,
        value: vio.id,
    }))

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createAnnouncementSchema),
        defaultValues: {
            title: '',
            summary: '',
            content: '',
            categoryId: '',
            priority: 'Low',
            isPublic: true,
            publishAt: new Date(),
            expiresAt: null,
            isPinned: false,
            pinnedOrder: 0,
            attachmentFileIds: [],
        },
    })

    const isPinned = watch('isPinned')

    const onSubmit = async (data) => {
        try {
            const body = {
                title: data.title,
                summary: data.summary,
                content: data.content,
                categoryId: data.categoryId || null,
                priority: data.priority,
                isPublic: data.isPublic,
                publishAt: data.publishAt.toISOString(),
                expiresAt: data.expiresAt ? data.expiresAt.toISOString() : null,
                isPinned: data.isPinned,
                pinnedOrder: data.isPinned ? data.pinnedOrder : 0,
                attachmentFileIds: data.attachmentFileIds || [],
            }

            await apiCreateAnnouncementAdmin(body)

            mutate() // Refresh danh sách
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo thông báo <strong>{data.title}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi tạo thông báo:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo thông báo thất bại:{' '}
                    {error?.response?.data?.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const priorityOptions = [
        { label: 'Thấp', value: 'Low' },
        { label: 'Trung bình', value: 'Medium' },
        { label: 'Cao', value: 'High' },
        { label: 'Nghiêm trọng', value: 'Critical' },
    ]

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo thông báo mới
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tiêu đề */}
                        <FormItem
                            label={
                                <span>
                                    Tiêu đề{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập tiêu đề thông báo"
                                        {...field}
                                        invalid={!!errors.title}
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />
                                    {errors.title.message}
                                </p>
                            )}
                        </FormItem>
                        {/* Danh mục ID */}
                        <FormItem label="ID Danh mục">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            options={categoriesOptions}
                                            value={categoriesOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder={
                                                isLoadingCategories
                                                    ? 'Đang tải...'
                                                    : 'Chọn loại danh mục'
                                            }
                                            isLoading={isLoadingCategories}
                                            isSearchable
                                            isClearable={false}
                                        />
                                        {errors.categoryId && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.categoryId.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </FormItem>
                        {/* Độ ưu tiên */}
                        <FormItem
                            label={
                                <span>
                                    Độ ưu tiên{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={priorityOptions}
                                        value={priorityOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
                                        }
                                        placeholder="Chọn độ ưu tiên"
                                    />
                                )}
                            />
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.priority.message}
                                </p>
                            )}
                        </FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
                            {/* Công khai */}
                            <FormItem label="Công khai">
                                <Controller
                                    name="isPublic"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Ghim thông báo */}
                            <FormItem label="Ghim thông báo">
                                <Controller
                                    name="isPinned"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Thứ tự ghim - chỉ hiển thị khi isPinned = true, chiếm full width */}
                        {isPinned && (
                            <FormItem
                                label="Thứ tự ghim"
                                className="md:col-span-2"
                            >
                                <Controller
                                    name="pinnedOrder"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        {/* Ngày đăng */}
                        <FormItem
                            label={
                                <span>
                                    Ngày đăng{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="publishAt"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày đăng"
                                        value={field.value}
                                        onChange={(date) =>
                                            field.onChange(date)
                                        }
                                    />
                                )}
                            />
                            {errors.publishAt && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.publishAt.message}
                                </p>
                            )}
                        </FormItem>
                        {/* Ngày hết hạn */}
                        <FormItem label="Ngày hết hạn (tùy chọn)">
                            <Controller
                                name="expiresAt"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày hết hạn"
                                        value={field.value || undefined}
                                        onChange={(date) =>
                                            field.onChange(date || null)
                                        }
                                        clearable
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Tóm tắt */}
                    <FormItem
                        label={
                            <span>
                                Tóm tắt <span className="text-red-600">*</span>
                            </span>
                        }
                        className="md:col-span-2"
                    >
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Tóm tắt ngắn gọn nội dung thông báo"
                                    {...field}
                                    invalid={!!errors.summary}
                                />
                            )}
                        />
                        {errors.summary && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.summary.message}
                            </p>
                        )}
                    </FormItem>

                    {/* Nội dung chi tiết */}
                    <FormItem
                        label={
                            <span>
                                Nội dung chi tiết{' '}
                                <span className="text-red-600">*</span>
                            </span>
                        }
                        className="md:col-span-2"
                    >
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={8}
                                    placeholder="Nhập nội dung đầy đủ của thông báo"
                                    {...field}
                                    invalid={!!errors.content}
                                />
                            )}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content.message}
                            </p>
                        )}
                    </FormItem>
                </form>

                <div className="border-t px-8 py-5 bg-gray-50 flex justify-end gap-4">
                    <Button variant="default" size="lg" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        size="lg"
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Tạo thông báo
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AnnouncementsCreateModal
