import DataTable from '@/components/shared/DataTable'
import { useMemo, useState } from 'react'
import useGalleriesPublicList from '../hooks/useGalleriesPublicList' // Đổi tên hook cho phù hợp
import GalleriesPublicDetailDrawer from './GalleriesPublicDetailDrawer' // Đổi tên drawer cho đúng ngữ nghĩa

const GalleriesPublicListTable = () => {
    const { galleries, total, tableData, isLoading, setTableData } =
        useGalleriesPublicList()

    const [selectedSlug, setSelectedSlug] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const openDetail = (gallery) => {
        if (gallery.isPublic) {
            setSelectedSlug(gallery.slug)
            setDetailOpen(true)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Hình đại diện',
                id: 'thumbnail',
                size: 100,
                cell: ({ row }) => {
                    const url = row.original.thumbnailImageUrl
                    return url ? (
                        <img
                            src={url}
                            alt={row.original.title}
                            className="h-12 w-16 object-cover rounded-md border"
                        />
                    ) : (
                        <div className="h-12 w-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                            Không có
                        </div>
                    )
                },
            },
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 300,
                sortable: true,
                cell: ({ row }) => (
                    <div>
                        <span className="font-semibold text-primary">
                            {row.original.title || '-'}
                        </span>
                        {row.original.isPinned && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Ghim
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                size: 180,
                cell: ({ row }) => row.original.categoryName || '-',
            },
            {
                header: 'Số ảnh',
                accessorKey: 'itemCount',
                size: 100,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.itemCount ?? 0}
                    </span>
                ),
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 120,
                cell: ({ row }) => {
                    const status = row.original.status
                    const isPublic = row.original.isPublic
                    return (
                        <div className="flex flex-col gap-1">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    status === 'Published'
                                        ? 'bg-green-100 text-green-800'
                                        : status === 'Draft'
                                          ? 'bg-gray-100 text-gray-800'
                                          : 'bg-orange-100 text-orange-800'
                                }`}
                            >
                                {status === 'Published'
                                    ? 'Đã đăng'
                                    : 'Bản nháp'}
                            </span>
                            <span
                                className={`text-xs ${
                                    isPublic ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {isPublic ? 'Công khai' : 'Riêng tư'}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Ngày đăng',
                accessorKey: 'publishedAt',
                size: 160,
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
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const gallery = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(gallery)}
                                title="Sửa bộ sưu tập"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(gallery)}
                                title="Xóa bộ sưu tập"
                            />
                        </div>
                    )
                },
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
                selectable={false}
                columns={columns}
                data={galleries}
                noData={!isLoading && galleries.length === 0}
                loading={isLoading}
                pagingData={{
                    total,
                    pageIndex: tableData.pageIndex ?? 0,
                    pageSize: tableData.pageSize ?? 10,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <GalleriesPublicDetailDrawer
                isOpen={detailOpen}
                onClose={() => {
                    setDetailOpen(false)
                    setSelectedSlug(null)
                }}
                gallerySlug={selectedSlug}
            />
        </>
    )
}

export default GalleriesPublicListTable
