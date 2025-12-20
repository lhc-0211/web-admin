import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteIssuingAuthoritiesAdmin } from '@/services/UserService' // Đổi tên API cho đúng
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useIssuingAuthorities from '../hooks/useIssuingAuthorities' // Hook đúng tên
import IssuingAuthoritiesEditModal from './IssuingAuthoritiesEditModal' // Modal đúng tên

const IssuingAuthoritiesTable = () => {
    const {
        issuingAuthorities, // Đổi tên biến cho rõ nghĩa
        issuingAuthoritiesTotal, // Tổng số bản ghi
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useIssuingAuthorities()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedAuthority, setSelectedAuthority] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [authorityToDelete, setAuthorityToDelete] = useState(null)

    const openEditModal = (authority) => {
        setSelectedAuthority(authority)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedAuthority(null)
    }

    const openDeleteModal = (authority) => {
        setAuthorityToDelete(authority)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setAuthorityToDelete(null)
    }

    const confirmDelete = async () => {
        if (!authorityToDelete) return

        try {
            await apiDeleteIssuingAuthoritiesAdmin(authorityToDelete.id)
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa cơ quan cấp:{' '}
                    <strong>{authorityToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa cơ quan cấp thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Mã cơ quan',
                accessorKey: 'code',
                size: 150,
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.code || '-'}
                    </span>
                ),
            },
            {
                header: 'Tên cơ quan',
                accessorKey: 'name',
                size: 300,
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-700">
                        {row.original.name || '-'}
                    </span>
                ),
            },
            {
                header: 'Mô tả',
                accessorKey: 'description',
                size: 350,
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
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const authority = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(authority)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(authority)}
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
                data={issuingAuthorities}
                loading={isLoading}
                noData={!isLoading && issuingAuthorities.length === 0}
                pagingData={{
                    total: issuingAuthoritiesTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa cơ quan cấp */}
            <IssuingAuthoritiesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                authority={selectedAuthority}
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
                        Xác nhận xóa cơ quan cấp
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa cơ quan cấp
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{authorityToDelete?.name}"
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

export default IssuingAuthoritiesTable
