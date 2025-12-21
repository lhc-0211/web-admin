import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeletePositionAdmin } from '@/services/PositionsService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import usePositions from '../hooks/usePositions'
import PositionsEditModal from './PositionsEditModal'

const PositionsTable = () => {
    const {
        positions, // Danh sách chức vụ
        total: positionsTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = usePositions()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [positionToDelete, setPositionToDelete] = useState(null)

    const openEditModal = (position) => {
        setSelectedPosition(position)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedPosition(null)
    }

    const openDeleteModal = (position) => {
        setPositionToDelete(position)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setPositionToDelete(null)
    }

    const confirmDelete = async () => {
        if (!positionToDelete) return

        try {
            await apiDeletePositionAdmin(positionToDelete.id)
            mutate() // Refetch lại danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa chức vụ: <strong>{positionToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa chức vụ thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Mã chức vụ',
                accessorKey: 'positionCode',
                size: 150,
                cell: ({ row }) => (
                    <span className="font-medium text-primary">
                        {row.original.positionCode || '-'}
                    </span>
                ),
            },
            {
                header: 'Tên chức vụ',
                accessorKey: 'name',
                size: 250,
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-700">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Mô tả',
                accessorKey: 'description',
                size: 350,
                cell: ({ row }) => row.original.description || '-',
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
                size: 150,
                cell: ({ row }) => {
                    const position = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(position)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(position)}
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
                data={positions}
                loading={isLoading}
                noData={!isLoading && positions?.length === 0}
                pagingData={{
                    total: positionsTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa chức vụ */}
            <PositionsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                position={selectedPosition}
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
                        Xác nhận xóa chức vụ
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa chức vụ
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{positionToDelete?.name}"
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

export default PositionsTable
