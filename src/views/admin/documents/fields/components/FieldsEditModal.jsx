import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateDocumentFieldAdmin } from '@/services/DocumentsService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useFields from '../hooks/useFields'

// Schema validation đúng với cấu trúc dữ liệu thực tế
const editFieldSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên trường'),
    code: z
        .string()
        .min(1, 'Vui lòng nhập mã trường')
        .max(20, 'Mã tối đa 20 ký tự'),
    description: z.string().optional(),
    icon: z.string().min(1, 'Vui lòng nhập tên icon'),
    color: z
        .string()
        .min(1, 'Vui lòng chọn hoặc nhập màu')
        .regex(/^#[0-9A-F]{6}$/i, 'Màu phải là mã hex hợp lệ (ví dụ: #3B82F6)'),
    displayOrder: z
        .number({ invalid_type_error: 'Thứ tự phải là số' })
        .int('Thứ tự phải là số nguyên')
        .nonnegative('Thứ tự phải ≥ 0')
        .optional(),
})

const FieldsEditModal = ({ isOpen, onClose, field }) => {
    const { mutate } = useFields()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editFieldSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            icon: '',
            color: '#3B82F6',
            displayOrder: 0,
        },
    })

    // Reset form khi mở modal hoặc field thay đổi
    React.useEffect(() => {
        if (isOpen && field) {
            reset({
                name: field.name || '',
                code: field.code || '',
                description: field.description || '',
                icon: field.icon || '',
                color: field.color || '#3B82F6',
                displayOrder: field.displayOrder ?? 0,
            })
        }
    }, [isOpen, field, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name.trim(),
                code: data.code.trim().toUpperCase(),
                description: data.description?.trim() || null,
                icon: data.icon.trim(),
                color: data.color.toUpperCase(),
                displayOrder: data.displayOrder ?? 0,
            }

            await apiUpdateDocumentFieldAdmin(field.id, body)

            mutate() // Refresh danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật trường thông tin <strong>{data.name}</strong> thành
                    công!
                </Notification>,
            )

            onClose()
        } catch (error) {
            console.error('Lỗi cập nhật trường thông tin:', error)
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

    if (!field) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="flex flex-col">
                {/* Header */}
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa danh mục
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID:{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded">
                            {field.id}
                        </code>
                    </p>
                </div>
                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên trường */}
                        <FormItem
                            label={
                                <span>
                                    Tên trường{' '}
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
                                            placeholder="Ví dụ: Ngày sinh, Số điện thoại"
                                            {...field}
                                            invalid={!!errors.name}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Mã trường */}
                        <FormItem
                            label={
                                <span>
                                    Mã trường{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: DOB, PHONE"
                                            {...field}
                                            invalid={!!errors.code}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                        />
                                        {errors.code && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {errors.code.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Icon */}
                        <FormItem
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
                                            placeholder="Ví dụ: HiCalendar, HiPhone, HiMail"
                                            {...field}
                                            invalid={!!errors.icon}
                                        />
                                        {errors.icon && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {errors.icon.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Color */}
                        <FormItem
                            label={
                                <span>
                                    Màu sắc{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="color"
                                            className="w-20 h-10 cursor-pointer rounded border"
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
                                    <HiExclamationCircle className="h-4 w-4" />
                                    {errors.color.message}
                                </p>
                            )}
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
                                                              e.target.value,
                                                              10,
                                                          ),
                                                )
                                            }
                                            invalid={!!errors.displayOrder}
                                        />
                                        {errors.displayOrder && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="h-4 w-4" />
                                                {errors.displayOrder.message}
                                            </p>
                                        )}
                                    </>
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
                                    placeholder="Mô tả ngắn về trường thông tin này..."
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </form>

                {/* Footer */}
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

export default FieldsEditModal
