import DataTable from '@/components/shared/DataTable'
import { DatePicker, Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
    apiArchiveAnnouncementAdmin,
    apiDeleteAnnouncementAdmin,
    apiPinAnnouncementAdmin,
    apiPublishAnnouncementAdmin,
    apiUnpinAnnouncementAdmin,
} from '@/services/Announcements'
import { useMemo, useState } from 'react'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import { HiPaperAirplane, HiPencil, HiTrash } from 'react-icons/hi'
import { HiArchiveBox, HiExclamationTriangle } from 'react-icons/hi2'
import useAnnouncements from '../hooks/useAnnouncements'
import AnnouncementsEditModal from './AnnouncementsEditModal'

const AnnouncementsTable = () => {
    const {
        announcements,
        total: totalItems,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useAnnouncements()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

    // Modal xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState(null)

    // Modal lưu trữ
    const [archiveModalOpen, setArchiveModalOpen] = useState(false)
    const [announcementToArchive, setAnnouncementToArchive] = useState(null)

    // Modal Ghim (có nhập thứ tự)
    const [pinModalOpen, setPinModalOpen] = useState(false)
    const [announcementToPin, setAnnouncementToPin] = useState(null)
    const [pinnedOrderInput, setPinnedOrderInput] = useState(0)

    // Modal Bỏ ghim
    const [unpinModalOpen, setUnpinModalOpen] = useState(false)
    const [announcementToUnpin, setAnnouncementToUnpin] = useState(null)

    // Modal Publish
    const [publishModalOpen, setPublishModalOpen] = useState(false)
    const [announcementToPublish, setAnnouncementToPublish] = useState(null)
    const [publishAtDate, setPublishAtDate] = useState(new Date()) // Mặc định hôm nay

    // === Hàm xử lý Ghim ===
    const openPinModal = (announcement) => {
        setAnnouncementToPin(announcement)
        setPinnedOrderInput(announcement.pinnedOrder ?? 0)
        setPinModalOpen(true)
    }

    const closePinModal = () => {
        setPinModalOpen(false)
        setAnnouncementToPin(null)
        setPinnedOrderInput(0)
    }

    const handlePin = async () => {
        if (!announcementToPin) return
        try {
            // Gửi kèm pinnedOrder nếu API hỗ trợ
            await apiPinAnnouncementAdmin(announcementToPin.id, {
                pinnedOrder: pinnedOrderInput,
            })
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã ghim thông báo:{' '}
                    <strong>{announcementToPin.title}</strong> (Thứ tự:{' '}
                    {pinnedOrderInput})
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Ghim thông báo thất bại!
                </Notification>,
            )
        } finally {
            closePinModal()
        }
    }

    // === Hàm xử lý Bỏ ghim ===
    const openUnpinModal = (announcement) => {
        setAnnouncementToUnpin(announcement)
        setUnpinModalOpen(true)
    }

    const closeUnpinModal = () => {
        setUnpinModalOpen(false)
        setAnnouncementToUnpin(null)
    }

    const handleUnpin = async () => {
        if (!announcementToUnpin) return
        try {
            await apiUnpinAnnouncementAdmin(announcementToUnpin.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã bỏ ghim thông báo:{' '}
                    <strong>{announcementToUnpin.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Bỏ ghim thông báo thất bại!
                </Notification>,
            )
        } finally {
            closeUnpinModal()
        }
    }

    // === Hàm xử lý Lưu trữ ===
    const openArchiveModal = (announcement) => {
        setAnnouncementToArchive(announcement)
        setArchiveModalOpen(true)
    }

    const closeArchiveModal = () => {
        setArchiveModalOpen(false)
        setAnnouncementToArchive(null)
    }

    const handleArchive = async () => {
        if (!announcementToArchive) return
        try {
            await apiArchiveAnnouncementAdmin(announcementToArchive.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã lưu trữ thông báo:{' '}
                    <strong>{announcementToArchive.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Lưu trữ thông báo thất bại!
                </Notification>,
            )
        } finally {
            closeArchiveModal()
        }
    }

    // === Modal Xóa ===
    const openDeleteModal = (announcement) => {
        setAnnouncementToDelete(announcement)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setAnnouncementToDelete(null)
    }

    const confirmDelete = async () => {
        if (!announcementToDelete) return
        try {
            await apiDeleteAnnouncementAdmin(announcementToDelete.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa thông báo:{' '}
                    <strong>{announcementToDelete.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa thông báo thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    // === Modal Sửa ===
    const openEditModal = (announcement) => {
        setSelectedAnnouncement(announcement)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedAnnouncement(null)
    }

    // === Hàm xử lý Xuất bản ===
    const openPublishModal = (announcement) => {
        setAnnouncementToPublish(announcement)
        setPublishAtDate(
            announcement.publishAt
                ? new Date(announcement.publishAt)
                : new Date(),
        )
        setPublishModalOpen(true)
    }

    const closePublishModal = () => {
        setPublishModalOpen(false)
        setAnnouncementToPublish(null)
        setPublishAtDate(new Date())
    }

    const handlePublish = async () => {
        if (!announcementToPublish) return
        try {
            await apiPublishAnnouncementAdmin(announcementToPublish.id, {
                publishAt: publishAtDate.toISOString(),
            })
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xuất bản thông báo:{' '}
                    <strong>{announcementToPublish.title}</strong>
                    {publishAtDate > new Date() ? ' (Lên lịch)' : ''}
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xuất bản thông báo thất bại!
                </Notification>,
            )
        } finally {
            closePublishModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 280,
                cell: ({ row }) => (
                    <span className="font-medium text-primary">
                        {row.original.title || '-'}
                    </span>
                ),
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                size: 200,
                cell: ({ row }) => row.original.categoryName || '-',
            },
            {
                header: 'Độ ưu tiên',
                accessorKey: 'priority',
                size: 120,
                cell: ({ row }) => {
                    const priority = row.original.priority
                    const priorityLabel =
                        {
                            Low: 'Thấp',
                            Medium: 'Trung bình',
                            High: 'Cao',
                            Critical: 'Nghiêm trọng',
                        }[priority] || priority
                    const colorClass =
                        {
                            Low: 'bg-green-100 text-green-800',
                            Medium: 'bg-yellow-100 text-yellow-800',
                            High: 'bg-orange-100 text-orange-800',
                            Critical: 'bg-red-100 text-red-800',
                        }[priority] || 'bg-gray-100 text-gray-800'
                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
                        >
                            {priorityLabel}
                        </span>
                    )
                },
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
            // CỘT HÀNH ĐỘNG
            {
                header: 'Hành động',
                id: 'actions',
                size: 250,
                cell: ({ row }) => {
                    const announcement = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            {/* Sửa */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(announcement)}
                                title="Sửa"
                            />
                            {/* Ghim / Bỏ ghim */}
                            {announcement.isPinned ? (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngleFill />}
                                    onClick={() => openUnpinModal(announcement)}
                                    title="Bỏ ghim"
                                />
                            ) : (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngle />}
                                    onClick={() => openPinModal(announcement)}
                                    title="Ghim"
                                />
                            )}
                            {/* Lưu trữ */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="amber-600"
                                icon={<HiArchiveBox />}
                                onClick={() => openArchiveModal(announcement)}
                                title="Lưu trữ"
                            />
                            {/* Xuất bản */}
                            {!announcement.isPublic && (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="green-600"
                                    icon={
                                        <HiPaperAirplane className="-rotate-45" />
                                    }
                                    onClick={() =>
                                        openPublishModal(announcement)
                                    }
                                    title="Xuất bản"
                                />
                            )}
                            {/* Xóa */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(announcement)}
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
                data={announcements}
                loading={isLoading}
                noData={!isLoading && announcements.length === 0}
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
            <AnnouncementsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                announcement={selectedAnnouncement}
            />

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
                        Xác nhận xóa thông báo
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa thông báo
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{announcementToDelete?.title}"
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
                        Xác nhận lưu trữ thông báo
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn lưu trữ thông báo
                        <br />
                        <span className="font-semibold text-amber-700 text-lg">
                            "{announcementToArchive?.title}"
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-amber-600 font-medium">
                            Thông báo sẽ bị ẩn khỏi danh sách công khai nhưng
                            vẫn có thể khôi phục.
                        </span>
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

            {/* Modal Ghim (có nhập thứ tự) */}
            <Dialog isOpen={pinModalOpen} onClose={closePinModal} width={550}>
                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                            <BsPinAngle className="h-10 w-10 text-indigo-600" />
                        </div>
                    </div>
                    <h5 className="text-xl font-bold text-center text-gray-900 mb-4">
                        Ghim thông báo
                    </h5>
                    <p className="text-base text-gray-600 text-center mb-6">
                        Thông báo{' '}
                        <strong className="text-indigo-700">
                            "{announcementToPin?.title}"
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
                            Ghim thông báo
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
                        Xác nhận bỏ ghim thông báo
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc muốn bỏ ghim thông báo
                        <br />
                        <span className="font-semibold text-gray-700 text-lg">
                            "{announcementToUnpin?.title}"
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-gray-600 font-medium">
                            Thông báo sẽ trở về vị trí bình thường trong danh
                            sách.
                        </span>
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

            {/* Modal Xuất bản thông báo */}
            <Dialog
                isOpen={publishModalOpen}
                onClose={closePublishModal}
                width={550}
            >
                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                            <HiPaperAirplane className="h-10 w-10 text-green-600 -rotate-45" />
                        </div>
                    </div>
                    <h5 className="text-xl font-bold text-center text-gray-900 mb-4">
                        Xuất bản thông báo
                    </h5>
                    <p className="text-base text-gray-600 text-center mb-6">
                        Thông báo{' '}
                        <strong className="text-green-700">
                            "{announcementToPublish?.title}"
                        </strong>{' '}
                        sẽ được công khai.
                    </p>

                    <FormItem label="Ngày xuất bản">
                        <DatePicker
                            value={publishAtDate}
                            onChange={(date) => setPublishAtDate(date)}
                            placeholder="Chọn ngày xuất bản"
                            showTimeSelect
                            dateFormat="dd/MM/yyyy HH:mm"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            {publishAtDate > new Date()
                                ? 'Thông báo sẽ được lên lịch và tự động công khai vào thời điểm này.'
                                : 'Thông báo sẽ được công khai ngay lập tức.'}
                        </p>
                    </FormItem>

                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closePublishModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="green-600"
                            size="lg"
                            onClick={handlePublish}
                            className="px-8"
                        >
                            Xuất bản ngay
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AnnouncementsTable
