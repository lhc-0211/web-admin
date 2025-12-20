import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteGalleryAdmin } from '@/services/GalleyService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useGalleries from '../hooks/useGalleries' // Đúng hook
import GalleriesEditModal from './GalleriesEditModal'

const GalleriesTable = () => {
    const {
        galleries,
        total: galleriesTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useGalleries()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedGallery, setSelectedGallery] = useState(null)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [galleryToDelete, setGalleryToDelete] = useState(null)

    const openEditModal = (gallery) => {
        setSelectedGallery(gallery)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedGallery(null)
    }

    const openDeleteModal = (gallery) => {
        setGalleryToDelete(gallery)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setGalleryToDelete(null)
    }

    const confirmDelete = async () => {
        if (!galleryToDelete) return

        try {
            await apiDeleteGalleryAdmin(galleryToDelete.id)

            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa bộ sưu tập: <strong>{galleryToDelete.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa bộ sưu tập thất bại! Vui lòng thử lại.
                </Notification>,
            )
        } finally {
            closeDeleteModal()
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
                data={galleries ?? []}
                loading={isLoading}
                noData={!isLoading && (!galleries || galleries.length === 0)}
                pagingData={{
                    total: galleriesTotal ?? 0,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa */}
            <GalleriesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                gallery={selectedGallery}
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
                        Xác nhận xóa bộ sưu tập
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa bộ sưu tập
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{galleryToDelete?.title}"
                        </span>
                        {galleryToDelete?.categoryName && (
                            <span className="block text-sm text-gray-500 mt-1">
                                Danh mục: {galleryToDelete.categoryName}
                            </span>
                        )}
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

export default GalleriesTable
