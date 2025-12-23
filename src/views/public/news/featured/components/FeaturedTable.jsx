import DataTable from '@/components/shared/DataTable'
import { useMemo } from 'react'
import useFeatured from '../hooks/useFeatured' // Hook riêng cho featured news

const FeaturedTable = () => {
    const { news, total, tableData, isLoading, setTableData, mutate } =
        useFeatured()

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 400,
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <div className="flex items-center gap-3">
                            {item.featuredImageUrl &&
                            item.featuredImageUrl !== 'string' ? (
                                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                                    <img
                                        src={item.featuredImageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                        No img
                                    </span>
                                </div>
                            )}
                            <span className="font-medium truncate max-w-md">
                                {item.title || '-'}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Tóm tắt',
                accessorKey: 'summary',
                size: 450,
                cell: ({ row }) => (
                    <div className="max-w-lg truncate text-sm text-gray-600">
                        {row.original.summary || '-'}
                    </div>
                ),
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                size: 150,
                cell: ({ row }) => row.original.categoryName || '-',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 120,
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusConfig = {
                        Published: { label: 'Đã đăng', color: 'green' },
                        Draft: { label: 'Nháp', color: 'orange' },
                        default: { label: status || 'Không rõ', color: 'gray' },
                    }
                    const config = statusConfig[status] || statusConfig.default

                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}
                        >
                            {config.label}
                        </span>
                    )
                },
            },
            {
                header: 'Ngày đăng',
                accessorKey: 'publishedAt',
                size: 180,
                cell: ({ row }) => {
                    const date = row.original.publishedAt
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
        <DataTable
            columns={columns}
            data={news ?? []}
            loading={isLoading}
            noData={!isLoading && (!news || news.length === 0)}
            pagingData={{
                total: total ?? 0,
                pageIndex: tableData.pageIndex + 1,
                pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            selectable={false}
        />
    )
}

export default FeaturedTable
