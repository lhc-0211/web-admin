import { apiGetAnnouncementsAdmin } from '@/services/Announcements'
import React from 'react'
import useSWR from 'swr'
import { useAnnouncementsStore } from '../store/useAnnouncementsStore'

export default function useAnnouncements() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useAnnouncementsStore((state) => state)

    // Tạo params gửi lên API
    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Thêm các filter nếu có giá trị
        if (filterData.Search?.trim()) p.SearchTerm = filterData.Search.trim()
        if (filterData.CategoryId?.trim())
            p.CategoryId = filterData.CategoryId.trim()
        if (filterData.Priority) p.Priority = filterData.Priority
        if (filterData.Status) p.Status = filterData.Status

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.CategoryId,
        filterData.Priority,
        filterData.Status,
    ])

    const swrKey = React.useMemo(() => {
        return ['/api/admin/announcements', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetAnnouncementsAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API announcements:', err)
            },
        },
    )

    // Dữ liệu từ API
    const announcements = data?.items || [] // Mảng thông báo
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    // Cập nhật total trong tableData để TanStack Table biết tổng số trang
    React.useEffect(() => {
        if (data && totalItems !== tableData.total) {
            setTableData((prev) => ({
                ...prev,
                total: totalItems,
            }))
        }
    }, [totalItems, data, setTableData, tableData.total])

    return {
        announcements, // Danh sách thông báo (dùng để render bảng)
        total: totalItems, // Tổng số bản ghi (cho pagination)
        error,
        isLoading,
        mutate, // Refetch thủ công nếu cần
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    }
}
