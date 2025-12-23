import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteNewPublic } from '@/services/NewsService' // Giả sử bạn có API xóa news
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useNews from '../hooks/useNews' // Hook lấy danh sách news
import NewsEditModal from './NewsEditModal'

const NewsTable = () => {
    const { news, total, tableData, isLoading, setTableData, mutate } =
        useNews()

    // Edit & Delete states
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newsToDelete, setNewsToDelete] = useState(null)

    const openEditModal = (item) => {
        setSelectedNews(item)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedNews(null)
    }

    const openDeleteModal = (item) => {
        setNewsToDelete(item)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setNewsToDelete(null)
    }

    const confirmDelete = async () => {
        if (!newsToDelete) return

        try {
            await apiDeleteNewPublic(newsToDelete.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa bài viết: <strong>{newsToDelete.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa bài viết thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 300,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.title || '-'}
                    </span>
                ),
            },
            {
                header: 'Tóm tắt',
                accessorKey: 'summary',
                size: 350,
                cell: ({ row }) => (
                    <div className="max-w-xs truncate">
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
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 120,
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusColor =
                        status === 'Published'
                            ? 'green'
                            : status === 'Draft'
                              ? 'orange'
                              : 'gray'
                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}
                        >
                            {status === 'Published'
                                ? 'Đã đăng'
                                : status === 'Draft'
                                  ? 'Nháp'
                                  : status}
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
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(item)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(item)}
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
                data={news}
                loading={isLoading}
                noData={!isLoading && news?.length === 0}
                pagingData={{
                    total: total,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa bài viết */}
            <NewsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                news={selectedNews}
                onSuccess={mutate}
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
                        Xác nhận xóa bài viết
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa bài viết
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{newsToDelete?.title}"
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

export default NewsTable
