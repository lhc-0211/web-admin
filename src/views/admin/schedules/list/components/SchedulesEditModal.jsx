import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiUpdateScheduleAdmin } from '@/services/ScheduleService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useAllSchedulesTypes from '../../types/hooks/useAllSchedulesTypes'

import useSchedules from '../hooks/useSchedules' // Hook refetch danh sách lịch

// Schema validation cho form sửa lịch công tác
const editScheduleSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề lịch'),
    description: z.string().optional(),
    scheduleTypeId: z.string().min(1, 'Vui lòng chọn loại lịch'),
    startTime: z.string().min(1, 'Vui lòng chọn ngày giờ bắt đầu'),
    endTime: z.string().optional(),
    isAllDay: z.boolean(),
    location: z.string().optional(),
    address: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']),
    reminderType: z.enum([
        'None',
        '5Minutes',
        '15Minutes',
        '30Minutes',
        '1Hour',
        '1Day',
    ]),
    reminderMinutes: z.number().optional(),
    notes: z.string().optional(),
    isPrivate: z.boolean(),
})

const SchedulesEditModal = ({ isOpen, onClose, schedule }) => {
    const { mutate } = useSchedules()
    const { scheduleTypes } = useAllSchedulesTypes() // Lấy danh sách loại lịch

    const scheduleTypeOptions =
        scheduleTypes?.map((type) => ({
            label: type.name,
            value: type.id,
        })) || []

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editScheduleSchema),
    })

    const isAllDay = watch('isAllDay')

    // Reset form khi modal mở hoặc schedule thay đổi
    React.useEffect(() => {
        if (isOpen && schedule) {
            reset({
                title: schedule.title || '',
                description: schedule.description || '',
                scheduleTypeId: schedule.scheduleTypeId || '',
                startTime: schedule.startTime
                    ? schedule.startTime.slice(0, 16)
                    : '', // datetime-local format
                endTime: schedule.endTime ? schedule.endTime.slice(0, 16) : '',
                isAllDay: schedule.isAllDay || false,
                location: schedule.location || '',
                address: schedule.address || '',
                priority: schedule.priority || 'Low',
                reminderType: schedule.reminderType || 'None',
                reminderMinutes: schedule.reminderMinutes || 0,
                notes: schedule.notes || '',
                isPrivate: schedule.isPrivate || false,
            })
        }
    }, [isOpen, schedule, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                title: data.title,
                description: data.description || null,
                scheduleTypeId: data.scheduleTypeId,
                startTime: data.startTime,
                endTime: data.endTime || null,
                isAllDay: data.isAllDay,
                location: data.location || null,
                address: data.address || null,
                priority: data.priority,
                reminderType: data.reminderType,
                reminderMinutes:
                    data.reminderType === 'None' ? 0 : data.reminderMinutes,
                notes: data.notes || null,
                isPrivate: data.isPrivate,
                // Các trường khác như participantIds, attachmentFileIds... có thể giữ nguyên hoặc cập nhật sau
            }

            await apiUpdateScheduleAdmin(schedule.id, body)

            mutate() // Refresh danh sách lịch
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật lịch công tác <strong>{data.title}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật lịch:', error)
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

    if (!schedule) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa lịch công tác
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {schedule.id}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    {/* Tiêu đề & Loại lịch */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <>
                                        <Input
                                            placeholder="Nhập tiêu đề lịch công tác"
                                            {...field}
                                            invalid={!!errors.title}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.title.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label={
                                <span>
                                    Loại lịch{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="scheduleTypeId"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            options={scheduleTypeOptions}
                                            value={scheduleTypeOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder="Chọn loại lịch"
                                            isSearchable
                                        />
                                        {errors.scheduleTypeId && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.scheduleTypeId.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Thời gian */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormItem label="Ngày giờ bắt đầu *">
                            <Controller
                                name="startTime"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            invalid={!!errors.startTime}
                                        />
                                        {errors.startTime && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.startTime.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        <FormItem label="Ngày giờ kết thúc">
                            <Controller
                                name="endTime"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        disabled={isAllDay}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Cả ngày">
                            <Controller
                                name="isAllDay"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked)
                                            if (e.target.checked)
                                                setValue('endTime', '')
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Địa điểm & Ưu tiên */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Địa điểm (tùy chọn)">
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Tên địa điểm"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Độ ưu tiên">
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={[
                                            { label: 'Thấp', value: 'Low' },
                                            {
                                                label: 'Trung bình',
                                                value: 'Medium',
                                            },
                                            { label: 'Cao', value: 'High' },
                                        ]}
                                        value={
                                            field.value
                                                ? {
                                                      label:
                                                          field.value === 'Low'
                                                              ? 'Thấp'
                                                              : field.value ===
                                                                  'Medium'
                                                                ? 'Trung bình'
                                                                : 'Cao',
                                                      value: field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            field.onChange(opt?.value || 'Low')
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Nhắc nhở & Riêng tư */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Nhắc nhở">
                            <Controller
                                name="reminderType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={[
                                            {
                                                label: 'Không nhắc',
                                                value: 'None',
                                            },
                                            {
                                                label: '5 phút trước',
                                                value: '5Minutes',
                                            },
                                            {
                                                label: '15 phút trước',
                                                value: '15Minutes',
                                            },
                                            {
                                                label: '30 phút trước',
                                                value: '30Minutes',
                                            },
                                            {
                                                label: '1 giờ trước',
                                                value: '1Hour',
                                            },
                                            {
                                                label: '1 ngày trước',
                                                value: '1Day',
                                            },
                                        ]}
                                        value={
                                            field.value
                                                ? {
                                                      label:
                                                          field.value === 'None'
                                                              ? 'Không nhắc'
                                                              : field.value
                                                                    .replace(
                                                                        'Minutes',
                                                                        ' phút trước',
                                                                    )
                                                                    .replace(
                                                                        'Hour',
                                                                        ' giờ trước',
                                                                    )
                                                                    .replace(
                                                                        'Day',
                                                                        ' ngày trước',
                                                                    ),
                                                      value: field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            field.onChange(opt?.value || 'None')
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Lịch riêng tư">
                            <Controller
                                name="isPrivate"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) =>
                                            field.onChange(e.target.checked)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Mô tả & Ghi chú */}
                    <FormItem label="Mô tả (tùy chọn)">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Mô tả chi tiết về lịch công tác..."
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Ghi chú (tùy chọn)">
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Ghi chú nội bộ..."
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

export default SchedulesEditModal
