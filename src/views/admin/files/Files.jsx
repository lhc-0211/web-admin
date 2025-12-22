import { useState } from 'react'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import FilesStatsDashboard from './components/FilesStatsDashboard'
import FilesTable from './components/FilesTable'
import FilesTableTools from './components/FilesTableTools'
import OrphanedFilesCard from './components/OrphanedFilesCard'

export default function FilesPage() {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [showStats, setShowStats] = useState(false) // Mặc định mở

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Quản lý File</h1>
            </div>

            <OrphanedFilesCard />

            {/* Thống kê - Có thể thu gọn */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                    <h2 className="text-xl font-semibold text-gray-800">
                        Thống kê file
                    </h2>
                    {showStats ? (
                        <HiChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                        <HiChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                </button>

                {showStats && (
                    <div className="p-6 border-t border-gray-200">
                        <FilesStatsDashboard />
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Danh sách file</h2>
                <FilesTableTools />
                <FilesTable
                    uploadModalOpen={uploadModalOpen}
                    closeUploadModal={() => setUploadModalOpen(false)}
                />
            </div>

            {/* Các modal khác... */}
        </div>
    )
}
