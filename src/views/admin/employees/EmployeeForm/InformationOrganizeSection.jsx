import { useEffect, useState } from 'react'
import axios from 'axios'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'

import { FormItem } from '@/components/ui/Form'
import { apiDropdownDepartment, apiDropdownPosition, apiDropdownEmployee } from '@/services/AdminEmployees'
import { Controller } from 'react-hook-form'

const employmentStatusOptions = [
    { value: 'Active', label: 'Hoạt động' },
    { value: 'Inactive', label: 'Dừng hoạt động' },
]

const InformationOrganizeSection = ({ control, errors, watch, setValue }) => {
    const [departments, setDepartments] = useState([])
    const [positions, setPositions] = useState([])
    const [managers, setManagers] = useState([])
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await apiDropdownDepartment()
                const list = res?.data ?? [] 
                setDepartments(
                    list.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                )
            } catch (err) {
                console.error('Fetch departments failed:', err)
            }
        }
        fetchDepartments()
    }, [])
    const departmentId = watch('departmentId')
    useEffect(() => {
        if (!departmentId) {
            setPositions([])
            setValue('positionId', '')
            return
        }

        const fetchPositions = async () => {
            try {
                const res = await apiDropdownPosition({ departmentId })
                const list = res?.data ?? [] 
                setPositions(
                    list.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                )
            } catch (err) {
                console.error('Fetch positions failed:', err)
            }
        }

        fetchPositions()
    }, [departmentId, setValue])

    // Lấy danh sách quản lý
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await apiDropdownEmployee()
                const list = res?.data ?? [] 
                setManagers(
                    list.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                )
            } catch (err) {
                console.error('Fetch managers failed:', err)
            }
        }
        fetchManagers()
    }, [])

    return (
        <Card>
            <h4 className="mb-2">Thông tin tổ chức </h4>
            <div className="mt-6  space-y-4">
                <FormItem
                    label="Ngày vào làm"
                    invalid={Boolean(errors.joinDate)}
                    errorMessage={errors.joinDate?.message}
                >
                    <Controller
                        name="joinDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Chọn ngày vào làm"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                    field.onChange(date?.toISOString() ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Ngày kết thúc thử việc"
                    invalid={Boolean(errors.probationEndDate)}
                    errorMessage={errors.probationEndDate?.message}
                >
                    <Controller
                        name="probationEndDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Chọn ngày kết thúc thử việc"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                    field.onChange(date?.toISOString() ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Ngày nghỉ việc"
                    invalid={Boolean(errors.leaveDate)}
                    errorMessage={errors.leaveDate?.message}
                >
                    <Controller
                        name="leaveDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                placeholder="Chọn ngày nghỉ việc"
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                    field.onChange(date?.toISOString() ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Mô tả"
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Nhập mô tả"
                            {...field}
                        />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Lương"
                    invalid={Boolean(errors.salary)}
                    errorMessage={errors.salary?.message}
                >
                    <Controller
                        name="salary"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder="Nhập mức lương"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Phòng ban">
                    <Controller
                        name="departmentId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Chọn phòng ban"
                                options={departments}
                                value={departments.find(
                                    (opt) => opt.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Chức vụ">
                    <Controller
                        name="positionId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Chọn chức vụ"
                                options={positions}
                                isDisabled={!departmentId}
                                value={positions.find(
                                    (opt) => opt.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem label="Quản lý">
                    <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Chọn quản lý"
                                options={managers}
                                value={managers.find(
                                    (opt) => opt.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? '')
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Trạng thái làm việc"
                    invalid={Boolean(errors.employmentStatus)}
                    errorMessage={errors.employmentStatus?.message}
                >
                    <Controller
                        name="employmentStatus"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Chọn trạng thái"
                                options={employmentStatusOptions}
                                value={employmentStatusOptions.find(
                                    (opt) => opt.value === field.value,
                                )}
                                onChange={(option) => {
                                    const status = option?.value ?? ''

                                    // set employmentStatus
                                    field.onChange(status)

                                    // sync isActive
                                    setValue('isActive', status === 'Active')
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default InformationOrganizeSection
