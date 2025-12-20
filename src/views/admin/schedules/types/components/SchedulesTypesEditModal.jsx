import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateScheduleStypeAdmin } from '@/services/ScheduleService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import usePositions from '../hooks/useSchedulesTypes'

// Schema validation cho form sửa loại lịch
const editScheduleTypeSchema = z.object({
    code: z.string().min(1, 'Vui lòng nhập mã loại lịch'),
    name: z.string().min(1, 'Vui lòng nhập tên loại lịch'),
    description: z.string().optional(),
    displayOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự phải là số không âm')
        .optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
})

const SchedulesTypesEditModal = ({ isOpen, onClose, position }) => {
    const { mutate } = usePositions()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editScheduleTypeSchema),
    })

    // Reset form khi modal mở hoặc position thay đổi
    React.useEffect(() => {
        if (isOpen && position) {
            reset({
                code: position.code || '',
                name: position.name || '',
                description: position.description || '',
                displayOrder: position.displayOrder ?? 0,
                icon: position.icon || '',
                color: position.color || '',
            })
        }
    }, [isOpen, position, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                code: data.code,
                name: data.name,
                description: data.description || null,
                displayOrder: data.displayOrder ?? 0,
                icon: data.icon || null,
                color: data.color || null,
            }

            await apiUpdateScheduleStypeAdmin(position.id, body)

            mutate() // Refresh danh sách loại lịch
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật loại lịch <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật loại lịch:', error)
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

    if (!position) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa loại lịch
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID:{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded">
                            {position.id}
                        </code>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mã loại lịch */}
                        <FormItem
                            label={
                                <span>
                                    Mã loại lịch{' '}
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
                                            placeholder="Ví dụ: CA1, CA2, OFF"
                                            {...field}
                                            invalid={!!errors.code}
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

                        {/* Tên loại lịch */}
                        <FormItem
                            label={
                                <span>
                                    Tên loại lịch{' '}
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
                                            placeholder="Ví dụ: Ca sáng, Ca tối, Nghỉ"
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

                        {/* Icon (tùy chọn) */}
                        <FormItem label="Icon (tùy chọn)">
                            <Controller
                                name="icon"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Ví dụ: Sun, Moon, Coffee"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Màu sắc (tùy chọn) */}
                        <FormItem label="Màu sắc (tùy chọn)">
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
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ) || 0,
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
                                    placeholder="Mô tả về loại lịch này..."
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

export default SchedulesTypesEditModal
