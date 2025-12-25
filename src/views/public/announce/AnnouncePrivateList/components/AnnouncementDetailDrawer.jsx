import Drawer from '@/components/ui/Drawer'
import Tag from '@/components/ui/Tag'
import { apiGetAnnouncementDetail } from '@/services/Announcements'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const priorityColor = {
    Low: 'bg-green-200 text-gray-900',
    Normal: 'bg-blue-200 text-gray-900',
    High: 'bg-yellow-200 text-gray-900',
    Critical: 'bg-red-200 text-gray-900',
}

const priorityLabel = {
    Low: 'Thấp',
    Normal: 'Bình thường',
    High: 'Cao',
    Critical: 'Cực kỳ',
}

const statusColor = {
    Draft: 'bg-gray-200 text-gray-900',
    Scheduled: 'bg-orange-200 text-gray-900',
    Published: 'bg-green-500 text-white',
    Archived: 'bg-purple-200 text-gray-900',
}

const statusLabel = {
    Draft: 'Bản nháp',
    Scheduled: 'Đã lên lịch',
    Published: 'Đã xuất bản',
    Archived: 'Lưu trữ',
}

export default function AnnouncementDetailDrawer({
    isOpen,
    onClose,
    announcementId,
}) {
    const [detail, setDetail] = useState(null) // hoặc tạo type chi tiết nếu có
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !announcementId) {
            setDetail(null)
            return
        }

        const fetchDetail = async () => {
            setLoading(true)
            try {
                const response = await apiGetAnnouncementDetail(announcementId)
                setDetail(response)
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết thông báo:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [isOpen, announcementId])

    return (
        <Drawer
            title="Chi tiết thông báo"
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={600}
        >
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : detail ? (
                <div className="space-y-6 overflow-y-auto pb-6">
                    {/* Tiêu đề & Tag */}
                    <div>
                        <h3 className="text-xl font-bold">{detail.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-3">
                            <Tag
                                className={
                                    priorityColor[detail.priority] ||
                                    priorityColor.Normal
                                }
                            >
                                {priorityLabel[detail.priority] ||
                                    detail.priority}
                            </Tag>
                            <Tag
                                className={
                                    statusColor[detail.status] ||
                                    statusColor.Draft
                                }
                            >
                                {statusLabel[detail.status] || detail.status}
                            </Tag>
                            {detail.isPinned && (
                                <Tag className="bg-purple-200 text-purple-900">
                                    Đã ghim
                                </Tag>
                            )}
                        </div>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Danh mục:</span>{' '}
                            {detail.categoryName || '-'}
                        </div>
                        <div>
                            <span className="font-medium">Công khai:</span>{' '}
                            {detail.isPublic ? 'Có' : 'Không'}
                        </div>
                        <div>
                            <span className="font-medium">Ngày tạo:</span>{' '}
                            {detail.createdAtUtc
                                ? format(
                                      new Date(detail.createdAtUtc),
                                      'dd/MM/yyyy HH:mm',
                                  )
                                : '-'}
                        </div>
                        <div>
                            <span className="font-medium">Ngày xuất bản:</span>{' '}
                            {detail.publishedAt
                                ? format(
                                      new Date(detail.publishedAt),
                                      'dd/MM/yyyy HH:mm',
                                  )
                                : '-'}
                        </div>
                        {detail.expiresAt && (
                            <div>
                                <span className="font-medium">Hết hạn:</span>{' '}
                                {format(
                                    new Date(detail.expiresAt),
                                    'dd/MM/yyyy HH:mm',
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tóm tắt */}
                    {detail.summary && (
                        <div>
                            <h4 className="font-medium mb-2">Tóm tắt</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {detail.summary}
                            </p>
                        </div>
                    )}

                    {/* Nội dung */}
                    <div>
                        <h4 className="font-medium mb-2">Nội dung</h4>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: detail.content || '',
                            }}
                        />
                    </div>

                    {/* File đính kèm */}
                    {detail.attachments && detail.attachments.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3">
                                File đính kèm ({detail.attachments.length})
                            </h4>
                            <div className="space-y-3">
                                {detail.attachments.map((file, index) => (
                                    <a
                                        key={file.id || index}
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-primary-600 truncate">
                                                {file.originalFileName ||
                                                    `File ${index + 1}`}
                                            </p>
                                            {file.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {file.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                {file.contentType} •{' '}
                                                {(file.fileSize / 1024).toFixed(
                                                    1,
                                                )}{' '}
                                                KB
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">
                    Không tải được chi tiết thông báo.
                </p>
            )}
        </Drawer>
    )
}
