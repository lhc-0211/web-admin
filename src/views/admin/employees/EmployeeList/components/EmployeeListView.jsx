import { useMemo, useState } from 'react'

import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useEmployeeList from '../hooks/useEmployeeList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbTrash } from 'react-icons/tb'
import useResponsive from '../hooks/useReponsive'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import {  HiExclamationCircle } from 'react-icons/hi'
import { apiDeleteEmployee } from '@/services/AdminEmployees'
const statusColor = {
    true: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    false: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}
const ActionListView = ({ onEdit,  onDelete }) => {
    return (
        <div className="flex items-center gap-1">
             <Tooltip title="Xóa">
                <button
                    onClick={onDelete}
                    className="p-1 rounded hover:bg-gray-100"
                >
                    <TbTrash size={16} />
                </button>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
                <button
                   onClick={(e) => {
                    e.stopPropagation() // <--- ngăn click bubble lên div cha
                    onEdit()
                }}
                    className="p-1 rounded hover:bg-gray-100"
                >
                    <TbPencil size={16} />
                </button>
            </Tooltip>
        </div>
    )
}



const EmployeeListView = ({onViewEmployee, onEditEmployee}) => {
    const navigate = useNavigate()

    const {
        employeeList,
        employeeListTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useEmployeeList()


    const{ isMobile }= useResponsive()
    const PaginationView = () => (
        <div className="px-4 py-3">
            <DataTable.Pagination
                total={employeeListTotal}
                pageIndex={tableData.pageIndex}
                pageSize={tableData.pageSize}
                onChange={handlePaginationChange}
            />
        </div>
    )
    const handleEdit = (employee) => {
        if(isMobile){
            navigate(`/admin/users/edit-employee/${employee.id}`)
        }
        else{
            onEditEmployee(employee)
        }
    }

    const handleViewDetails = (employee) => {
        if(isMobile){
            navigate(`admin/users/details-employee/${employee.id}`)
        }
        else{
            onViewEmployee(employee)
        }
       
    }
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [usersToDelete, setUsersToDelete] = useState(null)
    const openDeleteModal = (id) => {
        setUsersToDelete(id)
        setDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setUsersToDelete(null)
    }

    const confirmDelete = async () => {
        if (!usersToDelete) return
        console.log('usersToDelete?.id', usersToDelete?.id)
        try {
            await apiDeleteEmployee(usersToDelete?.id) // Gọi API xóa vai trò
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa người dùng: <strong>{usersToDelete.fullName}</strong>
                </Notification>,
            )
        } catch (error) {
            console.log('eror ', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa người dùng thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }
    const listView = (
        <div className="space-y-3 p-4" >
            {employeeList.map((employee) => (
                <div
                    key={employee.id}
                    className="flex justify-between items-center shadow border rounded-xl px-3 py-2 hover:shadow-md"
                    onClick={() =>handleViewDetails(employee)}
                >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={32}
                            shape="circle"
                            src={employee.avataUrl}
                        />
                        <div className="text-sm">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary">
                                {employee.fullName}
                            </span>
                            <p className="text-xs text-gray-500 mt-[1px]">
                                {employee.departmentName}
                            </p>
                        </div>
                    </div>
                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <div className="text-xs text-right">
                            <Tag
                                className={`${statusColor[employee.isActive]} text-[10px] px-2 py-[1px]`}
                            >
                                {employee.isActive
                                    ? 'Đang hoạt động'
                                    : 'Dừng hoạt động'}
                            </Tag>

                            <p className="text-[10px] text-gray-500 mt-[2px]">
                                ${employee.joinDate}
                            </p>
                        </div>

                        {/* Actions */}
                        <ActionListView
                            onEdit={() => handleEdit(employee)}
                            onDelete={()=> openDeleteModal(employee)}
                        />
                    </div>
                </div>
            ))}
        </div>
    )


    return (
        <>
            {listView}
            <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationCircle className="h-10 w-10 text-red-600" />
                    </div>

                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận xóa người dùng
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa người dùng
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{usersToDelete?.fullName}"
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-red-600 font-medium">
                            Hành động này không thể hoàn tác!
                        </span>
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeDeleteModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            size="lg"
                            onClick={confirmDelete}
                            className="px-8"
                        >
                            Xóa vĩnh viễn
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>

    )
}

export default EmployeeListView
