import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { apiGetFilesStatisticsAdmin } from '@/services/FileService'
import { useEffect, useState } from 'react'
import {
    HiChevronDown,
    HiChevronUp,
    HiDocumentText,
    HiFilm,
    HiMusicNote,
    HiPhotograph,
    HiQuestionMarkCircle,
} from 'react-icons/hi'
import { HiArchiveBoxXMark } from 'react-icons/hi2'

const categoryIcons = {
    Image: <HiPhotograph className="w-5 h-5 text-blue-500" />,
    Document: <HiDocumentText className="w-5 h-5 text-red-500" />,
    Video: <HiFilm className="w-5 h-5 text-purple-500" />,
    Audio: <HiMusicNote className="w-5 h-5 text-green-500" />,
    Archive: <HiArchiveBoxXMark className="w-5 h-5 text-orange-500" />,
    Other: <HiQuestionMarkCircle className="w-5 h-5 text-gray-500" />,
}

const formatMonth = (key) => {
    if (!key || !key.includes('-')) return key
    const [year, month] = key.split('-')
    return `Tháng ${parseInt(month)}/${year}`
}

const FilesStatsDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    // State để toggle ẩn/hiện 2 phần
    const [showByCategory, setShowByCategory] = useState(true)
    const [showByMonth, setShowByMonth] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const response = await apiGetFilesStatisticsAdmin()
                setStats(response.data || response)
            } catch (error) {
                console.error('Lỗi tải thống kê:', error)
                setStats(null)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="p-6">
                            <Skeleton height={80} />
                        </Card>
                    ))}
                </div>
                <Card className="p-6">
                    <Skeleton height={200} />
                </Card>
            </div>
        )
    }

    if (!stats) {
        return (
            <Card className="p-8 text-center text-gray-500">
                Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
            </Card>
        )
    }

    const totalFiles = stats.totalFiles || 0
    const totalSizeMB = (stats.totalSizeInMB || 0).toFixed(1)

    return (
        <div className="space-y-8">
            {/* Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">
                                Tổng số file
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {totalFiles.toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <HiDocumentText className="w-12 h-12 opacity-90" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">
                                Tổng dung lượng
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {totalSizeMB} MB
                            </p>
                        </div>
                        <HiArchiveBoxXMark className="w-12 h-12 opacity-90" />
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">
                                Số danh mục
                            </p>
                            <p className="text-4xl font-bold mt-2">
                                {stats.byCategory?.length || 0}
                            </p>
                        </div>
                        <HiPhotograph className="w-12 h-12 opacity-90" />
                    </div>
                </Card>
            </div>

            {/* Phân bố theo danh mục - Có toggle */}
            <Card className="p-6 shadow-md">
                <button
                    onClick={() => setShowByCategory(!showByCategory)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 -mx-6 -mt-6 px-6 py-4 rounded-t-lg transition"
                >
                    <h3 className="text-lg font-semibold">
                        Phân bố theo danh mục
                    </h3>
                    {showByCategory ? (
                        <HiChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                        <HiChevronDown Down className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {showByCategory && (
                    <div className="mt-4 space-y-3 animate-fadeIn">
                        {stats.byCategory?.length > 0 ? (
                            stats.byCategory.map((cat) => (
                                <div
                                    key={cat.key}
                                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center space-x-3">
                                        {categoryIcons[cat.key] ||
                                            categoryIcons.Other}
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {cat.key}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {cat.count} file
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {(
                                            cat.totalSize / 1024 / 1024 || 0
                                        ).toFixed(1)}{' '}
                                        MB
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-6">
                                Chưa có file nào
                            </p>
                        )}
                    </div>
                )}
            </Card>

            {/* File tải lên theo tháng - Có toggle */}
            {stats.byMonth && stats.byMonth.length > 0 && (
                <Card className="p-6 shadow-md">
                    <button
                        onClick={() => setShowByMonth(!showByMonth)}
                        className="w-full flex items-center justify-between text-left hover:bg-gray-50 -mx-6 -mt-6 px-6 py-4 rounded-t-lg transition"
                    >
                        <h3 className="text-lg font-semibold">
                            File tải lên theo tháng (12 tháng gần nhất)
                        </h3>
                        {showByMonth ? (
                            <HiChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                            <HiChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {showByMonth && (
                        <div className="mt-4 space-y-3 animate-fadeIn">
                            {stats.byMonth
                                .slice(-12)
                                .reverse()
                                .map((month) => (
                                    <div
                                        key={month.key}
                                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <span className="text-sm font-medium text-gray-800">
                                            {formatMonth(month.key)}
                                        </span>
                                        <div className="flex items-center space-x-6 text-sm">
                                            <span className="text-gray-600">
                                                {month.count} file
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {(
                                                    month.totalSize /
                                                        1024 /
                                                        1024 || 0
                                                ).toFixed(1)}{' '}
                                                MB
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

export default FilesStatsDashboard
