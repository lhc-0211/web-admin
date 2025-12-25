import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { useMemo, useState } from 'react'
import { HiClock, HiPencil } from 'react-icons/hi'
import useViolationsList from '../hooks/useViolationsList'
import ViolationEditModal from './ViolationEditModal'

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

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedViolationId, setSelectedViolationId] = useState(null)

    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [selectedViolationForHistory, setSelectedViolationForHistory] =
        useState(null)

    const openHistoryModal = (violation) => {
        setSelectedViolationForHistory(violation)
        setHistoryModalOpen(true)
    }

    const openEditModal = (violation) => {
        setSelectedViolationId(violation.id)
        setEditModalOpen(true)
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
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(violation)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="green-600"
                                icon={<HiClock />}
                                onClick={() => openHistoryModal(violation)}
                                title="Xem lịch sử xử lý"
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
            <ViolationEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedViolationId(null)
                }}
                violationId={selectedViolationId}
            />
        </>
    )
}

export default ViolationsListTable
