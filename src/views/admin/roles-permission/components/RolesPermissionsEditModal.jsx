import { useMemo, useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Segment from '@/components/ui/Segment'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import ScrollBar from '@/components/ui/ScrollBar'
import { FormItem } from '@/components/ui/Form'
import useSWR from 'swr'
import {
    TbUserCog,
    TbBox,
    TbSettings,
    TbFiles,
    TbFileChart,
    TbCheck,
} from 'react-icons/tb'
import useRolePermissonsRoles from '../hooks/useRolePermissonsRoles'
import * as z from 'zod'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { apiGetPermissionAdmin, apiUpdateAuthRoles, apiUpdatePermissionAdmin } from '@/services/AuthRoles'
const moduleIcon = {
    users: <TbUserCog />,
    products: <TbBox />,
    configurations: <TbSettings />,
    files: <TbFiles />,
    reports: <TbFileChart />,
}

const editAdminRolesTypeSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên loại vi phạm'),
    description: z.string().optional(),

})

const RolesPermissionsEditModal = ({ isOpen, onClose, roles }) => {
    
    const {mutate} = useRolePermissonsRoles()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editAdminRolesTypeSchema),
        defaultValues: {
            name: roles?.name || '',
            description: roles?.description || '', 
        },
    })
    React.useEffect(() =>{
        if(isOpen && roles){
            reset({
                name: roles?.name || '',
                description: roles?.description || '', 
            })
        }
    },[isOpen, roles, reset])

    const { data, isLoading } = useSWR(
        isOpen && roles.id
            ? [isOpen, roles.id]
            : null,
        () => apiGetPermissionAdmin({roleId: roles.id}),
        {
            revalidateOnFocus: false,
            onSuccess: (res) => {
                setModules(res)
            },
        }
    )

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name,
                description: data.description || null,
            }

            await apiUpdateAuthRoles(roles.id, body)

            mutate() // Refresh 
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật loại vai trò <strong>{data.code}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
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
    if(!roles) return null

    return (
        <Dialog
            isOpen={isOpen}
            width={700}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h4>{ roles?.name}</h4>
            <ScrollBar className="mt-6 max-h-[600px] overflow-y-auto">
                <div className="px-4">
                        <>
                            <FormItem label="Tên vai trò">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="Ví dụ: Admin"
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
                            <FormItem label="Mô tả">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={5}
                                        placeholder="Mô tả chi tiết về vai trò (tùy chọn)"
                                        {...field}
                                    />
                                )}
                            />
                            </FormItem>
                            <span className="font-semibold mb-2">
                                Phân quyền
                            </span>
                        </>
                    {/* {data.map((module, index) => (
                        <div
                            key={module.id}
                            className={classNames(
                                'flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-gray-200 dark:border-gray-600',
                                !isLastChild(accessModules, index) &&
                                    'border-b',
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <Avatar
                                    className="bg-transparent dark:bg-transparent p-2 border-2 border-gray-200 dark:border-gray-600 text-primary"
                                    size={50}
                                    icon={moduleIcon[module.id]}
                                    shape="round"
                                />
                                <div>
                                    <h6 className="font-bold">{module.name}</h6>
                                    <span>{module.description}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Segment
                                    className="bg-transparent dark:bg-transparent"
                                    selectionType="multiple"
                                    value={modules?.accessRight[module.id]}
                                    onChange={(val) =>
                                        handleChange(val, module.id)
                                    }
                                >
                                    {module.accessor.map((access) => (
                                        <Segment.Item
                                            key={module.id + access.value}
                                            value={access.value}
                                        >
                                            {({
                                                active,
                                                onSegmentItemClick,
                                            }) => {
                                                return (
                                                    <Button
                                                        variant="default"
                                                        icon={
                                                            active ? (
                                                                <TbCheck className="text-primary text-xl" />
                                                            ) : (
                                                                <></>
                                                            )
                                                        }
                                                        active={active}
                                                        type="button"
                                                        className="md:min-w-[100px]"
                                                        size="sm"
                                                        customColorClass={({
                                                            active,
                                                        }) =>
                                                            classNames(
                                                                active &&
                                                                    'bg-transparent dark:bg-transparent text-primary border-primary ring-1 ring-primary',
                                                            )
                                                        }
                                                        onClick={
                                                            onSegmentItemClick
                                                        }
                                                    >
                                                        {access.label}
                                                    </Button>
                                                )
                                            }}
                                        </Segment.Item>
                                    ))}
                                </Segment>
                            </div>
                        </div>
                    ))} */}
                    <div className="flex justify-end mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={handleClose}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="solid"
                            onClick={
                                 handleSubmit(onSubmit)
                            }
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </ScrollBar>
        </Dialog>
    )
}

export default RolesPermissionsEditModal
