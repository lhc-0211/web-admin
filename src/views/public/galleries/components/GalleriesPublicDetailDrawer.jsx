import { Button, Drawer, Spinner } from '@/components/ui'
import { HiX } from 'react-icons/hi'
import useGalleryPublicDetail from '../hooks/useGalleryPublicDetail'

const GalleriesPublicDetailDrawer = ({ isOpen, onClose, gallerySlug }) => {
    const { gallery, items, loading, error } =
        useGalleryPublicDetail(gallerySlug)

    return (
        <Drawer isOpen={isOpen} onClose={onClose} width={800}>
            <div className="flex items-center justify-between p-4 border-b">
                <h5 className="text-lg font-semibold">
                    {gallery?.title || 'Chi tiết bộ sưu tập'}
                </h5>
                <Button
                    shape="circle"
                    variant="plain"
                    icon={<HiX />}
                    onClick={onClose}
                />
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner size="lg" />
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 py-10">
                        {error}
                    </div>
                )}

                {!loading && !error && gallery && (
                    <>
                        {/* Thông tin gallery */}
                        <div className="mb-8">
                            {gallery.thumbnailImageUrl && (
                                <img
                                    src={gallery.thumbnailImageUrl}
                                    alt={gallery.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <h3 className="text-2xl font-bold mb-2">
                                {gallery.title}
                            </h3>
                            {gallery.description && (
                                <p className="text-gray-600 mb-4">
                                    {gallery.description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span>
                                    Danh mục:{' '}
                                    <strong>{gallery.categoryName}</strong>
                                </span>
                                <span>
                                    Số lượng:{' '}
                                    <strong>{gallery.itemCount} mục</strong>
                                </span>
                                <span>
                                    Ngày đăng:{' '}
                                    <strong>
                                        {new Date(
                                            gallery.publishedAt,
                                        ).toLocaleDateString('vi-VN')}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* Grid items (ảnh hoặc tài liệu) */}
                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="relative group overflow-hidden rounded-lg border"
                                    >
                                        {item.imageUrl || item.url ? (
                                            <img
                                                src={item.imageUrl || item.url}
                                                alt={
                                                    item.title ||
                                                    `Item ${index + 1}`
                                                }
                                                className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">
                                                    Không có ảnh
                                                </span>
                                            </div>
                                        )}
                                        {item.title && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition">
                                                {item.title}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-10">
                                Bộ sưu tập này chưa có mục nào.
                            </p>
                        )}
                    </>
                )}
            </div>
        </Drawer>
    )
}

export default GalleriesPublicDetailDrawer
