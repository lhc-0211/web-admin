import { Notification, toast } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Skeleton } from '@/components/ui/Skeleton'
import {
    apiDeleteAllOrphanedFilesAdmin,
    apiGetFilesOrphanedAdmin,
} from '@/services/FileService'
import { useEffect, useState } from 'react'
import { HiRefresh, HiTrash } from 'react-icons/hi'
import { HiMiniExclamationTriangle } from 'react-icons/hi2'
import useFiles from '../hooks/useFiles'

const OrphanedFilesCard = () => {
    const {
        mutate, // Để refetch sau khi xóa/sửa
    } = useFiles()

    const [loading, setLoading] = useState(true)
    const [orphanedFiles, setOrphanedFiles] = useState([])

    // State cho modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const fetchOrphaned = async () => {
        try {
            setLoading(true)
            const response = await apiGetFilesOrphanedAdmin()
            setOrphanedFiles(response.items || response || [])
        } catch (error) {
            console.error('Lỗi tải orphaned files:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Không thể tải danh sách file không sử dụng
                </Notification>,
            )
            setOrphanedFiles([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrphaned()
    }, [])

    const openDeleteModal = () => setDeleteModalOpen(true)
    const closeDeleteModal = () => setDeleteModalOpen(false)

    const handleDeleteAll = async () => {
        setDeleting(true)
        try {
            await apiDeleteAllOrphanedFilesAdmin()
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa tất cả {orphanedFiles.length} file không sử dụng!
                </Notification>,
            )
            closeDeleteModal()
            fetchOrphaned() // refresh danh sách
            mutate()
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa file không sử dụng thất bại!
                </Notification>,
            )
        } finally {
            setDeleting(false)
        }
    }

    // Loading
    if (loading) {
        return (
            <Card className="p-6">
                <Skeleton height={120} />
            </Card>
        )
    }

    // Không có file orphaned → ẩn hoàn toàn
    if (!orphanedFiles || orphanedFiles.length === 0) {
        return null
    }

    return (
        <>
            <Card className="p-6 border-l-4 border-orange-500 bg-orange-50 shadow-lg">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <HiMiniExclamationTriangle className="w-10 h-10 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-900">
                                Phát hiện {orphanedFiles.length} file không được
                                sử dụng
                            </h3>
                            <p className="text-sm text-orange-800 mt-1">
                                Các file này tồn tại trên server nhưng không
                                liên kết với bản ghi nào trong database. Nên dọn
                                dẹp để tiết kiệm dung lượng.
                            </p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="twoTone"
                        color="orange-600"
                        icon={<HiRefresh />}
                        onClick={fetchOrphaned}
                        disabled={loading}
                    >
                        Làm mới
                    </Button>
                </div>

                {/* Danh sách file */}
                <div className="bg-white rounded-xl p-5 shadow-sm max-h-64 overflow-y-auto mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        Danh sách file ({orphanedFiles.length} file):
                    </p>
                    <ul className="space-y-2 text-sm">
                        {orphanedFiles.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                            >
                                <span className="text-gray-800 truncate max-w-lg">
                                    {file.originalFileName ||
                                        file.fileName ||
                                        file.path ||
                                        'Unknown file'}
                                </span>
                                <span className="text-gray-500 text-xs ml-4">
                                    {((file.size || 0) / 1024 / 1024).toFixed(
                                        2,
                                    )}{' '}
                                    MB
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nút xóa */}
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        color="red-600"
                        size="lg"
                        icon={<HiTrash />}
                        onClick={openDeleteModal}
                        disabled={deleting}
                    >
                        Xóa tất cả file không sử dụng
                    </Button>
                </div>
            </Card>

            {/* Modal xác nhận xóa - giống hệt modal xóa file khác */}
            <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={550}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <HiMiniExclamationTriangle className="h-12 w-12 text-red-600" />
                    </div>
                    <h5 className="text-2xl font-bold text-gray-900 mb-4">
                        Xác nhận xóa tất cả file không sử dụng
                    </h5>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn sắp xóa{' '}
                        <strong className="text-red-700">
                            {orphanedFiles.length}
                        </strong>{' '}
                        file không được liên kết với bất kỳ bản ghi nào.
                        <br />
                        <span className="block mt-4 text-sm font-medium text-red-600">
                            Hành động này không thể hoàn tác!
                        </span>
                    </p>
                    <div className="flex justify-center gap-6">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                            className="px-8"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            size="lg"
                            onClick={handleDeleteAll}
                            loading={deleting}
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

export default OrphanedFilesCard
