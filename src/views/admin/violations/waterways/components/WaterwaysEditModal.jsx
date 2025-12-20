// src/components/waterways/WaterwaysEditModal.tsx

import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiUpdateWaterwayAdmin } from '@/services/ViolationsService' // API update tuyến đường thủy
import useAllDepartments from '@/views/admin/user/departments/hooks/userAllDepartments'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useWaterways from '../hooks/useWaterways' // Hook đúng

const typeOptions = [
    { label: 'Sông', value: 'River' },
    { label: 'Kênh', value: 'Canal' },
    { label: 'Hồ', value: 'Lake' },
    { label: 'Biển', value: 'Sea' },
]

// Schema validation cho form sửa tuyến đường thủy
const editWaterwaySchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên tuyến đường thủy'),
    code: z.string().min(1, 'Vui lòng nhập mã tuyến'),
    departmentId: z
        .string()
        .uuid('ID phòng ban không hợp lệ')
        .min(1, 'Vui lòng nhập ID phòng ban'),
    type: z.string().min(1, 'Vui lòng chọn loại tuyến'),
    description: z.string().optional(),
    location: z.string().optional(),
    length: z.number().positive('Chiều dài phải lớn hơn 0'),
    displayOrder: z.number().int().nonnegative('Thứ tự phải là số không âm'),
})

const WaterwaysEditModal = ({ isOpen, onClose, waterway }) => {
    const { mutate } = useWaterways()

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
        resolver: zodResolver(editWaterwaySchema),
        defaultValues: {
            name: waterway?.name || '',
            code: waterway?.code || '',
            departmentId: waterway?.departmentId || '',
            type: waterway?.type || 'River',
            description: waterway?.description || '',
            location: waterway?.location || '',
            length: waterway?.length ?? 0,
            displayOrder: waterway?.displayOrder ?? 0,
        },
    })

    // Reset form khi mở modal với dữ liệu mới
    React.useEffect(() => {
        if (isOpen && waterway) {
            reset({
                name: waterway.name || '',
                code: waterway.code || '',
                departmentId: waterway.departmentId || '',
                type: waterway.type || 'River',
                description: waterway.description || '',
                location: waterway.location || '',
                length: waterway.length ?? 0,
                displayOrder: waterway.displayOrder ?? 0,
            })
        }
    }, [isOpen, waterway, reset])

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                code: data.code,
                departmentId: data.departmentId,
                type: data.type,
                description: data.description || null,
                location: data.location || null,
                length: data.length || 0,
                displayOrder: data.displayOrder,
            }

            await apiUpdateWaterwayAdmin(waterway.id, body)

            mutate() // Refresh bảng
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật tuyến đường thủy <strong>{data.name}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật tuyến đường thủy:', error)
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

    if (!waterway) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa tuyến đường thủy
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {waterway.id}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 space-y-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tên tuyến - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên tuyến{' '}
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
                                            placeholder="Ví dụ: Sông Hồng"
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

                        {/* Mã tuyến - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Mã tuyến{' '}
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
                                            placeholder="Ví dụ: SH"
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

                        {/* ID Phòng ban - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    ID Phòng ban{' '}
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

                        {/* Loại tuyến - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Loại tuyến{' '}
                                    <span className="text-red-600 font-medium">
                                        *
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            options={typeOptions}
                                            value={typeOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(
                                                    opt?.value ?? 'River',
                                                )
                                            }
                                        />
                                        {errors.type && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.type.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Chiều dài (km) */}
                        <FormItem label="Chiều dài (km)">
                            <Controller
                                name="length"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Ví dụ: 150.5"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                    />
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

                        {/* Vị trí địa lý */}
                        <FormItem
                            label="Vị trí địa lý"
                            className="md:col-span-2"
                        >
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Ví dụ: Từ Hà Nội đến Hải Phòng"
                                        {...field}
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
                                        placeholder="Mô tả chi tiết về tuyến đường thủy (tùy chọn)"
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

export default WaterwaysEditModal
