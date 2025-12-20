import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteDocumentFieldAdmin } from '@/services/DocumentsService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useFields from '../hooks/useFields'
import FieldsEditModal from './FieldsEditModal' // Đảm bảo file này tồn tại

const FieldsTable = () => {
    const {
        fields,
        total: fieldsTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useFields()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedField, setSelectedField] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [fieldToDelete, setFieldToDelete] = useState(null)

    const openEditModal = (field) => {
        setSelectedField(field)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedField(null)
    }

    const openDeleteModal = (field) => {
        setFieldToDelete(field)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setFieldToDelete(null)
    }

    const confirmDelete = async () => {
        if (!fieldToDelete) return

        try {
            await apiDeleteDocumentFieldAdmin(fieldToDelete.id)
            mutate() // Refetch lại danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa trường thông tin:{' '}
                    <strong>{fieldToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa trường thông tin thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Mã trường',
                accessorKey: 'code',
                size: 150,
                cell: ({ row }) => (
                    <span className="font-medium text-primary ">
                        {row.original.code || '-'}
                    </span>
                ),
            },
            {
                header: 'Tên trường',
                accessorKey: 'name',
                size: 250,
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-700">
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
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const field = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(field)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(field)}
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
                data={fields}
                loading={isLoading}
                noData={!isLoading && fields?.length === 0}
                pagingData={{
                    total: fieldsTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa trường thông tin */}
            <FieldsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                field={selectedField}
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
                        Xác nhận xóa trường thông tin
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa trường thông tin
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{fieldToDelete?.name}"
                        </span>
                        {fieldToDelete?.code && (
                            <span className="block text-sm text-gray-500 mt-1">
                                (Mã: {fieldToDelete.code})
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

export default FieldsTable
