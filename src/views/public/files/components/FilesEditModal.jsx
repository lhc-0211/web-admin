import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiUpdateFilePublic } from '@/services/FileService'
import { useCallback, useEffect, useState } from 'react'

const categoryOptions = [
    { label: 'Image', value: 'Image' },
    { label: 'Document', value: 'Document' },
    { label: 'Video', value: 'Video' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Archive', value: 'Archive' },
    { label: 'Other', value: 'Other' },
]

const FilesEditModal = ({ isOpen, onClose, file, onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [altText, setAltText] = useState('')
    const [category, setCategory] = useState('Image')

    // Khi modal mở và có file → điền dữ liệu hiện tại
    useEffect(() => {
        if (file) {
            setDescription(file.description || '')
            setAltText(file.altText || '')
            setCategory(file.category || 'Image')
        }
    }, [file])

    const handleClose = useCallback(() => {
        setDescription('')
        setAltText('')
        setCategory('Image')
        onClose()
    }, [onClose])

    const handleSave = async () => {
        if (!file?.id) return

        setLoading(true)
        try {
            const payload = {
                id: file.id,
                description,
                altText,
                category,
            }

            await apiUpdateFilePublic(file.id, payload)

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã cập nhật thông tin file thành công!
                </Notification>,
            )

            onSuccess?.() // Gọi callback để refetch danh sách (mutate trong SWR)
            handleClose()
        } catch (error) {
            console.error('Update error:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thông tin file thất bại! Vui lòng thử lại.
                </Notification>,
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={600}>
            <div className="p-6 space-y-6">
                <h5 className="text-xl font-bold">Chỉnh sửa thông tin file</h5>

                <div className="space-y-5">
                    {/* Tên file gốc - chỉ hiển thị, không edit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên file
                        </label>
                        <Input value={file?.originalFileName || ''} disabled />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả (tùy chọn)
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả cho file"
                            disabled={loading}
                        />
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alt Text (văn bản thay thế cho hình ảnh, tùy chọn)
                        </label>
                        <Input
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Nhập alt text"
                            disabled={loading}
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={categoryOptions}
                            value={categoryOptions.find(
                                (opt) => opt.value === category,
                            )}
                            onChange={(option) =>
                                setCategory(option?.value || 'Image')
                            }
                            placeholder="Chọn danh mục"
                            isDisabled={true}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        variant="default"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        color="blue-600"
                        onClick={handleSave}
                        loading={loading}
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default FilesEditModal
