import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateDocumentTypeAdmin } from '@/services/DocumentsService' // Đổi tên API phù hợp
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useTypes from '../hooks/useTypes'

// Schema validation đúng với dữ liệu thực tế
const editTypeSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên loại tài liệu'),
    code: z
        .string()
        .min(1, 'Vui lòng nhập mã loại')
        .max(30, 'Mã tối đa 30 ký tự')
        .regex(
            /^[A-Z0-9_-]+$/,
            'Mã chỉ được chứa chữ cái in hoa, số, gạch dưới hoặc gạch ngang',
        ),
    description: z.string().optional(),
    displayOrder: z
        .number({ invalid_type_error: 'Thứ tự phải là số nguyên' })
        .int()
        .nonnegative('Thứ tự phải ≥ 0')
        .optional(),
})

const TypesEditModal = ({ isOpen, onClose, type }) => {
    const { mutate } = useTypes()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editTypeSchema),
    })

    // Reset form khi modal mở hoặc type thay đổi
    React.useEffect(() => {
        if (isOpen && type) {
            reset({
                name: type.name || '',
                code: type.code || '',
                description: type.description || '',
                displayOrder: type.displayOrder ?? 0,
            })
        }
    }, [isOpen, type, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name.trim(),
                code: data.code.trim().toUpperCase(),
                description: data.description?.trim() || null,
                displayOrder: data.displayOrder ?? 0,
            }

            await apiUpdateDocumentTypeAdmin(type.id, body)

            mutate() // Refresh danh sách loại tài liệu
            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật loại tài liệu <strong>{data.name}</strong> thành
                    công!
                </Notification>,
            )

            onClose()
        } catch (error) {
            console.error('Lỗi cập nhật loại tài liệu:', error)
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

    if (!type) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa loại tài liệu
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {type.id} | Mã: {type.code}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {' '}
                        {/* Mã loại */}
                        <FormItem
                            label={
                                <span>
                                    Mã loại{' '}
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
                                            placeholder="Ví dụ: CONTRACT"
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
                                                <HiExclamationCircle />
                                                {errors.code.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>
                        {/* Tên loại tài liệu */}
                        <FormItem
                            label={
                                <span>
                                    Tên loại tài liệu{' '}
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
                                            placeholder="Ví dụ: Hợp đồng, Quyết định"
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
                                                <HiExclamationCircle />
                                                {errors.displayOrder.message}
                                            </p>
                                        )}
                                    </>
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
                                    placeholder="Mô tả ngắn về loại tài liệu này..."
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

export default TypesEditModal
