import * as z from 'zod'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem,Form } from '@/components/ui/Form'
import { Controller, useForm } from 'react-hook-form'
import useRolePermissonsUsers from '../hooks/useRolePermissonsUsers'
import { apiChangePassword } from '@/services/AuthService'
import { Notification, toast } from '@/components/ui'
import { apiChangepasswordEmployee } from '@/services/AuthRoles'
const validationSchema = z
    .object({
        newPassword: z
            .string()
            .min(1, { message: 'Vui lòng nhập mật khẩu mới!' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Vui lòng nhập lại mật khẩu mới!' }),
    })
    .refine((data) => data.confirmPassword === data.newPassword, {
        message: 'Mật khẩu nhập lại khác mật khẩu mới!',
        path: ['confirmPassword'],
    })
const RolesUserChangePasswordModal =({isOpen, onClose, user})=>{
    const{mutate}= useRolePermissonsUsers()
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            newPassword :  '',
            confirmPassword: '',
        },
    })
    
    const onSubmit = async (data) => {
        try {
            const body = {
                newPassword : data.newPassword,
                confirmPassword:data.confirmPassword ,
            }

            await apiChangepasswordEmployee(user.id,body)

            mutate() // Refresh 
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật mật khẩu <strong>{data.code}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật thay đổi mật khẩu:', error)
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
    if(!user) return null
    return (
        <>
        <Dialog 
            isOpen={isOpen}
            width={700}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h4>Thay đổi mật khẩu </h4>
            <form
                className="mb-8"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormItem
                    label="Mật khẩu mới"
                    invalid={Boolean(errors.newPassword)}
                    errorMessage={errors.newPassword?.message}
                >
                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="•••••••••"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Nhập lại mật khẩu"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="•••••••••"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
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
                            Cập nhật
                        </Button>
                    </div>
            </form>
           
        </Dialog>
       
        </>
    )
}
export default RolesUserChangePasswordModal
