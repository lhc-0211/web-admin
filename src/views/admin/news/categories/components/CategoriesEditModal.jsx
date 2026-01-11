import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateNewsCategoryAdmin } from '@/services/NewsService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useCategories from '../hooks/useCategories' // ← Hook đúng cho categories

// Schema validation cho form sửa danh mục
const editCategorySchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên danh mục'),
    description: z.string().optional(),
    displayOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự hiển thị phải là số không âm')
        .optional(),
})

const CategoriesEditModal = ({ isOpen, onClose, category }) => {
    const { mutate } = useCategories()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editCategorySchema),
    })

    // Reset form khi mở modal với dữ liệu mới
    React.useEffect(() => {
        if (isOpen && category) {
            reset({
                name: category.name || '',
                description: category.description || '',
                displayOrder: category.displayOrder ?? 0,
            })
        }
    }, [isOpen, category, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                description: data.description || null,
                icon: data.icon,
                color: data.color || null,
                displayOrder: data.displayOrder ?? 0,
            }

            await apiUpdateNewsCategoryAdmin(category.id, body)

            mutate() // Refresh bảng danh mục
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật danh mục <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật danh mục:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại:{' '}
                    {error?.response?.data?.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!category) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
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

                    {/* Mô tả */}
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
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CategoriesEditModal
