import DataTable from '@/components/shared/DataTable'
import { useMemo } from 'react'
import useMyNews from '../hooks/useMyNews'

const MyNewsTable = () => {
    const { news, total, tableData, isLoading, setTableData, mutate } =
        useMyNews()

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 350,
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <div className="flex items-center gap-3">
                            {item.featuredImageUrl ? (
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <img
                                        src={item.featuredImageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                        No img
                                    </span>
                                </div>
                            )}
                            <span className="font-medium truncate max-w-xs">
                                {item.title || '-'}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Tóm tắt',
                accessorKey: 'summary',
                size: 400,
                cell: ({ row }) => (
                    <div className="max-w-md truncate text-sm text-gray-600">
                        {row.original.summary || '-'}
                    </div>
                ),
            },
            {
                header: 'Tác giả',
                accessorKey: 'authorName',
                size: 150,
                cell: ({ row }) => row.original.authorName || '-',
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                size: 150,
                cell: ({ row }) => row.original.categoryName || '-',
            },
            {
                header: 'Tags',
                accessorKey: 'tags',
                size: 200,
                cell: ({ row }) => {
                    const tags = row.original.tags
                    if (!tags || tags.length === 0) return '-'
                    return (
                        <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                                    style={{
                                        backgroundColor: tag.color + '20',
                                        color: tag.color,
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )
                },
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

export default MyNewsTable
