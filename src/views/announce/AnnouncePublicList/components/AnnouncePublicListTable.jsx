import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import { useMemo } from 'react'
import useAnnouncePublicList from '../hooks/useAnnouncePublicList'

const priorityColor = {
    Low: 'bg-green-200 text-gray-900',
    Normal: 'bg-blue-200 text-gray-900',
    High: 'bg-yellow-200 text-gray-900',
    Critical: 'bg-red-200 text-gray-900',
}

const AnnouncePrivateListTable = () => {
    const {
        announcePublicList,
        announcePublicListTotal,
        tableData,
        isLoading,
        setTableData,
    } = useAnnouncePublicList()

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                cell: ({ row }) => row.original.title,
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
        <DataTable
            selectable={false} // thông báo không cần chọn hàng
            columns={columns}
            data={announcePublicList}
            noData={!isLoading && announcePublicList.length === 0}
            loading={isLoading}
            pagingData={{
                total: announcePublicListTotal,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default AnnouncePrivateListTable
