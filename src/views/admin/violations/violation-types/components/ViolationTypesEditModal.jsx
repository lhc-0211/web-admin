import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateViolationTypeAdmin } from '@/services/ViolationsService' // API update loại vi phạm
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useViolationTypes from '../hooks/useViolationTypes' // Hook đúng

// Schema validation cho form sửa loại vi phạm
const editViolationTypeSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên loại vi phạm'),
    description: z.string().optional(),
    code: z.string().min(1, 'Vui lòng nhập mã code'),
    displayOrder: z.number().int().nonnegative('Thứ tự phải là số không âm'),
})

const ViolationTypeEditModal = ({ isOpen, onClose, violationType }) => {
    const { mutate } = useViolationTypes()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editViolationTypeSchema),
        defaultValues: {
            name: violationType?.name || '',
            description: violationType?.description || '',
            code: violationType?.code || '',
            displayOrder: violationType?.displayOrder ?? 0,
        },
    })

    // Reset form khi mở modal với dữ liệu mới
    React.useEffect(() => {
        if (isOpen && violationType) {
            reset({
                name: violationType.name || '',
                description: violationType.description || '',
                code: violationType.code || '',
                displayOrder: violationType.displayOrder ?? 0,
            })
        }
    }, [isOpen, violationType, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                description: data.description || null,
                code: data.code,
                displayOrder: data.displayOrder,
            }

            await apiUpdateViolationTypeAdmin(violationType.id, body)

            mutate() // Refresh bảng
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật loại vi phạm <strong>{data.code}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật loại vi phạm:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {error.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!violationType) return null

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
                            {violationType.id}
                        </code>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 space-y-8 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên loại vi phạm - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên loại vi phạm{' '}
                                    <span className="text-red-600 font-medium">
                                        *
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: Vượt đèn đỏ"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${
                                                errors.name
                                                    ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Mã code - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Mã code{' '}
                                    <span className="text-red-600 font-medium">
                                        *
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: VLD"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${
                                                errors.code
                                                    ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            }`}
                                        />
                                        {errors.code && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.code.message}
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

                        {/* Mô tả - full width */}
                        <FormItem label="Mô tả" className="md:col-span-2">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={5}
                                        placeholder="Mô tả chi tiết về loại vi phạm (tùy chọn)"
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
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ViolationTypeEditModal
