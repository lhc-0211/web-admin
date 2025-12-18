import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateNewAdmin } from '@/services/News'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useAllCategories from '../../categories/hooks/userAllCategories'
import useAllTags from '../../tags/hooks/useAllTags'
import useNews from '../hooks/useNews'

const createNewsSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề tin tức'),
    summary: z.string().min(1, 'Vui lòng nhập tóm tắt'),
    content: z.string().min(1, 'Vui lòng nhập nội dung chi tiết'),
    categoryId: z
        .string()
        .uuid('ID danh mục không hợp lệ')
        .optional()
        .or(z.literal('')),
    featuredImageId: z
        .string()
        .uuid('ID ảnh nổi bật không hợp lệ')
        .optional()
        .or(z.literal('')),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    scheduledPublishAt: z.date().optional().nullable(),
    tagIds: z.array(z.string()).optional(),
})

const NewsCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useNews()

    const { categories, isLoading: isLoadingCategories } = useAllCategories()
    const { tags, isLoading: isLoadingTags } = useAllTags()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }))

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createNewsSchema),
        defaultValues: {
            title: '',
            summary: '',
            content: '',
            categoryId: '',
            featuredImageId: '',
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            scheduledPublishAt: null,
            tagIds: [],
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                title: data.title,
                summary: data.summary,
                content: data.content,
                categoryId: data.categoryId || null,
                featuredImageId: data.featuredImageId || null,
                metaTitle: data.metaTitle || null,
                metaDescription: data.metaDescription || null,
                metaKeywords: data.metaKeywords || null,
                scheduledPublishAt: data.scheduledPublishAt
                    ? data.scheduledPublishAt.toISOString()
                    : null,
                tagIds: data.tagIds || [],
            }

            await apiCreateNewAdmin(body)

            mutate()
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo tin tức <strong>{data.title}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi tạo tin tức:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo tin tức thất bại:{' '}
                    {error?.response?.data?.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={1000}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo tin tức mới
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
                                        placeholder="Nhập tiêu đề tin tức"
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

                        {/* Danh mục */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={categoryOptions}
                                        value={categoryOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder={
                                            isLoadingCategories
                                                ? 'Đang tải...'
                                                : 'Chọn danh mục'
                                        }
                                        isLoading={isLoadingCategories}
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Ảnh nổi bật ID */}
                        <FormItem label="ID Ảnh nổi bật (featuredImageId)">
                            <Controller
                                name="featuredImageId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập GUID ảnh nổi bật (tùy chọn)"
                                        {...field}
                                        invalid={!!errors.featuredImageId}
                                    />
                                )}
                            />
                            {errors.featuredImageId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.featuredImageId.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Lên lịch xuất bản */}
                        <FormItem label="Lên lịch xuất bản (tùy chọn)">
                            <Controller
                                name="scheduledPublishAt"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày giờ xuất bản"
                                        value={field.value}
                                        onChange={field.onChange}
                                        showTimeSelect
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
                    >
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Tóm tắt ngắn gọn nội dung tin tức"
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
                    >
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={10}
                                    placeholder="Nhập nội dung đầy đủ của tin tức"
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

                    {/* Tags */}
                    <FormItem label="Tags">
                        <Controller
                            name="tagIds"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={tagOptions}
                                    value={tagOptions.filter((opt) =>
                                        field.value?.includes(opt.value),
                                    )}
                                    onChange={(opts) =>
                                        field.onChange(
                                            opts.map((opt) => opt.value),
                                        )
                                    }
                                    isMulti
                                    placeholder={
                                        isLoadingTags
                                            ? 'Đang tải...'
                                            : 'Chọn tags'
                                    }
                                    isLoading={isLoadingTags}
                                    isSearchable
                                />
                            )}
                        />
                    </FormItem>

                    {/* SEO Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormItem label="Meta Title (SEO)">
                            <Controller
                                name="metaTitle"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Tiêu đề SEO (tùy chọn)"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Meta Description (SEO)">
                            <Controller
                                name="metaDescription"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Mô tả SEO (tùy chọn)"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Meta Keywords (SEO)">
                            <Controller
                                name="metaKeywords"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Từ khóa SEO, cách nhau bằng dấu phẩy"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
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
                        Tạo tin tức
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default NewsCreateModal
