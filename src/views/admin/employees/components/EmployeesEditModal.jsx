import { Notification, Select, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdatePositionAdmin } from '@/services/PositionsService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useAllDepartments from '../../user/departments/hooks/userAllDepartments'
import usePositions from '../hooks/useEmployees' // Hook đúng cho positions

// Schema validation cho form sửa chức vụ
const editPositionSchema = z.object({
    positionCode: z.string().min(1, 'Vui lòng nhập mã chức vụ'),
    name: z.string().min(1, 'Vui lòng nhập tên chức vụ'),
    description: z.string().optional(),
    order: z
        .number()
        .int()
        .nonnegative('Thứ tự phải là số không âm')
        .optional(),
    departmentId: z.string().min(1, 'Vui lòng chọn phòng ban quản lý'),
})

const EmployeesEditModal = ({ isOpen, onClose, position }) => {
    const { mutate } = usePositions()

    const { departments, isLoading: loadingDepartments } = useAllDepartments() // Lấy danh sách phòng ban

    const departmentOptions =
        departments?.map((dep) => ({
            label: `${dep.name} (${dep.code})`,
            value: dep.id,
        })) || []

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editPositionSchema),
    })

    // Reset form khi modal mở hoặc position thay đổi
    React.useEffect(() => {
        if (isOpen && position) {
            reset({
                positionCode: position.positionCode || '',
                name: position.name || '',
                description: position.description || '',
                order: position.order ?? 0,
                departmentId: position.departmentId || '',
            })
        }
    }, [isOpen, position, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                id: position.id,
                positionCode: data.positionCode,
                name: data.name,
                description: data.description || null,
                order: data.order ?? 0,
                departmentId: data.departmentId || null,
            }

            await apiUpdatePositionAdmin(position.id, body)

            mutate() // Refresh danh sách chức vụ
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật chức vụ <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật chức vụ:', error)
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
                        Sửa chức vụ
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {position.id}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mã chức vụ */}
                        <FormItem
                            label={
                                <span>
                                    Mã chức vụ{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="positionCode"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: GD, TP, NV"
                                            {...field}
                                            invalid={!!errors.positionCode}
                                        />
                                        {errors.positionCode && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.positionCode.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Tên chức vụ */}
                        <FormItem
                            label={
                                <span>
                                    Tên chức vụ{' '}
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
                                            placeholder="Ví dụ: Giám đốc, Trưởng phòng"
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

                        {/* Phòng ban (departmentId) */}
                        <FormItem
                            label={
                                <span>
                                    Phòng ban{' '}
                                    <span className="text-red-600 font-medium">
                                        *
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                name="departmentId"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            options={departmentOptions}
                                            value={departmentOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder={
                                                loadingDepartments
                                                    ? 'Đang tải phòng ban...'
                                                    : 'Chọn phòng ban'
                                            }
                                            isLoading={loadingDepartments}
                                            isSearchable
                                            isClearable={false}
                                        />
                                        {errors.departmentId && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.departmentId.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Thứ tự */}
                        <FormItem label="Thứ tự hiển thị">
                            <Controller
                                name="order"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value, 10) ||
                                                    0,
                                            )
                                        }
                                        invalid={!!errors.order}
                                    />
                                )}
                            />
                            {errors.order && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />
                                    {errors.order.message}
                                </p>
                            )}
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
                                    placeholder="Mô tả về chức vụ này..."
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

export default EmployeesEditModal
