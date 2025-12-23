import { Notification, toast } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { apiGetRelatedNews } from '@/services/NewsService'
import { useEffect, useState } from 'react'
import { HiExclamationTriangle } from 'react-icons/hi2'

const RelatedNewsModal = ({ isOpen, onClose, newsId, newsTitle }) => {
    const [relatedNews, setRelatedNews] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !newsId) {
            setRelatedNews([])
            return
        }

        const fetchRelatedNews = async () => {
            setLoading(true)
            try {
                const response = await apiGetRelatedNews(newsId, {
                    limit: 99,
                })
                setRelatedNews(response || [])
            } catch (error) {
                console.error('Lỗi lấy tin liên quan:', error)
                toast.push(
                    <Notification title="Lỗi" type="danger">
                        Không thể tải tin liên quan!
                    </Notification>,
                )
                setRelatedNews([])
            } finally {
                setLoading(false)
            }
        }

        fetchRelatedNews()
    }, [isOpen, newsId])

    const handleClose = () => {
        setRelatedNews([])
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="p-6">
                <h5 className="text-xl font-bold mb-6">
                    Tin liên quan đến:{' '}
                    <span className="text-blue-600 font-semibold">
                        "{newsTitle}"
                    </span>
                </h5>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Đang tải tin liên quan...
                        </p>
                    </div>
                ) : relatedNews.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <HiExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-lg text-gray-600">
                            Không có tin liên quan nào.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {relatedNews.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-5 p-5 border rounded-lg hover:bg-gray-50 transition-shadow hover:shadow-md"
                            >
                                {item.featuredImageUrl ? (
                                    <img
                                        src={item.featuredImageUrl}
                                        alt={item.title}
                                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) =>
                                            (e.currentTarget.src =
                                                '/img/placeholder.jpg')
                                        } // fallback nếu lỗi ảnh
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-gray-400 text-sm text-center px-2">
                                            Không có ảnh
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h6 className="font-semibold text-lg text-blue-700 hover:underline line-clamp-2">
                                        {item.title}
                                    </h6>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                        {item.summary || 'Không có tóm tắt'}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                                        <span>
                                            <strong>Danh mục:</strong>{' '}
                                            {item.categoryName || 'Chưa có'}
                                        </span>
                                        <span>
                                            <strong>Trạng thái:</strong>{' '}
                                            {item.status === 'Published'
                                                ? 'Đã đăng'
                                                : 'Nháp'}
                                        </span>
                                        <span>
                                            <strong>Ngày đăng:</strong>{' '}
                                            {item.publishedAt
                                                ? new Date(
                                                      item.publishedAt,
                                                  ).toLocaleDateString('vi-VN')
                                                : 'Chưa đăng'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Dialog>
    )
}

export default RelatedNewsModal
