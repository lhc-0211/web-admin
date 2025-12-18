import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
    apiArchiveAnnouncementAdmin, // Có thể đổi tên thành apiArchiveNewsAdmin nếu cần
    apiDeleteAnnouncementAdmin,
    apiPinAnnouncementAdmin,
    apiPublishAnnouncementAdmin,
    apiUnpinAnnouncementAdmin,
} from '@/services/Announcements' // Đổi thành News service nếu tách riêng
import { useMemo, useState } from 'react'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import { HiPaperAirplane, HiPencil, HiTrash } from 'react-icons/hi'
import { HiArchiveBox, HiExclamationTriangle } from 'react-icons/hi2'
import useNews from '../hooks/useNews' // ← Hook đúng cho News
import NewsEditModal from './NewsEditModal' // ← Modal sửa tin tức

const NewsTable = () => {
    const {
        news,
        total: totalItems,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useNews()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)

    // Modal xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newsToDelete, setNewsToDelete] = useState(null)

    // Modal lưu trữ
    const [archiveModalOpen, setArchiveModalOpen] = useState(false)
    const [newsToArchive, setNewsToArchive] = useState(null)

    // Modal Ghim
    const [pinModalOpen, setPinModalOpen] = useState(false)
    const [newsToPin, setNewsToPin] = useState(null)
    const [pinnedOrderInput, setPinnedOrderInput] = useState(0)

    // Modal Bỏ ghim
    const [unpinModalOpen, setUnpinModalOpen] = useState(false)
    const [newsToUnpin, setNewsToUnpin] = useState(null)

    // Modal Xuất bản
    const [publishModalOpen, setPublishModalOpen] = useState(false)
    const [newsToPublish, setNewsToPublish] = useState(null)
    const [publishAtDate, setPublishAtDate] = useState(new Date())

    // === Modal Sửa ===
    const openEditModal = (item) => {
        setSelectedNews(item)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedNews(null)
    }

    // === Xử lý Xóa ===
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
            await apiDeleteAnnouncementAdmin(newsToDelete.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa tin tức: <strong>{newsToDelete.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa tin tức thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    // === Xử lý Lưu trữ ===
    const openArchiveModal = (item) => {
        setNewsToArchive(item)
        setArchiveModalOpen(true)
    }

    const closeArchiveModal = () => {
        setArchiveModalOpen(false)
        setNewsToArchive(null)
    }

    const handleArchive = async () => {
        if (!newsToArchive) return
        try {
            await apiArchiveAnnouncementAdmin(newsToArchive.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã lưu trữ tin tức: <strong>{newsToArchive.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Lưu trữ tin tức thất bại!
                </Notification>,
            )
        } finally {
            closeArchiveModal()
        }
    }

    // === Xử lý Ghim ===
    const openPinModal = (item) => {
        setNewsToPin(item)
        setPinnedOrderInput(item.pinnedOrder ?? 0)
        setPinModalOpen(true)
    }

    const closePinModal = () => {
        setPinModalOpen(false)
        setNewsToPin(null)
        setPinnedOrderInput(0)
    }

    const handlePin = async () => {
        if (!newsToPin) return
        try {
            await apiPinAnnouncementAdmin(newsToPin.id, {
                pinnedOrder: pinnedOrderInput,
            })
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã ghim tin tức: <strong>{newsToPin.title}</strong> (Thứ tự:{' '}
                    {pinnedOrderInput})
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Ghim tin tức thất bại!
                </Notification>,
            )
        } finally {
            closePinModal()
        }
    }

    // === Xử lý Bỏ ghim ===
    const openUnpinModal = (item) => {
        setNewsToUnpin(item)
        setUnpinModalOpen(true)
    }

    const closeUnpinModal = () => {
        setUnpinModalOpen(false)
        setNewsToUnpin(null)
    }

    const handleUnpin = async () => {
        if (!newsToUnpin) return
        try {
            await apiUnpinAnnouncementAdmin(newsToUnpin.id)
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã bỏ ghim tin tức: <strong>{newsToUnpin.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Bỏ ghim tin tức thất bại!
                </Notification>,
            )
        } finally {
            closeUnpinModal()
        }
    }

    // === Xử lý Xuất bản ===
    const openPublishModal = (item) => {
        setNewsToPublish(item)
        setPublishAtDate(
            item.publishedAt ? new Date(item.publishedAt) : new Date(),
        )
        setPublishModalOpen(true)
    }

    const closePublishModal = () => {
        setPublishModalOpen(false)
        setNewsToPublish(null)
        setPublishAtDate(new Date())
    }

    const handlePublish = async () => {
        if (!newsToPublish) return
        try {
            await apiPublishAnnouncementAdmin(newsToPublish.id, {
                publishAt: publishAtDate.toISOString(),
            })
            mutate()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xuất bản tin tức: <strong>{newsToPublish.title}</strong>
                    {publishAtDate > new Date() ? ' (Lên lịch)' : ''}
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xuất bản tin tức thất bại!
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
                size: 300,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        {row.original.featuredImageUrl && (
                            <img
                                src={row.original.featuredImageUrl}
                                alt=""
                                className="w-10 h-10 object-cover rounded"
                            />
                        )}
                        <span className="font-medium">
                            {row.original.title || '-'}
                        </span>
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
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 120,
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusConfig = {
                        Draft: {
                            label: 'Nháp',
                            color: 'bg-gray-100 text-gray-800',
                        },
                        Published: {
                            label: 'Đã đăng',
                            color: 'bg-green-100 text-green-800',
                        },
                        Scheduled: {
                            label: 'Lên lịch',
                            color: 'bg-blue-100 text-blue-800',
                        },
                    }
                    const config = statusConfig[status] || {
                        label: status,
                        color: 'bg-gray-100 text-gray-800',
                    }
                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
                        >
                            {config.label}
                        </span>
                    )
                },
            },
            {
                header: 'Lượt xem',
                accessorKey: 'viewCount',
                size: 100,
                cell: ({ row }) => row.original.viewCount ?? 0,
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
                size: 260,
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            {/* Sửa */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(item)}
                                title="Sửa"
                            />

                            {/* Ghim / Bỏ ghim */}
                            {item.isPinned ? (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngleFill />}
                                    onClick={() => openUnpinModal(item)}
                                    title="Bỏ ghim"
                                />
                            ) : (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="indigo-600"
                                    icon={<BsPinAngle />}
                                    onClick={() => openPinModal(item)}
                                    title="Ghim"
                                />
                            )}

                            {/* Xuất bản - chỉ hiện khi Draft */}
                            {item.status === 'Draft' && (
                                <Button
                                    size="xs"
                                    variant="twoTone"
                                    color="green-600"
                                    icon={
                                        <HiPaperAirplane className="-rotate-45" />
                                    }
                                    onClick={() => openPublishModal(item)}
                                    title="Xuất bản"
                                />
                            )}

                            {/* Lưu trữ */}
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="amber-600"
                                icon={<HiArchiveBox />}
                                onClick={() => openArchiveModal(item)}
                                title="Lưu trữ"
                            />

                            {/* Xóa */}
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
                noData={!isLoading && news.length === 0}
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
            <NewsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                news={selectedNews}
            />
            {/* Modal sửa */}
            <NewsEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                announcement={selectedNews}
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
                            "{newsToArchive?.title}"
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
                            "{newsToPin?.title}"
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
                            "{newsToUnpin?.title}"
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
                            "{newsToPublish?.title}"
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

export default NewsTable
