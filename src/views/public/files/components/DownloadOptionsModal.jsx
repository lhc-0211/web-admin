import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
    apiGetFilesDownloadAdmin,
    apiGetFilesDownloadPublic,
} from '@/services/FileService'
import { useState } from 'react'
import {
    FiArchive,
    FiFile,
    FiFilm,
    FiImage,
    FiMusic,
    FiPaperclip,
} from 'react-icons/fi'

const formatOptions = [
    { label: 'Giữ nguyên', value: '' },
    { label: 'JPEG', value: 'jpeg' },
    { label: 'PNG', value: 'png' },
    { label: 'WebP', value: 'webp' },
]

const DownloadOptionsModal = ({ file, onClose }) => {
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [quality, setQuality] = useState('90')
    const [format, setFormat] = useState('')

    if (!file) return null

    const isImage = file.contentType?.startsWith('image/')

    const handleDownload = () => {
        const params = {}
        if (isImage) {
            if (width) params.width = parseInt(width)
            if (height) params.height = parseInt(height)
            if (quality && quality !== '90') params.quality = parseInt(quality)
            if (format) params.format = format
        }

        const downloadUrl = apiGetFilesDownloadAdmin(file.id, params)

        // Tạo link tạm và click để tải
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.originalFileName // Gợi ý tên file
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        onClose()
    }

    const handleDirectDownload = () => {
        const url = apiGetFilesDownloadPublic(file.id)
        const link = document.createElement('a')
        link.href = url
        link.download = file.originalFileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onClose()
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
        <div className="p-6 space-y-6">
            <h5 className="text-xl font-bold">Tải xuống file</h5>

            <div className="bg-gray-50 rounded-lg p-4 flex flex-row items-center gap-2">
                {getFileIcon(file.contentType)}
                <p className="text-sm font-medium text-gray-900 truncate">
                    {file.originalFileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{file.contentType}</p>
            </div>

            {isImage ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Bạn có thể tùy chỉnh kích thước, chất lượng và định dạng
                        ảnh trước khi tải.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chiều rộng (px)
                            </label>
                            <Input
                                type="number"
                                placeholder="Ví dụ: 800"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chiều cao (px)
                            </label>
                            <Input
                                type="number"
                                placeholder="Ví dụ: 600"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chất lượng (1-100)
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Định dạng xuất
                        </label>
                        <Select
                            options={formatOptions}
                            value={formatOptions.find(
                                (opt) => opt.value === format,
                            )}
                            onChange={(opt) => setFormat(opt?.value || '')}
                            placeholder="Chọn định dạng"
                        />
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-600">
                    File không phải ảnh, sẽ tải về bản gốc.
                </p>
            )}

            <div className="flex justify-end gap-4 mt-8">
                <Button variant="default" onClick={onClose}>
                    Hủy
                </Button>
                {isImage ? (
                    <>
                        <Button
                            variant="twoTone"
                            onClick={handleDirectDownload}
                        >
                            Tải bản gốc
                        </Button>
                        <Button
                            variant="solid"
                            color="green-600"
                            onClick={handleDownload}
                        >
                            Tải với tùy chỉnh
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="solid"
                        color="green-600"
                        onClick={handleDownload}
                    >
                        Tải xuống
                    </Button>
                )}
            </div>
        </div>
    )
}

export default DownloadOptionsModal
