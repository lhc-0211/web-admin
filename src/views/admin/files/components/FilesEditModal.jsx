import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiUpdateDepartmentsAdmin } from '@/services/UserService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useFiles from '../hooks/useFiles'

// Schema validation cho form sửa phòng ban
const editDepartmentSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên phòng ban'),
    code: z.string().min(1, 'Vui lòng nhập mã phòng ban'),
    description: z.string().optional(),
    order: z.number().int().nonnegative('Thứ tự phải là số không âm'),
    parentDepartmentId: z
        .string()
        .uuid('ID phòng ban cha không hợp lệ')
        .optional()
        .or(z.literal('')),
    headOfDepartmentId: z
        .string()
        .uuid('ID trưởng phòng không hợp lệ')
        .optional()
        .or(z.literal('')),
})

const FilesEditModal = ({ isOpen, onClose, department }) => {
    const { mutate } = useFiles()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editDepartmentSchema),
        defaultValues: {
            name: department?.name || '',
            code: department?.code || '',
            description: department?.description || '',
            order: department?.order ?? 0,
            parentDepartmentId: department?.parentDepartmentId || '',
            headOfDepartmentId: department?.headOfDepartmentId || '',
        },
    })

    // Reset form khi mở modal với dữ liệu mới
    React.useEffect(() => {
        if (isOpen && department) {
            reset({
                name: department.name || '',
                code: department.code || '',
                description: department.description || '',
                order: department.order ?? 0,
                parentDepartmentId: department.parentDepartmentId || '',
                headOfDepartmentId: department.headOfDepartmentId || '',
            })
        }
    }, [isOpen, department, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                id: department.id,
                name: data.name,
                code: data.code,
                description: data.description || null,
                order: data.order,
                parentDepartmentId: data.parentDepartmentId || null,
                headOfDepartmentId: data.headOfDepartmentId || null,
            }

            await apiUpdateDepartmentsAdmin(department.id, body)

            mutate() // Refresh bảng
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật phòng ban <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật phòng ban:', error)
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

    if (!department) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa phòng ban
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {department.id}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tên phòng ban - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên phòng ban{' '}
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
                                            placeholder="Ví dụ: Phòng Quản lý Giao thông Thủy"
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

                        {/* Mã phòng ban - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Mã phòng ban{' '}
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
                                            placeholder="Ví dụ: QLGT"
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
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {/* ID Phòng ban cha - Tùy chọn */}
                        <FormItem label="ID Phòng ban cha (tùy chọn)">
                            <Controller
                                name="parentDepartmentId"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Nhập GUID phòng ban cha (để trống nếu là cấp cao nhất)"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${
                                                errors.parentDepartmentId
                                                    ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            }`}
                                        />
                                        {errors.parentDepartmentId && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {
                                                    errors.parentDepartmentId
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* ID Trưởng phòng - Tùy chọn */}
                        <FormItem label="ID Trưởng phòng (tùy chọn)">
                            <Controller
                                name="headOfDepartmentId"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Nhập GUID người làm trưởng phòng"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${
                                                errors.headOfDepartmentId
                                                    ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            }`}
                                        />
                                        {errors.headOfDepartmentId && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {
                                                    errors.headOfDepartmentId
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </>
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
                                        placeholder="Mô tả về nhiệm vụ, chức năng của phòng ban (tùy chọn)"
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

export default FilesEditModal
