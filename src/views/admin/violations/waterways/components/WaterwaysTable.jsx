import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteWaterwayAdmin } from '@/services/Violations' // API xóa tuyến đường thủy
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useWaterways from '../hooks/useWaterways' // Hook đúng
import WaterwaysEditModal from './WaterwaysEditModal' // Modal sửa

const WaterwaysTable = () => {
    const {
        waterways,
        waterwaysTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useWaterways()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedWaterway, setSelectedWaterway] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [waterwayToDelete, setWaterwayToDelete] = useState(null)

    const openEditModal = (waterway) => {
        setSelectedWaterway(waterway)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedWaterway(null)
    }

    const openDeleteModal = (waterway) => {
        setWaterwayToDelete(waterway)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setWaterwayToDelete(null)
    }

    const confirmDelete = async () => {
        if (!waterwayToDelete) return

        try {
            await apiDeleteWaterwayAdmin(waterwayToDelete.id)
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa tuyến đường thủy:{' '}
                    <strong>{waterwayToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa tuyến đường thủy thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên tuyến',
                accessorKey: 'name',
                size: 280,
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Mã tuyến',
                accessorKey: 'code',
                size: 150,
                cell: ({ row }) => row.original.code || '-',
            },

            {
                header: 'Phòng ban',
                accessorKey: 'departmentName',
                size: 250,
                cell: ({ row }) => (
                    <div className="font-medium">
                        {row.original.departmentName || '-'}
                    </div>
                ),
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
                    const waterway = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(waterway)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(waterway)}
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
                data={waterways}
                loading={isLoading}
                noData={!isLoading && waterways.length === 0}
                pagingData={{
                    total: waterwaysTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa tuyến đường thủy */}
            <WaterwaysEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                waterway={selectedWaterway}
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
                        Xác nhận xóa tuyến đường thủy
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa tuyến đường thủy
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{waterwayToDelete?.name}"
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

export default WaterwaysTable
