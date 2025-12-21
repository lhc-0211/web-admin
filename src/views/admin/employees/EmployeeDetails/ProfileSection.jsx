import { useState } from 'react'
import Card from '@/components/ui/Card'

import Avatar from '@/components/ui/Avatar/Avatar'

import { useNavigate } from 'react-router'
import useEmployeeList from '../EmployeeList/hooks/useEmployeeList'
const EmployeeInfoField = ({ title, value }) => {
    return (
        <div className="flex flex-wrap items-center gap-1">
            <span className="font-semibold">{title}:</span>
            <span className="heading-text font-bold">{value}</span>
        </div>
    )
}

const ProfileSection = ({ data = {} }) => {
    console.log('data: ', data)
    const navigate = useNavigate()

    const handleEdit = () => {
        navigate(`/concepts/customers/customer-edit/${data.id}`)
    }

    return (
        <>
            <Card className="w-full h-full flex">
                <div className="flex flex-col xl:justify-between h-full w-full">
                    <div className="flex xl:flex-col items-center gap-4 mt-6">
                        <Avatar size={90} shape="circle" src={data.avataFile} />
                        <h4 className="font-bold">{data.fullName}</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-y-3 gap-x-4 mt-10">
                        <EmployeeInfoField
                            title="Mã nhân viên"
                            value={data.employeeCode}
                        />                       
                        <EmployeeInfoField
                            title="Email"
                            value={data.userAccount.email}
                        />
                        <EmployeeInfoField
                            title="Ngày tạo"
                            value={data.createAtUtc}
                        />
                        <EmployeeInfoField
                            title="Ngày sinh"
                            value={data.dateOfBirth}
                        />
                        <EmployeeInfoField
                            title="Giới tính"
                            value={data.gender}
                        />
                        <EmployeeInfoField
                            title="Phòng ban"
                            value={data.department ?? ' '}
                        />
                        <EmployeeInfoField
                            title="Quản lý"
                            value={data.managerName}
                        />
                         <EmployeeInfoField
                            title="Mức"
                            value={data.level}
                        />
                        <EmployeeInfoField
                            title="Chức vụ"
                            value={data.manager}
                        />
                        <EmployeeInfoField
                            title="Thời gian tạo"
                            value={data.createdAtUtc}
                        />
                        <EmployeeInfoField
                            title="Thời gian hoạt đồng gần nhất"
                            value={data.userAccount.lastLoginAtUtc}
                        />
                    </div>
                </div>
            </Card>
           
        </>
    )
}

export default ProfileSection
