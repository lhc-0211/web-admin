import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateViolatorAdmin } from '@/services/Violations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useViolatorList from '../hooks/useViolatorList'

const typeOptions = [
    { label: 'Cá nhân', value: 'Individual' },
    { label: 'Tổ chức', value: 'Organization' },
]

const createViolatorSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên đối tượng'),
    type: z.string().min(1, 'Vui lòng chọn loại đối tượng'),
    phone: z.string().optional(),
    email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    address: z.string().optional(),
    idNumber: z.string().optional(),
    taxCode: z.string().optional(),
    representativeName: z.string().optional(),
    notes: z.string().optional(),
})

const ViolatorCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useViolatorList()

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createViolatorSchema),
        defaultValues: {
            name: '',
            type: 'Individual',
            phone: '',
            email: '',
            address: '',
            idNumber: '',
            taxCode: '',
            representativeName: '',
            notes: '',
        },
    })

    const onSubmit = async (data) => {
        clearErrors()

        try {
            const body = {
                name: data.name,
                type: data.type,
                phone: data.phone || null,
                email: data.email || null,
                address: data.address || null,
                idNumber: data.idNumber || null,
                taxCode: data.taxCode || null,
                representativeName: data.representativeName || null,
                notes: data.notes || null,
            }

            await apiCreateViolatorAdmin(body)

            mutate() // Refresh danh sách violators
            onClose()
            reset()
            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm đối tượng vi phạm thành công!
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Thêm mới thất bại: {error.message || 'Lỗi hệ thống'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        clearErrors()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-4">
                    <h3 className="text-xl font-semibold">
                        Thêm mới đối tượng vi phạm
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[55vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên đối tượng - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Tên đối tượng{' '}
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
                                            placeholder="Nhập tên đối tượng"
                                            {...field}
                                            className={`w-full transition-all duration-200 ${errors.name ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
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

                        {/* Loại đối tượng - Bắt buộc */}
                        <FormItem
                            label={
                                <span>
                                    Loại đối tượng{' '}
                                    <span className="text-red-600">*</span>
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
                                                    opt?.value ?? 'Individual',
                                                )
                                            }
                                            className={`w-full transition-all duration-200 ${errors.type ? 'border-red-500 ring-2 ring-red-200 focus:border-red-600 focus:ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                                        />
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.type.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Số điện thoại */}
                        <FormItem label="Số điện thoại">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Email */}
                        <FormItem label="Email">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            type="email"
                                            placeholder="Nhập email"
                                            {...field}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <HiExclamationCircle />
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </FormItem>

                        {/* Địa chỉ */}
                        <FormItem label="Địa chỉ">
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập địa chỉ"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* CMND/CCCD */}
                        <FormItem label="CMND/CCCD">
                            <Controller
                                name="idNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập số CMND/CCCD"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Mã số thuế */}
                        <FormItem label="Mã số thuế">
                            <Controller
                                name="taxCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập mã số thuế"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Người đại diện */}
                        <FormItem label="Người đại diện">
                            <Controller
                                name="representativeName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập tên người đại diện"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Ghi chú - full width */}
                        <FormItem label="Ghi chú" className="md:col-span-2">
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={4}
                                        placeholder="Ghi chú thêm (nếu có)"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </form>

                <div className="border-t px-6 py-4 flex justify-end gap-3">
                    <Button variant="default" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Thêm mới
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ViolatorCreateModal
