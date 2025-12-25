import Drawer from '@/components/ui/Drawer'
import Tag from '@/components/ui/Tag'
import { apiGetPublicAnnouncementDetail } from '@/services/Announcements'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const priorityColor = {
    Low: 'bg-green-100 text-green-800',
    Normal: 'bg-blue-100 text-blue-800',
    High: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
}

const priorityLabel = {
    Low: 'Thấp',
    Normal: 'Bình thường',
    High: 'Cao',
    Critical: 'Cực kỳ',
}

export default function AnnouncementPublicDetailDrawer({
    isOpen,
    onClose,
    announcementId,
}) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !announcementId) {
            setDetail(null)
            return
        }

        const fetchDetail = async () => {
            setLoading(true)
            try {
                const response =
                    await apiGetPublicAnnouncementDetail(announcementId)
                setDetail(response)
            } catch (error) {
                console.error(
                    'Lỗi khi lấy chi tiết thông báo công khai:',
                    error,
                )
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
            width={650}
        >
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : detail ? (
                <div className="space-y-7 overflow-y-auto pb-6">
                    {/* Tag ghim + ưu tiên */}
                    <div className="flex flex-wrap gap-3">
                        {detail.isPinned && (
                            <Tag className="bg-purple-100 text-purple-800 font-medium">
                                Ghim đầu trang
                            </Tag>
                        )}
                        <Tag
                            className={
                                priorityColor[detail.priority] ||
                                priorityColor.Normal
                            }
                        >
                            {priorityLabel[detail.priority] || detail.priority}
                        </Tag>
                    </div>

                    {/* Tiêu đề */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {detail.title}
                    </h1>

                    {/* Thông tin ngày giờ */}
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>
                            <span className="font-medium">Ngày đăng:</span>{' '}
                            {detail.publishedAt
                                ? format(
                                      new Date(detail.publishedAt),
                                      'dd/MM/yyyy HH:mm',
                                  )
                                : 'Chưa xác định'}
                        </p>
                        {detail.expiresAt &&
                            new Date(detail.expiresAt) > new Date() && (
                                <p>
                                    <span className="font-medium">
                                        Hết hạn:
                                    </span>{' '}
                                    {format(
                                        new Date(detail.expiresAt),
                                        'dd/MM/yyyy HH:mm',
                                    )}
                                </p>
                            )}
                        {detail.categoryName && (
                            <p>
                                <span className="font-medium">Danh mục:</span>{' '}
                                <span className="text-primary-600">
                                    {detail.categoryName}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Tóm tắt */}
                    {detail.summary && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Tóm tắt
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {detail.summary}
                            </p>
                        </div>
                    )}

                    {/* Nội dung chính */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Nội dung chi tiết
                        </h3>
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: detail.content || '',
                            }}
                        />
                    </div>

                    {/* File đính kèm */}
                    {detail.attachments && detail.attachments.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Tài liệu đính kèm ({detail.attachments.length})
                            </h3>
                            <div className="grid gap-4">
                                {detail.attachments.map((file) => (
                                    <a
                                        key={file.id}
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 transition group"
                                    >
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                                            <span className="text-2xl">📄</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-primary-600 group-hover:underline truncate">
                                                {file.originalFileName}
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
                <div className="text-center py-10 text-gray-500">
                    Không tìm thấy thông báo hoặc thông báo không công khai.
                </div>
            )}
        </Drawer>
    )
}
