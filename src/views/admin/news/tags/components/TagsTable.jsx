import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteNewsTagsAdmin } from '@/services/News'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useTags from '../hooks/useTags'
import TagsEditModal from './TagsEditModal'

const TagsTable = () => {
    const {
        tags,
        total: totalItems,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useTags()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedTags, setSelectedTags] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [tagToDelete, setTagsToDelete] = useState(null)

    const openEditModal = (tag) => {
        setSelectedTags(tag)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedTags(null)
    }

    const openDeleteModal = (tag) => {
        setTagsToDelete(tag)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setTagsToDelete(null)
    }

    const confirmDelete = async () => {
        if (!tagToDelete) return

        try {
            await apiDeleteNewsTagsAdmin(tagToDelete.id)
            mutate() // Refetch danh sách
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa tag: <strong>{tagToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa tag thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên tag',
                accessorKey: 'name',
                size: 250,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.name || '-'}
                    </span>
                ),
            },

            {
                header: 'Mô tả',
                accessorKey: 'description',
                size: 300,
                cell: ({ row }) => row.original.description || '-',
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
                    const tag = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(tag)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(tag)}
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
                data={tags}
                loading={isLoading}
                noData={!isLoading && tags.length === 0}
                pagingData={{
                    total: totalItems,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa tag */}
            <TagsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                tag={selectedTags}
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
                        Xác nhận xóa tag
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa tag
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{tagToDelete?.name}"
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

export default TagsTable
