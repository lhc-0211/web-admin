import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog' // hoặc Modal component của bạn
import Tag from '@/components/ui/Tag'
import { useMemo, useState } from 'react'
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi'
import useViolationsList from '../hooks/useViolationsList'

const severityColor = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-blue-100 text-blue-800',
    High: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
}

const statusColor = {
    New: 'bg-gray-100 text-gray-800',
    InProgress: 'bg-orange-100 text-orange-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-indigo-100 text-indigo-800',
    Cancelled: 'bg-red-100 text-red-800',
}

const sideOptions = {
    Left: 'Trái',
    Right: 'Phải',
    Unknown: 'Không rõ',
}

const sideColor = {
    Left: 'bg-purple-100 text-purple-800',
    Right: 'bg-pink-100 text-pink-800',
    Unknown: 'bg-gray-100 text-gray-800',
}

const ViolationsListTable = () => {
    const {
        violations,
        violationsTotal,
        tableData,
        isLoading,
        setTableData,
        mutate, // để refresh bảng sau khi xóa (nếu cần)
    } = useViolationsList()

    // State quản lý modal
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedViolation, setSelectedViolation] = useState(null)

    const openViewModal = (violation) => {
        setSelectedViolation(violation)
        setViewModalOpen(true)
    }

    const openEditModal = (violation) => {
        setSelectedViolation(violation)
        setEditModalOpen(true)
    }

    const closeViewModal = () => {
        setViewModalOpen(false)
        setSelectedViolation(null)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedViolation(null)
    }

    const handleDelete = (violation) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vi phạm này không?')) {
            // TODO: Gọi API xóa ở đây
            // await apiDeleteViolation(violation.id)
            // Sau khi xóa thành công:
            // mutate() // refresh danh sách từ server
            alert(`Đã xóa vi phạm: ${violation.violationNumber}`)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Mã vi phạm',
                accessorKey: 'violationNumber',
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.violationNumber || '-'}
                    </span>
                ),
            },
            {
                header: 'Ngày vi phạm',
                accessorKey: 'violationDate',
                cell: ({ row }) => {
                    const date = row.original.violationDate
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
            {
                header: 'Tiêu đề / Mô tả',
                accessorKey: 'title',
                cell: ({ row }) => row.original.title || '-',
            },
            {
                header: 'Đối tượng vi phạm',
                accessorKey: 'violatorName',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">
                            {row.original.violatorName || 'Không rõ'}
                        </div>
                        {row.original.violatorType && (
                            <div className="text-xs text-gray-500">
                                Loại:{' '}
                                {row.original.violatorType === 'Individual'
                                    ? 'Cá nhân'
                                    : 'Tổ chức'}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: 'Tuyến đường thủy',
                accessorKey: 'waterwayName',
                cell: ({ row }) => row.original.waterwayName || '-',
            },
            {
                header: 'Loại vi phạm',
                accessorKey: 'violationTypeName',
                cell: ({ row }) => row.original.violationTypeName || '-',
            },
            {
                header: 'Bên vi phạm',
                accessorKey: 'side',
                cell: ({ row }) => {
                    const side = row.original.side
                    if (!side) return '-'
                    return (
                        <Tag className={sideColor[side] || 'bg-gray-100'}>
                            {sideOptions[side] || side}
                        </Tag>
                    )
                },
            },
            {
                header: 'Mức độ',
                accessorKey: 'severity',
                cell: ({ row }) => {
                    const severity = row.original.severity
                    if (!severity) return '-'
                    return (
                        <Tag
                            className={severityColor[severity] || 'bg-gray-100'}
                        >
                            {severity === 'Low'
                                ? 'Thấp'
                                : severity === 'Medium'
                                  ? 'Trung bình'
                                  : severity === 'High'
                                    ? 'Cao'
                                    : 'Nghiêm trọng'}
                        </Tag>
                    )
                },
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status
                    if (!status) return '-'
                    return (
                        <Tag className={statusColor[status] || 'bg-gray-100'}>
                            {status === 'New'
                                ? 'Mới'
                                : status === 'InProgress'
                                  ? 'Đang xử lý'
                                  : status === 'Resolved'
                                    ? 'Đã xử lý'
                                    : status === 'Closed'
                                      ? 'Đóng'
                                      : 'Hủy'}
                        </Tag>
                    )
                },
            },
            // CỘT HÀNH ĐỘNG
            {
                header: 'Hành động',
                id: 'actions',
                cell: ({ row }) => {
                    const violation = row.original
                    return (
                        <div className="flex items-center gap-1">
                            <Button
                                size="xs"
                                variant="twoTone"
                                icon={<HiEye />}
                                onClick={() => openViewModal(violation)}
                                title="Xem chi tiết"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(violation)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => handleDelete(violation)}
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

    const handleSort = (sort) => {
        setTableData({ ...tableData, sort })
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={violations}
                loading={isLoading}
                noData={!isLoading && violations.length === 0}
                pagingData={{
                    total: violationsTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                selectable={false}
            />

            {/* Modal Xem chi tiết */}
            <Dialog
                isOpen={viewModalOpen}
                onClose={closeViewModal}
                width={800} // tùy chỉnh độ rộng
                title={`Chi tiết vi phạm - ${selectedViolation?.violationNumber || ''}`}
            >
                {selectedViolation && (
                    <div className="space-y-4">
                        <div>
                            <strong>Mã vi phạm:</strong>{' '}
                            {selectedViolation.violationNumber}
                        </div>
                        <div>
                            <strong>Tiêu đề:</strong> {selectedViolation.title}
                        </div>
                        <div>
                            <strong>Ngày vi phạm:</strong>{' '}
                            {new Date(
                                selectedViolation.violationDate,
                            ).toLocaleString('vi-VN')}
                        </div>
                        <div>
                            <strong>Đối tượng vi phạm:</strong>{' '}
                            {selectedViolation.violatorName} (
                            {selectedViolation.violatorType === 'Individual'
                                ? 'Cá nhân'
                                : 'Tổ chức'}
                            )
                        </div>
                        <div>
                            <strong>Tuyến đường thủy:</strong>{' '}
                            {selectedViolation.waterwayName}
                        </div>
                        <div>
                            <strong>Loại vi phạm:</strong>{' '}
                            {selectedViolation.violationTypeName}
                        </div>
                        <div>
                            <strong>Bên vi phạm:</strong>{' '}
                            {sideOptions[selectedViolation.side] ||
                                selectedViolation.side}
                        </div>
                        <div>
                            <strong>Mức độ:</strong>{' '}
                            {selectedViolation.severity === 'Low'
                                ? 'Thấp'
                                : selectedViolation.severity === 'Medium'
                                  ? 'Trung bình'
                                  : selectedViolation.severity === 'High'
                                    ? 'Cao'
                                    : 'Nghiêm trọng'}
                        </div>
                        <div>
                            <strong>Trạng thái:</strong>{' '}
                            {selectedViolation.status === 'New'
                                ? 'Mới'
                                : selectedViolation.status === 'InProgress'
                                  ? 'Đang xử lý'
                                  : selectedViolation.status === 'Resolved'
                                    ? 'Đã xử lý'
                                    : selectedViolation.status === 'Closed'
                                      ? 'Đóng'
                                      : 'Hủy'}
                        </div>
                        <div>
                            <strong>Người được giao:</strong>{' '}
                            {selectedViolation.assignedToName || 'Chưa giao'}
                        </div>
                        {/* Thêm các thông tin khác nếu cần */}
                    </div>
                )}
            </Dialog>

            {/* Modal Sửa - bạn có thể thay bằng form chỉnh sửa thực tế sau */}
            <Dialog
                isOpen={editModalOpen}
                onClose={closeEditModal}
                width={800}
                title={`Sửa vi phạm - ${selectedViolation?.violationNumber || ''}`}
            >
                {selectedViolation && (
                    <div className="text-center py-8 text-gray-500">
                        {/* Ở đây bạn sẽ đặt form chỉnh sửa thực tế */}
                        <p>Form sửa vi phạm sẽ được đặt ở đây...</p>
                        <p>ID: {selectedViolation.id}</p>
                        {/* Ví dụ tạm */}
                        <Button
                            variant="solid"
                            className="mt-4"
                            onClick={closeEditModal}
                        >
                            Đóng (chưa có form thật)
                        </Button>
                    </div>
                )}
            </Dialog>
        </>
    )
}

export default ViolationsListTable
