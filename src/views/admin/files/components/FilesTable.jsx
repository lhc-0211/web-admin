import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useFiles from '../hooks/useFiles' // Hook lấy danh sách files
import FilesEditModal from './FilesEditModal'
import { apiDeleteFileAdmin } from '@/services/FileService'

const FilesTable = () => {
    const {
        files, // Danh sách file
        filesTotal, // Tổng số file
        tableData,
        isLoading,
        setTableData,
        mutate, // Để refetch sau khi xóa/sửa
    } = useFiles()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [fileToDelete, setFileToDelete] = useState(null)

    const openEditModal = (file) => {
        setSelectedFile(file)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedFile(null)
    }

    const openDeleteModal = (file) => {
        setFileToDelete(file)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setFileToDelete(null)
    }

    const confirmDelete = async () => {
        if (!fileToDelete) return

        try {
            await apiDeleteFileAdmin(fileToDelete.id) // API xóa file
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa file:{' '}
                    <strong>{fileToDelete.originalFileName}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa file thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên file gốc',
                accessorKey: 'originalFileName',
                size: 250,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.originalFileName || '-'}
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
                header: 'Alt Text',
                accessorKey: 'altText',
                size: 250,
                cell: ({ row }) => row.original.altText || '-',
            },
            {
                header: 'Loại',
                accessorKey: 'contentType',
                size: 150,
                cell: ({ row }) => row.original.contentType || '-',
            },
            {
                header: 'Danh mục',
                accessorKey: 'category',
                size: 120,
                cell: ({ row }) => row.original.category || '-',
            },
            {
                header: 'Ngày tải lên',
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
                    const file = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(file)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(file)}
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
                data={files}
                loading={isLoading}
                noData={!isLoading && files?.length === 0}
                pagingData={{
                    total: filesTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa file */}
            <FilesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                file={selectedFile}
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
                        Xác nhận xóa file
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa file
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{fileToDelete?.originalFileName}"
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

export default FilesTable
