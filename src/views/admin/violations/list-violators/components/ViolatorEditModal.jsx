import { Dialog, Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiUpdateViolatorAdmin } from '@/services/ViolationsService'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useViolatorList from '../hooks/useViolatorList'

const typeOptions = [
    { label: 'Cá nhân', value: 'Individual' },
    { label: 'Tổ chức', value: 'Organization' },
]

const editViolatorSchema = z.object({
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

const ViolatorEditModal = ({ isOpen, onClose, violator }) => {
    const { mutate } = useViolatorList()

    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editViolatorSchema),
        defaultValues: {
            name: violator?.name || '',
            type: violator?.type || 'Individual',
            phone: violator?.phone || '',
            email: violator?.email || '',
            address: violator?.address || '',
            idNumber: violator?.idNumber || '',
            taxCode: violator?.taxCode || '',
            representativeName: violator?.representativeName || '',
            notes: violator?.notes || '',
        },
    })

    // Reset form khi mở modal với dữ liệu mới
    React.useEffect(() => {
        if (isOpen && violator) {
            reset({
                name: violator.name || '',
                type: violator.type || 'Individual',
                phone: violator.phone || '',
                email: violator.email || '',
                address: violator.address || '',
                idNumber: violator.idNumber || '',
                taxCode: violator.taxCode || '',
                representativeName: violator.representativeName || '',
                notes: violator.notes || '',
            })
        }
    }, [isOpen, violator, reset])

    const onSubmit = async (data) => {
        clearErrors()

        try {
            await apiUpdateViolatorAdmin(violator.id, data)
            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật đối tượng vi phạm :{' '}
                    <strong>{violator.name}</strong> thành công!
                </Notification>,
            )
            mutate() // Refresh danh sách
            onClose()
        } catch (error) {
            console.error('Lỗi cập nhật:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {error.message || 'Lỗi hệ thống'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        clearErrors()
        onClose()
    }

    if (!violator) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-4">
                    <h3 className="text-xl font-semibold">
                        Sửa đối tượng vi phạm
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID: {violator.id}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[50vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Tên đối tượng *">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder="Nhập tên đối tượng"
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

                        <FormItem label="Loại đối tượng *">
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
                                                field.onChange(opt?.value ?? '')
                                            }
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

                        <FormItem label="Số điện thoại">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập số điện thoại"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Email">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Nhập email"
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

                        <FormItem label="Địa chỉ">
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập địa chỉ"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="CMND/CCCD">
                            <Controller
                                name="idNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập số CMND/CCCD"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Mã số thuế">
                            <Controller
                                name="taxCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập mã số thuế"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Người đại diện">
                            <Controller
                                name="representativeName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nhập tên người đại diện"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Ghi chú" className="md:col-span-2">
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={4}
                                        {...field}
                                        placeholder="Ghi chú thêm (nếu có)"
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
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ViolatorEditModal
