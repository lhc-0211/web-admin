import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteGalleryCategoryAdmin } from '@/services/GalleyService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useCategories from '../hooks/useItems'
import ItemsEditModal from './ItemsEditModal'

const ItemsEditModal = () => {
    const {
        categories,
        total: categoriesTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useCategories()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const openEditModal = (category) => {
        setSelectedCategory(category)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedCategory(null)
    }

    const openDeleteModal = (category) => {
        setCategoryToDelete(category)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setCategoryToDelete(null)
    }

    const confirmDelete = async () => {
        if (!categoryToDelete) return

        try {
            await apiDeleteGalleryCategoryAdmin(categoryToDelete.id)

            // Refetch lại dữ liệu danh mục
            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa danh mục: <strong>{categoryToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa danh mục thất bại! Vui lòng thử lại.
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên danh mục',
                accessorKey: 'name',
                size: 250,
                sortable: true,
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Slug',
                accessorKey: 'slug',
                size: 200,
                cell: ({ row }) => (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {row.original.slug || '-'}
                    </code>
                ),
            },
            {
                header: 'Mô tả',
                accessorKey: 'description',
                size: 300,
                cell: ({ row }) => row.original.description || '-',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'isActive',
                size: 150,
                sortable: true,
                cell: ({ row }) => {
                    const isActive = row.original.isActive
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                    )
                },
            },
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const category = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(category)}
                                title="Sửa danh mục"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(category)}
                                title="Xóa danh mục"
                            />
                        </div>
                    )
                },
            },
        ],
        [mutate], // thêm dependency nếu cần (hiện tại không ảnh hưởng)
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
                data={categories ?? []}
                loading={isLoading}
                noData={!isLoading && (!categories || categories.length === 0)}
                pagingData={{
                    total: categoriesTotal ?? 0,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa danh mục */}
            {editModalOpen && (
                <ItemsEditModal
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    category={selectedCategory}
                    onSuccess={() => mutate(undefined, { revalidate: true })}
                />
            )}

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
                        Xác nhận xóa danh mục
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa danh mục
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{categoryToDelete?.name}"
                        </span>
                        {categoryToDelete?.code && (
                            <span className="block text-sm text-gray-500 mt-1">
                                Mã: {categoryToDelete.code}
                            </span>
                        )}
                        {categoryToDelete?.slug && (
                            <span className="block text-sm text-gray-500">
                                Slug: {categoryToDelete.slug}
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

export default ItemsEditModal
