import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteDocumentTypeAdmin } from '@/services/DocumentsService' // Điều chỉnh tên API phù hợp
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useTypes from '../hooks/useTypes' // Hook đúng cho types
import TypesEditModal from './TypesEditModal'

const TypesTable = () => {
    const {
        types, // Danh sách loại tài liệu
        total: typesTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useTypes()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedType, setSelectedType] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [typeToDelete, setTypeToDelete] = useState(null)

    const openEditModal = (type) => {
        setSelectedType(type)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedType(null)
    }

    const openDeleteModal = (type) => {
        setTypeToDelete(type)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setTypeToDelete(null)
    }

    const confirmDelete = async () => {
        if (!typeToDelete) return

        try {
            await apiDeleteDocumentTypeAdmin(typeToDelete.id)
            mutate() // Refetch lại danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa loại tài liệu: <strong>{typeToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa loại tài liệu thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Mã loại',
                accessorKey: 'code',
                size: 150,
                cell: ({ row }) => (
                    <span className="font-medium text-primary">
                        {row.original.code || '-'}
                    </span>
                ),
            },
            {
                header: 'Tên loại tài liệu',
                accessorKey: 'name',
                size: 250,
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-600">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Slug',
                accessorKey: 'slug',
                size: 200,
                cell: ({ row }) => (
                    <span className="text-sm text-gray-600 font-mono">
                        {row.original.slug || '-'}
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
                    const type = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(type)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(type)}
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
                data={types}
                loading={isLoading}
                noData={!isLoading && types?.length === 0}
                pagingData={{
                    total: typesTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa loại tài liệu */}
            <TypesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                type={selectedType}
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
                        Xác nhận xóa loại tài liệu
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa loại tài liệu
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{typeToDelete?.name}"
                        </span>
                        {typeToDelete?.code && (
                            <span className="block text-sm text-gray-500 mt-1">
                                (Mã: {typeToDelete.code})
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

export default TypesTable
