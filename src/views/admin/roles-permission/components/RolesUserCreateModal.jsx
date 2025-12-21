import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useRolePermissonsRoles from '../hooks/useRolePermissonsRoles'
import { apiCreateAuthUsers, apiCreateRoleAdmin } from '@/services/AuthRoles'
import { Notification, toast } from '@/components/ui'
import useRolePermissonsUsers from '../hooks/useRolePermissonsUsers'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ScrollBar from '@/components/ui/ScrollBar'
import { FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import { apiGetRolesAdmin } from '@/services/AuthRoles'

const createUserRoleSchema = z.object({
    firstName: z.string().min(1, { message: 'Vui lòng nhập tên' }),

    lastName: z.string().min(1, { message: 'Vui lòng nhập họ' }),

    email: z
        .string()
        .min(1, { message: 'Email là bắt buộc' })
        .email({ message: 'Email không hợp lệ' }),

    password: z
        .string()
        .min(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
        .regex(/^[A-Za-z0-9_-]*$/, {
            message: 'Chỉ cho phép chữ, số, _ và -',
        }),

    roles: z
        .array(z.string())
        .length(1, { message: 'Chỉ được chọn 1 vai trò' }),

    employeeCode: z.string().optional().or(z.literal('')),

    isActive: z.boolean(),
})

const RolesUserCreateModal = ({ isOpen, onClose }) => {
    const [roleOptions, setRoleOptions] = useState([])
    const [loadingRoles, setLoadingRoles] = useState(false)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoadingRoles(true)
                const res = await apiGetRolesAdmin()

                const roles = Array.isArray(res) ? res : []

                const options = roles.map((role) => ({
                    label: role.name,
                    value: role.name, // 👈 nên dùng id cho backend
                }))

                setRoleOptions(options)
            } catch (error) {
                toast.push(
                    <Notification title="Lỗi" type="danger">
                        Không thể tải danh sách vai trò
                    </Notification>,
                )
            } finally {
                setLoadingRoles(false)
            }
        }

        if (isOpen) {
            fetchRoles()
        }
    }, [isOpen])

    const { mutate } = useRolePermissonsUsers()
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createUserRoleSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            roles: [],
            employeeCode: '',
            isActive: true,
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                roles: data.roles,
                employeeCode: data.employeeCode,
                isActive: data.isActive,
            }

            await apiCreateAuthUsers(body)

            mutate() // Refresh bảng
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Thêm người dùng <strong>{data.name}</strong> thành công!
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Thêm loại người dùng thất bại:{' '}
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
            width={700}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h4>Thêm mới người dùng </h4>
            <ScrollBar className="mt-6 max-h-[600px] overflow-y-auto">
                <div className="px-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormItem
                                label="Email"
                                invalid={Boolean(errors.email)}
                                errorMessage={errors.email?.message}
                            >
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="ngVanA@gmail.com"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label="Mật khẩu"
                                invalid={Boolean(errors.password)}
                                errorMessage={errors.password?.message}
                            >
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="password"
                                            autoComplete=""
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormItem
                                label="Tên"
                                invalid={Boolean(errors.firstName)}
                                errorMessage={errors.firstName?.message}
                            >
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Nhập tên của bạn"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label="Họ"
                                invalid={Boolean(errors.lastName)}
                                errorMessage={errors.lastName?.message}
                            >
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="Nhập họ của bạn"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormItem
                                label="Vai trò"
                                invalid={Boolean(errors.roles)}
                                errorMessage={errors.roles?.message}
                            >
                                <Controller
                                    name="roles"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isLoading={loadingRoles}
                                            options={roleOptions}
                                            placeholder="Chọn vai trò"
                                            value={roleOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    field.value?.[0],
                                            )}
                                            onChange={(selected) =>
                                                field.onChange(
                                                    selected
                                                        ? [selected.value]
                                                        : [],
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Mã nhân viên"
                                invalid={Boolean(errors.employeeCode)}
                                errorMessage={errors.employeeCode?.message}
                            >
                                <Controller
                                    name="employeeCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            autoComplete="Nhập mã nhân viên "
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
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
export default RolesUserCreateModal
