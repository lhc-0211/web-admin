import DataTable from '@/components/shared/DataTable'
import { Dialog, Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { apiDeleteViolatorAdmin } from '@/services/Violations'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useViolatorList from '../hooks/useViolatorList'
import ViolatorEditModal from './ViolatorEditModal'

const ViolatorsListTable = () => {
    const {
        violators,
        violatorsTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useViolatorList()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedViolator, setSelectedViolator] = useState(null)

    // State cho modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [violatorToDelete, setViolatorToDelete] = useState(null)

    const openEditModal = (violator) => {
        setSelectedViolator(violator)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedViolator(null)
    }

    // Mở modal xác nhận xóa
    const openDeleteModal = (violator) => {
        setViolatorToDelete(violator)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setViolatorToDelete(null)
    }

    const confirmDelete = async () => {
        if (!violatorToDelete) return

        try {
            await apiDeleteViolatorAdmin(violatorToDelete.id)
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa đối tượng: <strong>{violatorToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa đối tượng thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên đối tượng',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Số điện thoại',
                accessorKey: 'phone',
                cell: ({ row }) => row.original.phone || '-',
            },
            {
                header: 'Địa chỉ',
                accessorKey: 'address',
                cell: ({ row }) => row.original.address || '-',
            },
            {
                header: 'Ngày tạo',
                accessorKey: 'createdAtUtc',
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
                cell: ({ row }) => {
                    const violator = row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(violator)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(violator)}
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
                data={violators}
                loading={isLoading}
                noData={!isLoading && violators.length === 0}
                pagingData={{
                    total: violatorsTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
                sortable={false}
            />

            <ViolatorEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                violator={selectedViolator}
            />

            {/* Modal xác nhận xóa */}
            <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={500}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    {/* Tiêu đề */}
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận xóa đối tượng
                    </h5>

                    {/* Nội dung cảnh báo */}
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa đối tượng vi phạm
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{violatorToDelete?.name}"
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-red-600 font-medium">
                            Hành động này không thể hoàn tác!
                        </span>
                    </p>

                    {/* Nút hành động */}
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
                            Xóa
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ViolatorsListTable
