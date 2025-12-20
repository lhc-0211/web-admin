// src/components/violations/ViolationCreateModal.tsx

import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateViolationAdmin } from '@/services/ViolationsService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle, HiMap, HiUpload, HiX } from 'react-icons/hi'
import * as z from 'zod'
import useAllViolatorList from '../../list-violators/hooks/useAllViolatorList'
import useAllViolationTypes from '../../violation-types/hooks/useAllViolationTypes'
import useAllWaterways from '../../waterways/hooks/useAllWaterways'
import useViolationsList from '../hooks/useViolationsList'
import MapPickerModal from './MapPickerModal'

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
    const [isMapOpen, setIsMapOpen] = useState(false)

    const { waterways, isLoading: isLoadingWaterways } = useAllWaterways()
    const { violationTypes, isLoading: isLoadingViolationTypes } =
        useAllViolationTypes()
    const { violators, isLoading: isLoadingViolator } = useAllViolatorList()

    const waterwaysOptions = waterways.map((wat) => ({
        label: `${wat.name} (${wat.code})`,
        value: wat.id,
    }))

    const violationTypesOptions = violationTypes.map((vio) => ({
        label: `${vio.name} (${vio.code})`,
        value: vio.id,
    }))

    const violatorsOptions = violators.map((vio) => ({
        label: `${vio.name}`,
        value: vio.id,
    }))

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        watch,
        setValue,
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

    const watchedLat = watch('latitude')
    const watchedLng = watch('longitude')

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
                title: data.title?.trim() || null,
                description: data.description?.trim() || null,
                violationDate: data.violationDate.toISOString(),
                violatorId: data.violatorId || null,
                detectedDate: data.detectedDate.toISOString(),
                side: data.side,
                specificLocation: data.specificLocation || null,
                address: data.address || null,
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                severity: data.severity,
                assignedToId: '09e8732a-64a8-430e-8a64-6b35e34bed5e' || null,
                evidenceFileIds: null,
            }

            await apiCreateViolationAdmin(body)

            mutate()
            onClose()
            reset()
            setSelectedFiles([])
            alert('Thêm vi phạm thành công!')
        } catch (error) {
            const errorData = error.response?.data

            let message = 'Lỗi hệ thống'

            if (errorData?.errors) {
                // Lấy lỗi đầu tiên từ backend
                const firstKey = Object.keys(errorData.errors)[0]
                message = errorData.errors[firstKey][0]
            } else if (errorData?.detail) {
                message = errorData.detail
            }

            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo vi phạm thất bại: {message}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        clearErrors()
        setSelectedFiles([])
        onClose()
    }

    // Hàm xử lý chọn vị trí từ bản đồ
    const handleMapSelect = async (lat, lng, address) => {
        setValue('latitude', lat, { shouldValidate: true })
        setValue('longitude', lng, { shouldValidate: true })
        if (address) {
            setValue('address', address)
        }
        setIsMapOpen(false)
    }

    return (
        <>
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
                                {/* 1. Tuyến đường thủy - Bắt buộc */}
                                <FormItem
                                    label={
                                        <span>
                                            Tuyến đường thủy (ID){' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </span>
                                    }
                                >
                                    <Controller
                                        name="waterwayId"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    options={waterwaysOptions}
                                                    value={waterwaysOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value ?? '',
                                                        )
                                                    }
                                                    placeholder={
                                                        isLoadingWaterways
                                                            ? 'Đang tải...'
                                                            : 'Chọn tuyến đường thủy'
                                                    }
                                                    isLoading={
                                                        isLoadingWaterways
                                                    }
                                                    isSearchable
                                                    isClearable={false}
                                                />
                                                {errors.waterwayId && (
                                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                        <HiExclamationCircle className="text-base" />
                                                        {
                                                            errors.waterwayId
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </FormItem>

                                {/* 2. Loại vi phạm - Bắt buộc */}
                                <FormItem
                                    label={
                                        <span>
                                            Loại vi phạm (ID){' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </span>
                                    }
                                >
                                    <Controller
                                        name="violationTypeId"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    options={
                                                        violationTypesOptions
                                                    }
                                                    value={violationTypesOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value ?? '',
                                                        )
                                                    }
                                                    placeholder={
                                                        isLoadingViolationTypes
                                                            ? 'Đang tải...'
                                                            : 'Chọn loại vi phạm'
                                                    }
                                                    isLoading={
                                                        isLoadingViolationTypes
                                                    }
                                                    isSearchable
                                                    isClearable={false}
                                                />
                                                {errors.violationTypeId && (
                                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                        <HiExclamationCircle className="text-base" />
                                                        {
                                                            errors
                                                                .violationTypeId
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </FormItem>

                                {/* 3. Tiêu đề - Bắt buộc */}
                                <FormItem
                                    label={
                                        <span>
                                            Tiêu đề{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                                    className={`w-full transition-all duration-200 ${errors.title ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : ''}`}
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

                                {/* 3. Người báo cáo - Bắt buộc */}
                                <FormItem
                                    label={
                                        <span>
                                            Người báo cáo{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </span>
                                    }
                                >
                                    <Controller
                                        name="assignedToId"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    placeholder="Nhập tiêu đề vi phạm"
                                                    {...field}
                                                    className={`w-full transition-all duration-200 ${errors.assignedToId ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : ''}`}
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

                                {/* 11. Mức độ nghiêm trọng */}
                                <FormItem
                                    label={
                                        <span>
                                            Mức độ nghiêm trọng{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                                        {
                                                            errors.severity
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </FormItem>

                                {/* 4. Đối tượng vi phạm */}
                                <FormItem
                                    label={
                                        <span>
                                            Đối tượng vi phạm (ID){' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </span>
                                    }
                                >
                                    <Controller
                                        name="violatorId"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    options={violatorsOptions}
                                                    value={violatorsOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value ?? '',
                                                        )
                                                    }
                                                    placeholder={
                                                        isLoadingViolator
                                                            ? 'Đang tải...'
                                                            : 'Chọn đối tượng vi phạm'
                                                    }
                                                    isLoading={
                                                        isLoadingViolator
                                                    }
                                                    isSearchable
                                                    isClearable={false}
                                                />
                                                {errors.violatorId && (
                                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                        <HiExclamationCircle className="text-base" />
                                                        {
                                                            errors.violatorId
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </FormItem>

                                {/* 5. Ngày vi phạm */}
                                <FormItem
                                    label={
                                        <span>
                                            Ngày vi phạm{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                                    className={`w-full transition-all duration-200 rounded-xl ${errors.violationDate ? 'border-red-500 ring-2 ring-red-200' : ''}`}
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

                                {/* 6. Ngày phát hiện */}
                                <FormItem
                                    label={
                                        <span>
                                            Ngày phát hiện{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                                    className={`w-full transition-all duration-200 rounded-xl ${errors.detectedDate ? 'border-red-500 ring-2 ring-red-200' : ''}`}
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

                                {/* 7. Bên vi phạm */}
                                <FormItem
                                    label={
                                        <span>
                                            Bên vi phạm{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
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

                                {/* 8. Vị trí cụ thể */}
                                <FormItem label="Vị trí cụ thể">
                                    <Controller
                                        name="specificLocation"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Ví dụ: Km 15+200"
                                            />
                                        )}
                                    />
                                </FormItem>

                                {/* 10. Tọa độ */}
                                <FormItem
                                    label="Vị trí vi phạm trên bản đồ"
                                    className="lg:col-span-2"
                                >
                                    <div className="space-y-4">
                                        <Button
                                            variant="solid"
                                            onClick={() => setIsMapOpen(true)}
                                            icon={<HiMap className="text-lg" />}
                                            className="w-full justify-center"
                                        >
                                            {watchedLat && watchedLng
                                                ? `Đã chọn: ${watchedLat.toFixed(6)}, ${watchedLng.toFixed(6)}`
                                                : 'Click để chọn vị trí trên bản đồ'}
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Controller
                                                name="latitude"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="Vĩ độ (Latitude)"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value,
                                                                ) || null,
                                                            )
                                                        }
                                                        className="font-mono text-sm"
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="longitude"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="Kinh độ (Longitude)"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value,
                                                                ) || null,
                                                            )
                                                        }
                                                        className="font-mono text-sm"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </FormItem>
                                {/* 9. Địa chỉ */}
                                <FormItem
                                    label="Địa chỉ"
                                    className="col-span-2"
                                >
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Xã/Phường, Huyện, Tỉnh"
                                            />
                                        )}
                                    />
                                </FormItem>

                                {/* 12. Mô tả chi tiết - Đưa xuống dưới cùng phần thông tin chính */}
                                <FormItem
                                    label="Mô tả chi tiết"
                                    className="lg:col-span-2"
                                >
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                textArea
                                                rows={5}
                                                placeholder="Mô tả chi tiết về vi phạm..."
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            {/* Upload file bằng chứng - Để cuối cùng */}
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
                        <Button
                            size="lg"
                            variant="default"
                            onClick={handleClose}
                        >
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
            {/* Modal chọn bản đồ */}
            {isMapOpen && (
                <MapPickerModal
                    isOpen={isMapOpen}
                    onClose={() => setIsMapOpen(false)}
                    onSelect={handleMapSelect}
                    initialLat={watchedLat || 16.054407}
                    initialLng={watchedLng || 108.202166}
                />
            )}
        </>
    )
}

export default ViolationCreateModal
