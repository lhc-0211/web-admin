import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateFilePublic } from '@/services/FileService'
import { useCallback, useRef, useState } from 'react'
import {
    FiArchive,
    FiFile,
    FiFilm,
    FiImage,
    FiMusic,
    FiPaperclip,
    FiUploadCloud,
    FiX,
} from 'react-icons/fi'

const categoryOptions = [
    { label: 'Image', value: 'Image' },
    { label: 'Document', value: 'Document' },
    { label: 'Video', value: 'Video' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Archive', value: 'Archive' },
    { label: 'Other', value: 'Other' },
]

const FilesCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const [uploading, setUploading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [description, setDescription] = useState('')
    const [altText, setAltText] = useState('')
    const [category, setCategory] = useState('Image')

    const fileInputRef = useRef(null)

    const resetForm = useCallback(() => {
        setSelectedFiles([])
        setDescription('')
        setAltText('')
        setCategory('Image')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [])

    const handleClose = useCallback(() => {
        resetForm()
        onClose()
    }, [resetForm, onClose])

    const handleFileSelect = (e) => {
        if (e.target.files?.length) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.push(
                <Notification title="Cảnh báo" type="warning">
                    Vui lòng chọn ít nhất một file!
                </Notification>,
            )
            return
        }

        if (!category) {
            toast.push(
                <Notification title="Cảnh báo" type="warning">
                    Vui lòng chọn danh mục!
                </Notification>,
            )
            return
        }

        setUploading(true)

        try {
            const uploadPromises = selectedFiles.map(async (file) => {
                const formData = new FormData()
                formData.append('File', file)
                formData.append('Description', description)
                formData.append('AltText', altText)
                formData.append('Category', category)
                return apiCreateFilePublic(formData)
            })

            await Promise.all(uploadPromises)

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã tải lên thành công {selectedFiles.length} file!
                </Notification>,
            )

            onSuccess?.()
            handleClose()
        } catch (error) {
            console.error('Upload error:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tải lên file thất bại! Vui lòng thử lại.
                </Notification>,
            )
        } finally {
            setUploading(false)
        }
    }

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/'))
            return <FiImage className="w-8 h-8 text-blue-500" />
        if (mimeType.startsWith('video/'))
            return <FiFilm className="w-8 h-8 text-purple-500" />
        if (mimeType.startsWith('audio/'))
            return <FiMusic className="w-8 h-8 text-green-500" />
        if (
            mimeType.includes('zip') ||
            mimeType.includes('rar') ||
            mimeType.includes('7z')
        )
            return <FiArchive className="w-8 h-8 text-orange-500" />
        if (
            mimeType.includes('pdf') ||
            mimeType.includes('word') ||
            mimeType.includes('excel')
        )
            return <FiFile className="w-8 h-8 text-red-500" />
        return <FiPaperclip className="w-8 h-8 text-gray-500" />
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={650}>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[78vh]">
                <h5 className="text-xl font-bold mb-6">Tải lên file mới</h5>

                <div className="space-y-5">
                    <div>
                        {/* Danh sách file đã chọn */}
                        {selectedFiles.length > 0 ? (
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                    Đã chọn {selectedFiles.length} file:
                                </p>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {/* Icon theo loại file */}
                                                {getFileIcon(file.type)}

                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{' '}
                                                        MB
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Nút xóa file */}
                                            {!uploading && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedFiles(
                                                            selectedFiles.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            ),
                                                        )
                                                    }}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FiX className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center ${
                                    uploading
                                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                                }`}
                                onClick={() =>
                                    !uploading && fileInputRef.current?.click()
                                }
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (!uploading)
                                        e.currentTarget.classList.add(
                                            'border-blue-500',
                                            'bg-blue-50',
                                        )
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.currentTarget.classList.remove(
                                        'border-blue-500',
                                        'bg-blue-50',
                                    )
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.currentTarget.classList.remove(
                                        'border-blue-500',
                                        'bg-blue-50',
                                    )
                                    if (
                                        !uploading &&
                                        e.dataTransfer.files.length
                                    ) {
                                        setSelectedFiles(
                                            Array.from(e.dataTransfer.files),
                                        )
                                    }
                                }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <FiUploadCloud
                                        className={`w-12 h-12 ${uploading ? 'text-gray-400' : 'text-blue-500'}`}
                                    />

                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            {uploading
                                                ? 'Đang xử lý...'
                                                : 'Kéo thả file vào đây hoặc click để chọn'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Hỗ trợ hình ảnh, video, tài liệu, âm
                                            thanh,...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả (tùy chọn)
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả cho các file"
                            disabled={uploading}
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
                            disabled={uploading}
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
                            isDisabled={uploading}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        variant="default"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        color="blue-600"
                        onClick={handleUpload}
                        loading={uploading}
                        disabled={selectedFiles.length === 0 || uploading}
                    >
                        {uploading ? 'Đang tải lên...' : 'Tải lên'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default FilesCreateModal
