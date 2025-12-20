import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiCreateIssuingAuthoritiesAdmin } from '@/services/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useIssuingAuthorities from '../hooks/useIssuingAuthorities'

// Schema validation cho form thêm mới cơ quan cấp
const createIssuingAuthoritySchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên cơ quan'),
    shortName: z.string().min(1, 'Vui lòng nhập tên viết tắt'),
    code: z.string().min(1, 'Vui lòng nhập mã cơ quan'),
    description: z.string().optional(),
    address: z.string().optional(),
    website: z
        .string()
        .url('Website phải là URL hợp lệ')
        .optional()
        .or(z.literal('')),
    displayOrder: z
        .number()
        .int()
        .nonnegative('Thứ tự hiển thị phải là số không âm')
        .default(0),
})

const IssuingAuthoritiesCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useIssuingAuthorities()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createIssuingAuthoritySchema),
        defaultValues: {
            name: '',
            shortName: '',
            code: '',
            description: '',
            address: '',
            website: '',
            displayOrder: 0,
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                shortName: data.shortName,
                code: data.code,
                description: data.description || null,
                address: data.address || null,
                website: data.website || null,
                displayOrder: data.displayOrder,
            }

            await apiCreateIssuingAuthoritiesAdmin(body)

            mutate() // Refresh danh sách
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm cơ quan cấp <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi thêm cơ quan cấp:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Thêm cơ quan cấp thất bại:{' '}
                    {error?.response?.data?.message ||
                        error?.message ||
                        'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Thêm mới cơ quan ban hành
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tên cơ quan - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên cơ quan{' '}
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
                                            placeholder="Ví dụ: Cục Đăng kiểm Việt Nam"
                                            {...field}
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

                        {/* Tên viết tắt - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên viết tắt{' '}
                                    <span className="text-red-600 font-medium">
                                        *
                                    </span>
                                </span>
                            }
                        >
                            <Controller
                                name="shortName"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: VR"
                                            {...field}
                                        />
                                        {errors.shortName && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.shortName.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Mã cơ quan - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Mã cơ quan{' '}
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
                                            placeholder="Ví dụ: DKVN"
                                            {...field}
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

                        {/* Địa chỉ */}
                        <FormItem label="Địa chỉ (tùy chọn)">
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Ví dụ: 18 Phạm Hùng, Hà Nội"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Website */}
                        <FormItem label="Website (tùy chọn)">
                            <Controller
                                name="website"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="https://www.vr.org.vn"
                                            {...field}
                                        />
                                        {errors.website && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle className="text-base" />
                                                {errors.website.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Mô tả - full width */}
                        <FormItem
                            label="Mô tả (tùy chọn)"
                            className="md:col-span-2"
                        >
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={4}
                                        placeholder="Mô tả về cơ quan cấp phát, chức năng, phạm vi hoạt động..."
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
                        Thêm cơ quan cấp
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default IssuingAuthoritiesCreateModal
