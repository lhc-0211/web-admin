import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Avatar from '@/components/ui/Avatar' // Nếu bạn có component Avatar để hiển thị ảnh
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteEmployeeAdmin } from '@/services/EmployeesService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useEmployees from '../hooks/useEmployees' // Hook lấy danh sách nhân viên
import EmployeesEditModal from './EmployeesEditModal'

const EmployeesTable = () => {
    const {
        employees, // Danh sách nhân viên
        total: totalItems,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useEmployees()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [employeeToDelete, setEmployeeToDelete] = useState(null)

    const openEditModal = (employee) => {
        setSelectedEmployee(employee)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedEmployee(null)
    }

    const openDeleteModal = (employee) => {
        setEmployeeToDelete(employee)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setEmployeeToDelete(null)
    }

    const confirmDelete = async () => {
        if (!employeeToDelete) return

        try {
            await apiDeleteEmployeeAdmin(employeeToDelete.id)
            mutate() // Refetch lại danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa nhân viên:{' '}
                    <strong>{employeeToDelete.fullName}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa nhân viên thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Nhân viên',
                id: 'employeeInfo',
                size: 300,
                cell: ({ row }) => {
                    const employee = row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={employee.avatarUrl}
                                size="md"
                                shape="circle"
                                fallback={employee.fullName
                                    .charAt(0)
                                    .toUpperCase()}
                            />
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {employee.fullName || '-'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Mã: {employee.employeeCode || '-'}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Phòng ban',
                accessorKey: 'departmentName',
                size: 200,
                cell: ({ row }) => row.original.departmentName || '-',
            },
            {
                header: 'Chức vụ',
                accessorKey: 'positionName',
                size: 180,
                cell: ({ row }) => row.original.positionName || '-',
            },
            {
                header: 'Cấp bậc',
                accessorKey: 'level',
                size: 100,
                cell: ({ row }) => row.original.level ?? '-',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'employmentStatus',
                size: 150,
                cell: ({ row }) => {
                    const status = row.original.employmentStatus || 'Unknown'
                    const isActive = row.original.isActive

                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {status}
                        </span>
                    )
                },
            },
            {
                header: 'Ngày vào làm',
                accessorKey: 'joinDate',
                size: 180,
                cell: ({ row }) => {
                    const date = row.original.joinDate
                    if (!date) return '-'
                    return new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                },
            },
            {
                header: 'Ngày tạo',
                accessorKey: 'createdAtUtc',
                size: 180,
                cell: ({ row }) => {
                    const date = row.original.createdAtUtc
                    if (!date) return '-'
                    return new Date(date).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                },
            },
            // CỘT HÀNH ĐỘNG
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const employee = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(employee)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(employee)}
                                title="Xóa"
                            />
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const handlePaginationChange = (page) => {
        setTableData({ ...tableData, pageIndex: page - 1 })
    }

    const handleSelectChange = (value) => {
        setTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 0,
        })
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={employees}
                loading={isLoading}
                noData={!isLoading && employees?.length === 0}
                pagingData={{
                    total: totalItems,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa nhân viên */}
            <EmployeesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                employee={selectedEmployee}
            />

            {/* Modal xác nhận xóa */}
            <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận xóa nhân viên
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa nhân viên
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{employeeToDelete?.fullName}"
                        </span>
                        <br />
                        (Mã: {employeeToDelete?.employeeCode})
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

export default EmployeesTable
