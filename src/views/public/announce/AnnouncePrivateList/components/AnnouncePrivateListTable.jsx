import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import { useMemo, useState } from 'react'
import useAnnouncePrivateList from '../hooks/useAnnouncePrivateList'
import AnnouncementDetailDrawer from './AnnouncementDetailDrawer'

const priorityColor = {
    Low: 'bg-green-200 text-gray-900',
    Normal: 'bg-blue-200 text-gray-900',
    High: 'bg-yellow-200 text-gray-900',
    Critical: 'bg-red-200 text-gray-900',
}

const AnnouncePrivateListTable = () => {
    const {
        announcePrivateLis,
        announcePrivateLisTotal,
        tableData,
        isLoading,
        setTableData,
    } = useAnnouncePrivateList()
    const [selectedId, setSelectedId] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const openDetail = (announcement) => {
        setSelectedId(announcement.id)
        setDetailOpen(true)
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <div
                        className="font-medium text-primary-600 hover:underline cursor-pointer"
                        onClick={() => openDetail(row.original)}
                    >
                        {row.original.title}
                    </div>
                ),
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                cell: ({ row }) => row.original.categoryName,
            },
            {
                header: 'Mức độ ưu tiên',
                accessorKey: 'priority',
                cell: ({ row }) => (
                    <Tag className={priorityColor[row.original.priority]}>
                        {row.original.priority}
                    </Tag>
                ),
            },
            {
                header: 'Ngày xuất bản',
                accessorKey: 'publishedAt',
                cell: ({ row }) =>
                    new Date(row.original.publishedAt).toLocaleString(),
            },
            {
                header: 'Công khai',
                accessorKey: 'isPublic',
                cell: ({ row }) => (row.original.isPublic ? 'Có' : 'Không'),
            },
            {
                header: 'Số file',
                accessorKey: 'attachments',
                cell: ({ row }) => row.original.attachments?.length || 0,
            },
        ],
        [],
    )

    const handleSetTableData = (data) => setTableData(data)

    const handlePaginationChange = (page) => {
        handleSetTableData({ ...tableData, pageIndex: page })
    }

    const handleSelectChange = (value) => {
        handleSetTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 1,
        })
    }

    const handleSort = (sort) => {
        handleSetTableData({ ...tableData, sort })
    }

    return (
        <>
            <DataTable
                selectable={false} // thông báo không cần chọn hàng
                columns={columns}
                data={announcePrivateLis}
                noData={!isLoading && announcePrivateLis.length === 0}
                loading={isLoading}
                pagingData={{
                    total: announcePrivateLisTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <AnnouncementDetailDrawer
                isOpen={detailOpen}
                onClose={() => {
                    setDetailOpen(false)
                    setSelectedId(null)
                }}
                announcementId={selectedId}
            />
        </>
    )
}

export default AnnouncePrivateListTable
