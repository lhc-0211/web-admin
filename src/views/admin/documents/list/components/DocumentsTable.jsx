import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
    apiArchiveDocumentAdmin,
    apiDeleteDocumentAdmin,
    apiPinDocumentAdmin,
    apiUnpinDocumentAdmin,
} from '@/services/DocumentsService'
import { useMemo, useState } from 'react'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiArchiveBox, HiExclamationTriangle } from 'react-icons/hi2'
import useDocuments from '../hooks/useDocuments'
import DocumentsEditModal from './DocumentsEditModal'

const DocumentsTable = () => {
    const {
        documents, // <-- Đổi tên biến
        total: totalItems,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useDocuments()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState(null)

    // Modal xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [documentToDelete, setDocumentToDelete] = useState(null)

    // Modal lưu trữ
    const [archiveModalOpen, setArchiveModalOpen] = useState(false)
    const [documentToArchive, setDocumentToArchive] = useState(null)

    // Modal Ghim (có nhập thứ tự)
    const [pinModalOpen, setPinModalOpen] = useState(false)
    const [documentToPin, setDocumentToPin] = useState(null)
    const [pinnedOrderInput, setPinnedOrderInput] = useState(0)

    // Modal Bỏ ghim
    const [unpinModalOpen, setUnpinModalOpen] = useState(false)
    const [documentToUnpin, setDocumentToUnpin] = useState(null)

    // === Hàm xử lý Ghim ===
    const openPinModal = (document) => {
        setDocumentToPin(document)
        setPinnedOrderInput(document.pinnedOrder ?? 0)
        setPinModalOpen(true)
    }

    const closePinModal = () => {
        setPinModalOpen(false)
        setDocumentToPin(null)
        setPinnedOrderInput(0)
    }

    const handlePin = async () => {
        if (!documentToPin) return
        try {
            await apiPinDocumentAdmin(documentToPin.id, {
                pinnedOrder: pinnedOrderInput,
            })
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã ghim tài liệu:{' '}
                    <strong>{documentToPin.documentNumber}</strong> (Thứ tự:{' '}
                    {pinnedOrderInput})
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Ghim tài liệu thất bại!
                </Notification>,
            )
        } finally {
            closePinModal()
        }
    }

    // === Hàm xử lý Bỏ ghim ===
    const openUnpinModal = (document) => {
        setDocumentToUnpin(document)
        setUnpinModalOpen(true)
    }

    const closeUnpinModal = () => {
        setUnpinModalOpen(false)
        setDocumentToUnpin(null)
    }

    const handleUnpin = async () => {
        if (!documentToUnpin) return
        try {
            await apiUnpinDocumentAdmin(documentToUnpin.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã bỏ ghim tài liệu:{' '}
                    <strong>{documentToUnpin.documentNumber}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Bỏ ghim tài liệu thất bại!
                </Notification>,
            )
        } finally {
            closeUnpinModal()
        }
    }

    // === Hàm xử lý Lưu trữ ===
    const openArchiveModal = (document) => {
        setDocumentToArchive(document)
        setArchiveModalOpen(true)
    }

    const closeArchiveModal = () => {
        setArchiveModalOpen(false)
        setDocumentToArchive(null)
    }

    const handleArchive = async () => {
        if (!documentToArchive) return
        try {
            await apiArchiveDocumentAdmin(documentToArchive.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã lưu trữ tài liệu:{' '}
                    <strong>{documentToArchive.documentNumber}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Lưu trữ tài liệu thất bại!
                </Notification>,
            )
        } finally {
            closeArchiveModal()
        }
    }

    // === Modal Xóa ===
    const openDeleteModal = (document) => {
        setDocumentToDelete(document)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setDocumentToDelete(null)
    }

    const confirmDelete = async () => {
        if (!documentToDelete) return
        try {
            await apiDeleteDocumentAdmin(documentToDelete.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa tài liệu:{' '}
                    <strong>{documentToDelete.documentNumber}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa tài liệu thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    // === Modal Sửa ===
    const openEditModal = (document) => {
        setSelectedDocument(document)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedDocument(null)
    }

    const columns = useMemo(
        () => [
            {
                header: 'Số hiệu văn bản',
                accessorKey: 'documentNumber',
                size: 180,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.documentNumber || '-'}
                    </span>
                ),
            },
            {
                header: 'Loại văn bản',
                accessorKey: 'documentTypeName',
                size: 200,
                cell: ({ row }) => row.original.documentTypeName || '-',
            },
            {
                header: 'Lĩnh vực',
                accessorKey: 'documentCategoryName',
                size: 200,
                cell: ({ row }) => row.original.documentCategoryName || '-',
            },
            {
                header: 'Cơ quan ban hành',
                accessorKey: 'issuingAuthorityName',
                size: 220,
                cell: ({ row }) => row.original.issuingAuthorityName || '-',
            },
            {
                header: 'Ngày ban hành',
                accessorKey: 'issuedDate',
                size: 160,
                cell: ({ row }) => {
                    const date = row.original.issuedDate
                    if (!date) return '-'
                    return new Date(date).toLocaleDateString('vi-VN')
                },
            },
            {
                header: 'Ngày hiệu lực',
                accessorKey: 'effectiveDate',
                size: 160,
                cell: ({ row }) => {
                    const date = row.original.effectiveDate
                    if (!date) return '-'
                    return new Date(date).toLocaleDateString('vi-VN')
                },
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 120,
                cell: ({ row }) => (
                    <span
                        className={`font-medium ${row.original.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}
                    >
                        {row.original.status === 'Active'
                            ? 'Có hiệu lực'
                            : 'Hết hiệu lực'}
                    </span>
                ),
            },
            {
                header: 'Công khai',
                accessorKey: 'isPublic',
                size: 100,
                cell: ({ row }) => (
                    <span
                        className={`font-medium ${row.original.isPublic ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {row.original.isPublic ? 'Có' : 'Không'}
                    </span>
                ),
            },
            // CỘT HÀNH ĐỘNG
            {
                header: 'Hành động',
                id: 'actions',
                size: 200,
                cell: ({ row }) => {
                    const document = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            {/* Sửa */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(document)}
                                title="Sửa"
                            />
                            {/* Ghim / Bỏ ghim */}
                            {document.isPinned ? (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngleFill />}
                                    onClick={() => openUnpinModal(document)}
                                    title="Bỏ ghim"
                                />
                            ) : (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngle />}
                                    onClick={() => openPinModal(document)}
                                    title="Ghim"
                                />
                            )}
                            {/* Lưu trữ */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="amber-600"
                                icon={<HiArchiveBox />}
                                onClick={() => openArchiveModal(document)}
                                title="Lưu trữ"
                            />
                            {/* Xóa */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(document)}
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
                data={documents}
                loading={isLoading}
                noData={!isLoading && documents.length === 0}
                pagingData={{
                    total: totalItems,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa */}
            <DocumentsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                document={selectedDocument}
            />

            {/* Các Dialog xác nhận (Xóa, Lưu trữ, Ghim, Bỏ ghim) */}
            {/* Giữ nguyên cấu trúc như cũ, chỉ thay tên biến và tiêu đề cho phù hợp với "tài liệu" */}

            {/* Modal Xóa */}
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
                        Xác nhận xóa tài liệu
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa tài liệu
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{documentToDelete?.documentNumber}"
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

            {/* Modal Lưu trữ */}
            <Dialog
                isOpen={archiveModalOpen}
                onClose={closeArchiveModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
                        <HiArchiveBox className="h-10 w-10 text-amber-600" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận lưu trữ tài liệu
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn lưu trữ tài liệu
                        <br />
                        <span className="font-semibold text-amber-700 text-lg">
                            "{documentToArchive?.documentNumber}"
                        </span>
                        <br />
                        không?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeArchiveModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="amber-600"
                            size="lg"
                            onClick={handleArchive}
                            className="px-8"
                        >
                            Lưu trữ
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Modal Ghim */}
            <Dialog isOpen={pinModalOpen} onClose={closePinModal} width={550}>
                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                            <BsPinAngle className="h-10 w-10 text-indigo-600" />
                        </div>
                    </div>
                    <h5 className="text-xl font-bold text-center text-gray-900 mb-4">
                        Ghim tài liệu
                    </h5>
                    <p className="text-base text-gray-600 text-center mb-6">
                        Tài liệu{' '}
                        <strong className="text-indigo-700">
                            "{documentToPin?.documentNumber}"
                        </strong>{' '}
                        sẽ được hiển thị nổi bật ở đầu danh sách.
                    </p>

                    <FormItem label="Thứ tự hiển thị khi ghim (số nhỏ hơn sẽ hiển thị trước)">
                        <Input
                            type="number"
                            min="0"
                            value={pinnedOrderInput}
                            onChange={(e) =>
                                setPinnedOrderInput(
                                    parseInt(e.target.value) || 0,
                                )
                            }
                            placeholder="Ví dụ: 0 (cao nhất), 1, 2..."
                            className="text-center text-lg font-medium"
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Số càng nhỏ → hiển thị càng cao trong danh sách ghim
                        </p>
                    </FormItem>

                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closePinModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="indigo-600"
                            size="lg"
                            onClick={handlePin}
                            className="px-8"
                        >
                            Ghim tài liệu
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Modal Bỏ ghim */}
            <Dialog
                isOpen={unpinModalOpen}
                onClose={closeUnpinModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                        <BsPinAngleFill className="h-10 w-10 text-gray-600 rotate-45" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận bỏ ghim tài liệu
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc muốn bỏ ghim tài liệu
                        <br />
                        <span className="font-semibold text-gray-700 text-lg">
                            "{documentToUnpin?.documentNumber}"
                        </span>
                        <br />
                        không?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeUnpinModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="gray-600"
                            size="lg"
                            onClick={handleUnpin}
                            className="px-8"
                        >
                            Bỏ ghim
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default DocumentsTable
