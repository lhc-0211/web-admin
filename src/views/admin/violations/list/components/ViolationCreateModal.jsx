// src/components/violations/ViolationCreateModal.tsx

import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateViolationAdmin } from '@/services/Violations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle, HiUpload, HiX } from 'react-icons/hi'
import * as z from 'zod'
import useViolationsList from '../hooks/useViolationsList'

// Schema validation với Zod
const createViolationSchema = z.object({
    waterwayId: z.string().min(1, 'Vui lòng nhập ID tuyến đường thủy'),
    violationTypeId: z.string().min(1, 'Vui lòng nhập ID loại vi phạm'),
    title: z.string().min(1, 'Vui lòng nhập tiêu đề vi phạm'),
    description: z.string().optional(),
    violationDate: z.date({ required_error: 'Vui lòng chọn ngày vi phạm' }),
    violatorId: z.string().min(1, 'Vui lòng nhập ID đối tượng vi phạm'),
    detectedDate: z.date({ required_error: 'Vui lòng chọn ngày phát hiện' }),
    side: z.string().min(1, 'Vui lòng chọn bên vi phạm'),
    specificLocation: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    severity: z.string().min(1, 'Vui lòng chọn mức độ nghiêm trọng'),
    assignedToId: z.string().min(1, 'Vui lòng nhập ID người được giao'),
})

const severityOptions = [
    { label: 'Thấp', value: 'Low' },
    { label: 'Trung bình', value: 'Medium' },
    { label: 'Cao', value: 'High' },
    { label: 'Nghiêm trọng', value: 'Critical' },
]

const sideOptions = [
    { label: 'Trái', value: 'Left' },
    { label: 'Phải', value: 'Right' },
    { label: 'Không rõ', value: 'Unknown' },
]

const ViolationCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useViolationsList()
    const [selectedFiles, setSelectedFiles] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createViolationSchema),
        defaultValues: {
            waterwayId: '',
            violationTypeId: '',
            title: '',
            description: '',
            violationDate: new Date(),
            violatorId: '',
            detectedDate: new Date(),
            side: 'Left',
            specificLocation: '',
            address: '',
            latitude: 0,
            longitude: 0,
            severity: 'Low',
            assignedToId: '',
        },
    })

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setSelectedFiles((prev) => [...prev, ...newFiles])
        }
    }

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    // Xử lý lỗi từ backend (nếu ID không tồn tại)
    const mapBackendErrors = (backendErrors) => {
        const fieldMap = {
            WaterwayId: 'waterwayId',
            ViolationTypeId: 'violationTypeId',
            ViolatorId: 'violatorId',
            AssignedToId: 'assignedToId',
        }

        Object.keys(backendErrors).forEach((key) => {
            const fieldName = fieldMap[key]
            if (fieldName && backendErrors[key].length > 0) {
                setError(fieldName, {
                    type: 'manual',
                    message: backendErrors[key][0],
                })
            }
        })
    }

    const onSubmit = async (data) => {
        clearErrors()

        try {
            const body = {
                waterwayId: data.waterwayId || null,
                violationTypeId: data.violationTypeId || null,
                title: data.title,
                description: data.description || null,
                violationDate: data.violationDate.toISOString(),
                violatorId: data.violatorId || null,
                detectedDate: data.detectedDate.toISOString(),
                side: data.side,
                specificLocation: data.specificLocation || null,
                address: data.address || null,
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                severity: data.severity,
                assignedToId: data.assignedToId || null,
                evidenceFileIds: [],
            }

            await apiCreateViolationAdmin(body)

            mutate()
            onClose()
            reset()
            setSelectedFiles([])
            alert('Thêm vi phạm thành công!')
        } catch (error) {
            console.error('Lỗi tạo vi phạm:', error)
            const errorData = error.response?.data

            if (errorData?.errors) {
                mapBackendErrors(errorData.errors)
            } else {
                alert(
                    'Lỗi hệ thống: ' +
                        (errorData?.detail ||
                            error.message ||
                            'Không thể thêm vi phạm'),
                )
            }
        }
    }

    const handleClose = () => {
        reset()
        clearErrors()
        setSelectedFiles([])
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            className="w-full max-w-none p-0"
            width={900}
        >
            <div className="w-full max-w-[95vw] mx-auto flex flex-col h-[75vh] rounded-lg">
                <div className="border-b px-8 py-5 flex-shrink-0 rounded-t-lg">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Thêm vi phạm mới
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Tuyến đường thủy - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Tuyến đường thủy (ID){' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="waterwayId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Nhập ID tuyến đường thủy"
                                                {...field}
                                                className={`w-full transition-all duration-200 ${errors.waterwayId ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.waterwayId && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.waterwayId.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Loại vi phạm - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Loại vi phạm (ID){' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="violationTypeId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Nhập ID loại vi phạm"
                                                {...field}
                                                className={`w-full transition-all duration-200 ${errors.violationTypeId ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.violationTypeId && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.violationTypeId
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Tiêu đề - Bắt buộc */}
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
                                                placeholder="Nhập tiêu đề vi phạm"
                                                {...field}
                                                className={`w-full transition-all duration-200 ${errors.title ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.title.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Mô tả - Tùy chọn */}
                            <FormItem label="Mô tả chi tiết">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            rows={5}
                                            placeholder="Mô tả chi tiết..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Ngày vi phạm - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Ngày vi phạm{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="violationDate"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                value={field.value}
                                                onChange={(date) =>
                                                    field.onChange(date)
                                                }
                                                className={`w-full transition-all duration-200 rounded-xl ${errors.violationDate ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.violationDate && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.violationDate
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Ngày phát hiện - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Ngày phát hiện{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="detectedDate"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                value={field.value}
                                                onChange={(date) =>
                                                    field.onChange(date)
                                                }
                                                className={`w-full transition-all duration-200 rounded-xl ${errors.detectedDate ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.detectedDate && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.detectedDate
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Đối tượng vi phạm - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Đối tượng vi phạm (ID){' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="violatorId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Nhập ID đối tượng vi phạm"
                                                {...field}
                                                className={`w-full transition-all duration-200 ${errors.violatorId ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.violatorId && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.violatorId.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Bên vi phạm - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Bên vi phạm{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="side"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                options={sideOptions}
                                                value={sideOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                                isClearable={false}
                                            />
                                            {errors.side && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.side.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Các trường tùy chọn */}
                            <FormItem label="Vị trí cụ thể">
                                <Controller
                                    name="specificLocation"
                                    control={control}
                                    render={({ field }) => <Input {...field} />}
                                />
                            </FormItem>

                            <FormItem label="Địa chỉ">
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => <Input {...field} />}
                                />
                            </FormItem>

                            <FormItem label="Vĩ độ (Latitude)">
                                <Controller
                                    name="latitude"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            step="any"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Kinh độ (Longitude)">
                                <Controller
                                    name="longitude"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            step="any"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Mức độ nghiêm trọng - Bắt buộc */}
                            <FormItem
                                label={
                                    <span>
                                        Mức độ nghiêm trọng{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="severity"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                options={severityOptions}
                                                value={severityOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                            />
                                            {errors.severity && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.severity.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Người được giao - Tùy chọn */}
                            <FormItem
                                label={
                                    <span>
                                        Người được giao (ID){' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="assignedToId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Nhập ID người được giao (tùy chọn)"
                                                {...field}
                                                className={`w-full transition-all duration-200 ${errors.assignedToId ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                            />
                                            {errors.assignedToId && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.assignedToId
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Upload file bằng chứng */}
                        <div className="mt-8">
                            <FormItem label="File bằng chứng (ảnh, video, tài liệu)">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <HiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <label className="cursor-pointer">
                                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                                            Click để chọn file
                                        </span>
                                        <span className="text-gray-500">
                                            {' '}
                                            hoặc kéo thả vào đây
                                        </span>
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*,.pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Hỗ trợ nhiều file: ảnh, video, PDF,
                                        Word...
                                    </p>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="font-medium text-gray-700">
                                            Đã chọn ({selectedFiles.length}{' '}
                                            file):
                                        </p>
                                        <div className="max-h-48 overflow-y-auto border rounded-lg">
                                            {selectedFiles.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between px-4 py-2 border-b hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm truncate max-w-md">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                (
                                                                {(
                                                                    file.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2,
                                                                )}{' '}
                                                                MB)
                                                            </span>
                                                        </div>
                                                        <Button
                                                            size="xs"
                                                            variant="plain"
                                                            icon={<HiX />}
                                                            onClick={() =>
                                                                removeFile(
                                                                    index,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </FormItem>
                        </div>
                    </form>
                </div>

                <div className="border-t px-8 py-5 flex-shrink-0 rounded-b-lg flex justify-end gap-4">
                    <Button size="lg" variant="default" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        size="lg"
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Lưu vi phạm
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ViolationCreateModal
