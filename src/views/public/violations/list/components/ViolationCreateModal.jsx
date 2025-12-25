import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateViolationsPublic } from '@/services/ViolationsService'
import { useSessionUser } from '@/store/authStore'
import useAllViolatorList from '@/views/admin/violations/list-violators/hooks/useAllViolatorList'
import useAllViolationTypes from '@/views/admin/violations/violation-types/hooks/useAllViolationTypes'
import useAllWaterways from '@/views/admin/violations/waterways/hooks/useAllWaterways'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiMap, HiUpload, HiX } from 'react-icons/hi'
import * as z from 'zod'
import useViolationsList from '../hooks/useViolationsList'
import MapPickerModal from './MapPickerModal'

// Schema Zod đúng theo API
const createViolationSchema = z.object({
    waterwayId: z.string().min(1, 'Vui lòng chọn tuyến đường thủy'),
    violationTypeId: z.string().min(1, 'Vui lòng chọn loại vi phạm'),
    title: z.string().min(1, 'Vui lòng nhập tiêu đề vi phạm'),
    description: z.string().min(1, 'Vui lòng nhập mô tả chi tiết'),
    violationDate: z.date({ required_error: 'Vui lòng chọn ngày vi phạm' }),
    detectedDate: z.date({ required_error: 'Vui lòng chọn ngày phát hiện' }),
    violatorId: z.string().min(1, 'Vui lòng chọn đối tượng vi phạm'),
    side: z.string().min(1, 'Vui lòng chọn bên vi phạm'),
    specificLocation: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    severity: z.string().min(1, 'Vui lòng chọn mức độ nghiêm trọng'),
    assignedToId: z.string().optional(), // tùy backend có bắt buộc không
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

    const { id } = useSessionUser((state) => state.user)

    const { waterways, isLoading: isLoadingWaterways } = useAllWaterways()
    const { violationTypes, isLoading: isLoadingViolationTypes } =
        useAllViolationTypes()
    const { violators, isLoading: isLoadingViolator } = useAllViolatorList()

    const waterwaysOptions =
        waterways?.map((w) => ({
            label: `${w.name} (${w.code})`,
            value: w.id,
        })) || []

    const violationTypesOptions =
        violationTypes?.map((v) => ({
            label: `${v.name} (${v.code})`,
            value: v.id,
        })) || []

    const violatorsOptions =
        violators?.map((v) => ({
            label: v.name,
            value: v.id,
        })) || []

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createViolationSchema),
        defaultValues: {
            waterwayId: '',
            violationTypeId: '',
            title: '',
            description: '',
            violationDate: new Date(),
            detectedDate: new Date(),
            violatorId: '',
            side: 'Left',
            specificLocation: '',
            address: '',
            latitude: undefined,
            longitude: undefined,
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

    const onSubmit = async (data) => {
        try {
            const body = {
                waterwayId: data.waterwayId,
                violationTypeId: data.violationTypeId,
                title: data.title.trim(),
                description: data.description.trim(),
                violationDate: data.violationDate.toISOString(),
                detectedDate: data.detectedDate.toISOString(),
                violatorId: data.violatorId,
                side: data.side,
                specificLocation: data.specificLocation || null,
                address: data.address || null,
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
                severity: data.severity,
                assignedToId: id || null,
                evidenceFileIds: [],
            }

            await apiCreateViolationsPublic(body)
            mutate() // refresh danh sách
            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm vi phạm thành công!
                </Notification>,
            )
            handleClose()
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo vi phạm thất bại:{' '}
                    {error?.response?.data?.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        setSelectedFiles([])
        onClose()
    }

    const handleMapSelect = (lat, lng, address) => {
        setValue('latitude', lat, { shouldValidate: true })
        setValue('longitude', lng, { shouldValidate: true })
        if (address) setValue('address', address)
        setIsMapOpen(false)
    }

    return (
        <>
            <Dialog
                isOpen={isOpen}
                onClose={handleClose}
                width={1000}
                className="p-0"
            >
                <div className="flex flex-col h-[80vh]">
                    <div className="border-b px-8 py-6">
                        <h3 className="text-2xl font-bold">Thêm vi phạm mới</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Tuyến đường thủy */}
                                <FormItem label="Tuyến đường thủy *">
                                    <Controller
                                        name="waterwayId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={waterwaysOptions}
                                                value={waterwaysOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
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
                                                isLoading={isLoadingWaterways}
                                                isSearchable
                                            />
                                        )}
                                    />
                                    {errors.waterwayId && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.waterwayId.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Loại vi phạm */}
                                <FormItem label="Loại vi phạm *">
                                    <Controller
                                        name="violationTypeId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={violationTypesOptions}
                                                value={violationTypesOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
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
                                            />
                                        )}
                                    />
                                    {errors.violationTypeId && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.violationTypeId.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Tiêu đề */}
                                <FormItem
                                    label="Tiêu đề *"
                                    className="lg:col-span-2"
                                >
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Nhập tiêu đề vi phạm"
                                            />
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Đối tượng vi phạm */}
                                <FormItem label="Đối tượng vi phạm *">
                                    <Controller
                                        name="violatorId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={violatorsOptions}
                                                value={violatorsOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                                placeholder={
                                                    isLoadingViolator
                                                        ? 'Đang tải...'
                                                        : 'Chọn đối tượng'
                                                }
                                                isLoading={isLoadingViolator}
                                                isSearchable
                                            />
                                        )}
                                    />
                                    {errors.violatorId && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.violatorId.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Người xử lý (assignedToId) */}
                                {/* <FormItem label="Người được giao xử lý">
                                    <Controller
                                        name="assignedToId"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="ID người xử lý (tùy chọn)"
                                            />
                                        )}
                                    />
                                </FormItem> */}

                                {/* Ngày vi phạm & Ngày phát hiện */}
                                <FormItem label="Ngày vi phạm *">
                                    <Controller
                                        name="violationDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.violationDate && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.violationDate.message}
                                        </p>
                                    )}
                                </FormItem>

                                <FormItem label="Ngày phát hiện *">
                                    <Controller
                                        name="detectedDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.detectedDate && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.detectedDate.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Bên vi phạm & Mức độ */}
                                <FormItem label="Bên vi phạm *">
                                    <Controller
                                        name="side"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={sideOptions}
                                                value={sideOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    {errors.side && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.side.message}
                                        </p>
                                    )}
                                </FormItem>

                                <FormItem label="Mức độ nghiêm trọng *">
                                    <Controller
                                        name="severity"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={severityOptions}
                                                value={severityOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                    {errors.severity && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.severity.message}
                                        </p>
                                    )}
                                </FormItem>

                                {/* Vị trí cụ thể */}
                                <FormItem
                                    label="Vị trí cụ thể (Km...)"
                                    className="lg:col-span-2"
                                >
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

                                {/* Bản đồ */}
                                <FormItem
                                    label="Vị trí trên bản đồ"
                                    className="lg:col-span-2"
                                >
                                    <Button
                                        variant="solid"
                                        icon={<HiMap />}
                                        onClick={() => setIsMapOpen(true)}
                                        className="w-full"
                                    >
                                        {watchedLat && watchedLng
                                            ? `Đã chọn: ${watchedLat.toFixed(6)}, ${watchedLng.toFixed(6)}`
                                            : 'Chọn vị trí trên bản đồ'}
                                    </Button>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Controller
                                            name="latitude"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Vĩ độ"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || null,
                                                        )
                                                    }
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
                                                    placeholder="Kinh độ"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || null,
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                </FormItem>

                                {/* Địa chỉ */}
                                <FormItem
                                    label="Địa chỉ"
                                    className="lg:col-span-2"
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

                                {/* Mô tả chi tiết */}
                                <FormItem
                                    label="Mô tả chi tiết *"
                                    className="lg:col-span-2"
                                >
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                textArea
                                                rows={5}
                                                {...field}
                                                placeholder="Mô tả chi tiết vi phạm..."
                                            />
                                        )}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </FormItem>
                            </div>

                            {/* Upload file */}
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
                                    <div className="mt-4">
                                        <p className="font-medium mb-2">
                                            Đã chọn ({selectedFiles.length}{' '}
                                            file):
                                        </p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg">
                                            {selectedFiles.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center px-4 py-2 border-b"
                                                    >
                                                        <div className="truncate">
                                                            <span className="text-sm">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500 ml-2">
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
                                        <p className="text-xs text-amber-600 mt-2">
                                            * File sẽ được upload sau khi lưu
                                            (chưa xử lý evidenceFileIds)
                                        </p>
                                    </div>
                                )}
                            </FormItem>
                        </form>
                    </div>

                    <div className="border-t px-8 py-5 flex justify-end gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            size="lg"
                            loading={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Lưu vi phạm
                        </Button>
                    </div>
                </div>
            </Dialog>

            <MapPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onSelect={handleMapSelect}
                initialLat={watchedLat || 16.054407}
                initialLng={watchedLng || 108.202166}
            />
        </>
    )
}

export default ViolationCreateModal
