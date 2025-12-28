import { apiGetNewsAdmin } from '@/services/NewsService'
import React from 'react'
import useSWR from 'swr'
import { useNewsStore } from '../store/useNewsStore'

export default function useNews() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useNewsStore((state) => state)

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
        if (filterData.TagIds) p.TagIds = filterData.TagIds
        if (filterData.Status) p.Status = filterData.Status

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.CategoryId,
        filterData.TagIds,
        filterData.Status,
    ])

    const swrKey = params ? ['/api/admin/news', params] : null

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        swrKey ? ([_, p]) => apiGetNewsAdmin(p) : null,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API news:', err)
            },
        },
    )

    // Dữ liệu từ API
    const news = data?.items || [] // Mảng thông báo
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        news, // Danh sách thông báo (dùng để render bảng)
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
