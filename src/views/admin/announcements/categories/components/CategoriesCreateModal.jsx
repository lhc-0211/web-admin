import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiCreateAnnouncementCategoryAdmin } from '@/services/Announcements' // ← API tạo danh mục
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useCategories from '../hooks/useCategories' // ← Hook đúng cho categories

// Schema validation cho form tạo danh mục
const createCategorySchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên danh mục'),
    description: z.string().optional(),
    icon: z.string().min(1, 'Vui lòng nhập icon (tên class hoặc emoji)'),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Màu phải là mã hex hợp lệ (ví dụ: #3B82F6)')
        .or(z.string().length(0)), // Cho phép rỗng tạm thời nếu cần picker
    displayOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự hiển thị phải là số không âm')
        .default(0),
})

const CategoriesCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useCategories()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            color: '#3B82F6', // Màu mặc định (blue-500)
            displayOrder: 0,
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                description: data.description || null,
                icon: data.icon,
                color: data.color || null,
                displayOrder: data.displayOrder,
            }

            await apiCreateAnnouncementCategoryAdmin(body)

            mutate() // Refresh danh sách danh mục
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo danh mục <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi tạo danh mục:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo danh mục thất bại:{' '}
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
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo danh mục mới
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên danh mục */}
                        <FormItem
                            label={
                                <span>
                                    Tên danh mục{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: Tin tức chung"
                                            {...field}
                                            invalid={!!errors.name}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Icon */}
                        {/* <FormItem
                            label={
                                <span>
                                    Icon <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="icon"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: megaphone, 📢, fa-bullhorn"
                                            {...field}
                                            invalid={!!errors.icon}
                                        />
                                        {errors.icon && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.icon.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem> */}

                        {/* Màu sắc */}
                        {/* <FormItem label="Màu sắc (hex)">
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="color"
                                            className="w-20 h-10 cursor-pointer"
                                            {...field}
                                        />
                                        <Input
                                            placeholder="#3B82F6"
                                            {...field}
                                            invalid={!!errors.color}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            />
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />
                                    {errors.color.message}
                                </p>
                            )}
                        </FormItem> */}

                        {/* Thứ tự hiển thị */}
                        <FormItem label="Thứ tự hiển thị">
                            <Controller
                                name="displayOrder"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Mô tả - full width */}
                    <FormItem label="Mô tả (tùy chọn)">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={4}
                                    placeholder="Mô tả ngắn về danh mục này..."
                                    {...field}
                                />
                            )}
                        />
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
                        Tạo danh mục
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CategoriesCreateModal
