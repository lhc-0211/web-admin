import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { apiUpdateGalleryCategoryAdmin } from '@/services/GalleyService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useCategories from '../hooks/useCategories'

// Schema validation cho chỉnh sửa
const editCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Vui lòng nhập tên danh mục')
        .max(100, 'Tên quá dài'),
    description: z.string().optional(),
    displayOrder: z
        .number({ invalid_type_error: 'Thứ tự phải là số' })
        .int('Phải là số nguyên')
        .min(0, 'Thứ tự phải ≥ 0')
        .default(0),
    isActive: z.boolean(),
})

const CategoriesEditModal = ({ isOpen, onClose, category, onSuccess }) => {
    const { mutate } = useCategories()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editCategorySchema),
        defaultValues: {
            name: '',
            description: '',
            displayOrder: 0,
            isActive: true,
        },
    })

    // Reset form khi modal mở hoặc category thay đổi
    useEffect(() => {
        if (isOpen && category) {
            reset({
                name: category.name || '',
                description: category.description || '',
                displayOrder: category.displayOrder ?? 0,
                isActive: category.isActive ?? true,
            })
        }
    }, [isOpen, category, reset])

    const onSubmit = async (data) => {
        if (!category?.id) return

        try {
            const body = {
                name: data.name.trim(),
                description: data.description?.trim() || null,
                displayOrder: Number(data.displayOrder),
                isActive: data.isActive,
            }

            await apiUpdateGalleryCategoryAdmin(category.id, body)

            // Refetch danh sách
            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật danh mục <strong>{data.name}</strong> thành công!
                </Notification>,
            )

            onClose()
            onSuccess?.() // Gọi callback nếu có (ví dụ từ table)
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Vui lòng thử lại!'

            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {message}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!isOpen || !category) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
                {/* Header */}
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa danh mục
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID:{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded">
                            {category.id}
                        </code>
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col flex-1"
                >
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
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
                                                autoFocus
                                                {...field}
                                                invalid={!!errors.name}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Thứ tự hiển thị */}
                            <FormItem label="Thứ tự hiển thị">
                                <Controller
                                    name="displayOrder"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ''
                                                            ? 0
                                                            : parseInt(
                                                                  e.target
                                                                      .value,
                                                                  10,
                                                              ),
                                                    )
                                                }
                                                invalid={!!errors.displayOrder}
                                            />
                                            {errors.displayOrder && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.displayOrder
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Trạng thái */}
                            <FormItem label="Trạng thái">
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                            checkedContent="Hoạt động"
                                            unCheckedContent="Tạm dừng"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Mô tả */}
                        <FormItem label="Mô tả (tùy chọn)">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={4}
                                        placeholder="Mô tả ngắn gọn về mục đích của danh mục..."
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Footer */}
                    <div className="border-t px-8 py-5 bg-gray-50 flex justify-end gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            size="lg"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}

export default CategoriesEditModal
