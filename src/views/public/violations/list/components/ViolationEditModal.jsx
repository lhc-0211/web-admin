import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
    apiGetViolation,
    apiUpdateViolationPublic,
} from '@/services/ViolationsService' // bạn cần tạo apiGet + apiUpdate
import useAllViolatorList from '@/views/admin/violations/list-violators/hooks/useAllViolatorList'
import useAllViolationTypes from '@/views/admin/violations/violation-types/hooks/useAllViolationTypes'
import useAllWaterways from '@/views/admin/violations/waterways/hooks/useAllWaterways'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiMap } from 'react-icons/hi'
import * as z from 'zod'
import useViolationsList from '../hooks/useViolationsList'
import MapPickerModal from './MapPickerModal'

// Schema giống create, nhưng một số trường optional khi edit
const editViolationSchema = z.object({
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
    assignedToId: z.string().optional(),
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

const ViolationEditModal = ({ isOpen, onClose, violationId }) => {
    const { mutate } = useViolationsList()
    const [isMapOpen, setIsMapOpen] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)

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
        resolver: zodResolver(editViolationSchema),
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

    // Load chi tiết khi mở modal
    useEffect(() => {
        if (!isOpen || !violationId) {
            reset()
            return
        }

        const fetchDetail = async () => {
            setLoadingDetail(true)
            try {
                const response = await apiGetViolation(violationId)
                const data = response

                reset({
                    waterwayId: data.waterwayId || '',
                    violationTypeId: data.violationTypeId || '',
                    title: data.title || '',
                    description: data.description || '',
                    violationDate: data.violationDate
                        ? new Date(data.violationDate)
                        : new Date(),
                    detectedDate: data.detectedDate
                        ? new Date(data.detectedDate)
                        : new Date(),
                    violatorId: data.violatorId || '',
                    side: data.side || 'Left',
                    specificLocation: data.specificLocation || '',
                    address: data.address || '',
                    latitude: data.latitude ?? undefined,
                    longitude: data.longitude ?? undefined,
                    severity: data.severity || 'Low',
                    assignedToId: data.assignedToId || '',
                })
            } catch (error) {
                toast.push(
                    <Notification title="Lỗi" type="danger">
                        Không tải được dữ liệu vi phạm!
                    </Notification>,
                )
            } finally {
                setLoadingDetail(false)
            }
        }

        fetchDetail()
    }, [isOpen, violationId, reset])

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
                assignedToId: data.assignedToId || null,
                evidenceFileIds: [],
            }

            await apiUpdateViolationPublic(violationId, body)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật vi phạm thành công!
                </Notification>,
            )
            onClose()
        } catch (error) {
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

    const handleMapSelect = (lat, lng, address) => {
        setValue('latitude', lat)
        setValue('longitude', lng)
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
                        <h3 className="text-2xl font-bold">
                            Chỉnh sửa vi phạm
                        </h3>
                    </div>

                    {loadingDetail ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="loading loading-spinner loading-lg"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Các field giống create modal, chỉ copy paste */}
                                        <FormItem label="Tuyến đường thủy *">
                                            <Controller
                                                name="waterwayId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={
                                                            waterwaysOptions
                                                        }
                                                        value={waterwaysOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        )}
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value ??
                                                                    '',
                                                            )
                                                        }
                                                        placeholder={
                                                            isLoadingWaterways
                                                                ? 'Đang tải...'
                                                                : 'Chọn tuyến'
                                                        }
                                                        isLoading={
                                                            isLoadingWaterways
                                                        }
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

                                        <FormItem label="Loại vi phạm *">
                                            <Controller
                                                name="violationTypeId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={
                                                            violationTypesOptions
                                                        }
                                                        value={violationTypesOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        )}
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value ??
                                                                    '',
                                                            )
                                                        }
                                                        placeholder={
                                                            isLoadingViolationTypes
                                                                ? 'Đang tải...'
                                                                : 'Chọn loại'
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
                                                    {
                                                        errors.violationTypeId
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </FormItem>

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
                                                        placeholder="Nhập tiêu đề"
                                                    />
                                                )}
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.title.message}
                                                </p>
                                            )}
                                        </FormItem>

                                        <FormItem label="Đối tượng vi phạm *">
                                            <Controller
                                                name="violatorId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={
                                                            violatorsOptions
                                                        }
                                                        value={violatorsOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        )}
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value ??
                                                                    '',
                                                            )
                                                        }
                                                        placeholder={
                                                            isLoadingViolator
                                                                ? 'Đang tải...'
                                                                : 'Chọn đối tượng'
                                                        }
                                                        isLoading={
                                                            isLoadingViolator
                                                        }
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

                                        <FormItem label="Người được giao xử lý">
                                            <Controller
                                                name="assignedToId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="ID người xử lý"
                                                    />
                                                )}
                                            />
                                        </FormItem>

                                        <FormItem label="Ngày vi phạm *">
                                            <Controller
                                                name="violationDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.violationDate && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {
                                                        errors.violationDate
                                                            .message
                                                    }
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
                                                        onChange={
                                                            field.onChange
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.detectedDate && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {
                                                        errors.detectedDate
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </FormItem>

                                        <FormItem label="Bên vi phạm *">
                                            <Controller
                                                name="side"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={sideOptions}
                                                        value={sideOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        )}
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value ??
                                                                    '',
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
                                                        options={
                                                            severityOptions
                                                        }
                                                        value={severityOptions.find(
                                                            (o) =>
                                                                o.value ===
                                                                field.value,
                                                        )}
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value ??
                                                                    '',
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

                                        <FormItem
                                            label="Vị trí cụ thể"
                                            className="lg:col-span-2"
                                        >
                                            <Controller
                                                name="specificLocation"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Km 15+200..."
                                                    />
                                                )}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Vị trí trên bản đồ"
                                            className="lg:col-span-2"
                                        >
                                            <Button
                                                variant="solid"
                                                icon={<HiMap />}
                                                onClick={() =>
                                                    setIsMapOpen(true)
                                                }
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
                                                                        e.target
                                                                            .value,
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
                                                                        e.target
                                                                            .value,
                                                                    ) || null,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </FormItem>

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
                                                        placeholder="Mô tả chi tiết..."
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
                                    Cập nhật vi phạm
                                </Button>
                            </div>
                        </>
                    )}
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

export default ViolationEditModal
