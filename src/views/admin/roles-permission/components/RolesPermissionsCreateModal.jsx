import { useMemo, useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Segment from '@/components/ui/Segment'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import ScrollBar from '@/components/ui/ScrollBar'
import { FormItem } from '@/components/ui/Form'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useRolePermissonsRoles from '../hooks/useRolePermissonsRoles'
import { apiCreateRoleAdmin } from '@/services/AuthRoles'
import { Notification, toast } from '@/components/ui'


const createAdminRolesTypeSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên loại vi phạm'),
    description: z.string().optional(),

})
const RolesPermissionCreateModal = ({ isOpen, onClose}) => {
    const {mutate}= useRolePermissonsRoles()
    const {
        control, 
        handleSubmit, 
        reset,
        formState:{errors, isSubmitting}
    } = useForm({
        resolver: zodResolver(createAdminRolesTypeSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                description: data.description || null,
            }

            await apiCreateRoleAdmin(body)

            mutate() // Refresh bảng
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm vai trò<strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi thêm loại vai trò:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Thêm loại vai trò thất bại:{' '}
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
        <Dialog
            isOpen={isOpen}
            width={900}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h4>Tạo mới vai trò </h4>
            <ScrollBar className="mt-6 max-h-[600px] overflow-y-auto">
                <div className="px-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            label={
                                <span>
                                    Tên vai trò{' '}
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
                                            placeholder="Ví dụ: Nhân viên, quản lý, Admin..."
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
                        <FormItem label="Mô tả" className="md:col-span-2">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={5}
                                        placeholder="Mô tả chi tiết về loại vi phạm này (tùy chọn)"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        </form>
                    <div className="flex justify-end mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={handleClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleSubmit(onSubmit)}
                        >
                            Thêm mới vai trò
                        </Button>
                    </div>
                </div>
            </ScrollBar>
        </Dialog>
    )
}

export default RolesPermissionCreateModal
