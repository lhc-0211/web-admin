import Drawer from '@/components/ui/Drawer'
import Tag from '@/components/ui/Tag'
import { apiGetDocumentPublic } from '@/services/DocumentsService'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const statusColor = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Expired: 'bg-red-100 text-red-800',
    Cancelled: 'bg-orange-100 text-orange-800',
    Draft: 'bg-blue-100 text-blue-800',
}

const statusLabel = {
    Active: 'Có hiệu lực',
    Expired: 'Đã hết hạn',
    Cancelled: 'Bị hủy bỏ',
    Draft: 'Nháp',
}

export default function DocumentPublicDetailDrawer({
    isOpen,
    onClose,
    documentSlug, // slug của văn bản
}) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !documentSlug) {
            setDetail(null)
            return
        }

        const fetchDetail = async () => {
            setLoading(true)
            try {
                const response = await apiGetDocumentPublic(announcementId)
                setDetail(response)
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết văn bản:', error)
                setDetail(null)
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [isOpen, documentSlug])

    if (!isOpen) return null

    return (
        <Drawer
            title="Chi tiết văn bản"
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={800} // Rộng hơn một chút để hiển thị thông tin đầy đủ
        >
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : detail ? (
                <div className="space-y-8 overflow-y-auto pb-6 max-h-[calc(100vh-120px)]">
                    {/* Tag trạng thái + ghim */}
                    <div className="flex flex-wrap gap-3">
                        {detail.isPinned && (
                            <Tag className="bg-purple-100 text-purple-800 font-medium">
                                Ghim đầu trang
                            </Tag>
                        )}
                        <Tag
                            className={
                                statusColor[detail.status] ||
                                statusColor.Inactive
                            }
                        >
                            {statusLabel[detail.status] || detail.status}
                        </Tag>
                        {detail.isPublic && (
                            <Tag className="bg-blue-100 text-blue-800">
                                Công khai
                            </Tag>
                        )}
                    </div>

                    {/* Số hiệu văn bản - Tiêu đề chính */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {detail.documentNumber || 'Không có số hiệu'}
                    </h1>

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">
                                Loại văn bản:
                            </span>{' '}
                            <span className="text-primary-600">
                                {detail.documentType?.name || '-'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Lĩnh vực:
                            </span>{' '}
                            <span className="text-primary-600">
                                {detail.documentCategory?.name || '-'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Cơ quan ban hành:
                            </span>{' '}
                            <span className="text-primary-600">
                                {detail.issuingAuthority?.name || '-'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Người ký:
                            </span>{' '}
                            <span>{detail.signerName || '-'}</span>
                            {detail.signerTitle && (
                                <span className="text-gray-600 ml-1">
                                    ({detail.signerTitle})
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Ngày ban hành:
                            </span>{' '}
                            <span>
                                {detail.issuedDate
                                    ? format(
                                          new Date(detail.issuedDate),
                                          'dd/MM/yyyy',
                                      )
                                    : '-'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Ngày hiệu lực:
                            </span>{' '}
                            <span>
                                {detail.effectiveDate
                                    ? format(
                                          new Date(detail.effectiveDate),
                                          'dd/MM/yyyy',
                                      )
                                    : '-'}
                            </span>
                        </div>
                        {detail.expiryDate && (
                            <div>
                                <span className="font-medium text-gray-700">
                                    Ngày hết hiệu lực:
                                </span>{' '}
                                <span>
                                    {format(
                                        new Date(detail.expiryDate),
                                        'dd/MM/yyyy',
                                    )}
                                </span>
                            </div>
                        )}
                        <div>
                            <span className="font-medium text-gray-700">
                                Lượt xem:
                            </span>{' '}
                            <span className="font-semibold text-primary-600">
                                {detail.viewCount?.toLocaleString('vi-VN') || 0}{' '}
                                lượt
                            </span>
                        </div>
                    </div>

                    {/* Tóm tắt */}
                    {detail.summary && (
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Trích yếu / Tóm tắt
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {detail.summary}
                            </p>
                        </div>
                    )}

                    {/* Nội dung chi tiết */}
                    {detail.content && (
                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Nội dung chi tiết
                            </h3>
                            <div
                                className="prose prose-lg max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{
                                    __html: detail.content,
                                }}
                            />
                        </div>
                    )}

                    {/* File đính kèm */}
                    {detail.attachmentFiles &&
                        detail.attachmentFiles.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-4">
                                    File đính kèm (
                                    {detail.attachmentFiles.length})
                                </h3>
                                <div className="grid gap-4">
                                    {detail.attachmentFiles.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 transition group"
                                        >
                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                                                <span className="text-3xl">
                                                    📄
                                                </span>
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
                                                    {file.contentType || 'File'}{' '}
                                                    •{' '}
                                                    {(
                                                        file.fileSize / 1024
                                                    ).toFixed(1)}{' '}
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
                <div className="text-center py-16 text-gray-500">
                    Không tìm thấy văn bản hoặc văn bản không được công khai.
                </div>
            )}
        </Drawer>
    )
}
