import { useAuth } from '@/auth'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const validationSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Password required' }),
        password: z.string().min(1, { message: 'Password required' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password Required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    })

const ChangePasswordForm = (props) => {
    const { disableSubmit = false, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState(false)

    const { changePassword } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(validationSchema),
    })

    const onSignUp = async (values) => {
        const { currentPassword, password, confirmPassword } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await changePassword({
                currentPassword,
                newPassword: password,
                confirmPassword,
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={`${className}`}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label="Mật khẩu hiện tại"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className="mb-4"
                >
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Nhập mật khẩu hiện tại"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Mật khẩu mới"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className="mb-4"
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Nhập mật khẩu mới"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Xác nhận lại mật khẩu"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                    className="mb-4"
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Xác nhận lại mật khẩu"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                </Button>
            </Form>
        </div>
    )
}

export default ChangePasswordForm
