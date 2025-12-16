import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateWaterwayAdmin } from '@/services/Violations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useWaterways from '../hooks/useWaterways'

const typeOptions = [
    { label: 'Sông', value: 'River' },
    { label: 'Kênh', value: 'Canal' },
    { label: 'Hồ', value: 'Lake' },
    { label: 'Biển', value: 'Sea' },
    // Thêm loại khác nếu cần
]

// Schema validation cho form thêm mới tuyến đường thủy
const createWaterwaySchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên tuyến đường thủy'),
    code: z.string().min(1, 'Vui lòng nhập mã tuyến'),
    departmentId: z
        .string()
        .uuid('ID phòng ban không hợp lệ')
        .min(1, 'Vui lòng nhập ID phòng ban'),
    type: z.string().min(1, 'Vui lòng chọn loại tuyến'),
    description: z.string().optional(),
    location: z.string().optional(),
    length: z.number().nonnegative('Chiều dài phải là số không âm').optional(),
    displayOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự phải là số không âm')
        .default(0),
})

const WaterwaysCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useWaterways()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createWaterwaySchema),
        defaultValues: {
            name: '',
            code: '',
            departmentId: '',
            type: 'River',
            description: '',
            location: '',
            length: 0,
            displayOrder: 0,
        },
    })

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

            await apiCreateWaterwayAdmin(body)

            mutate() // Refresh bảng
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm tuyến đường thủy <strong>{data.name}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi thêm tuyến đường thủy:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Thêm tuyến đường thủy thất bại:{' '}
                    {error.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Thêm mới tuyến đường thủy
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-2 space-y-2 overflow-y-auto max-h-[55vh]"
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
                                            placeholder="Ví dụ: Sông Hồng, Kênh Nhiêu Lộc"
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
                                            placeholder="Ví dụ: SH, KNL"
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
                                        <Input
                                            placeholder="Nhập GUID phòng ban quản lý"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${
                                                errors.departmentId
                                                    ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                            }`}
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
                        Thêm tuyến đường thủy
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default WaterwaysCreateModal
