import { apiGetGalleriesAdmin } from '@/services/GalleyService'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useGalleriesStore } from '../store/useGalleriesStore'

export default function useGalleries() {
    const { tableData, filterData, setTableData, setFilterData } =
        useGalleriesStore()

    // Tạo params đầy đủ dựa trên tableData và filterData
    const params = useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Thêm các filter nếu có giá trị
        if (filterData.Search?.trim()) {
            p.SearchTerm = filterData.Search.trim()
        }
        if (filterData.CategoryId) {
            p.CategoryId = filterData.CategoryId
        }
        if (filterData.Status) {
            p.Status = filterData.Status
        }
        if (filterData.IsPublic !== null && filterData.IsPublic !== undefined) {
            p.IsPublic = filterData.IsPublic
        }
        if (filterData.IsActive !== null && filterData.IsActive !== undefined) {
            p.IsActive = filterData.IsActive
        }
        if (filterData.IsPinned !== null && filterData.IsPinned !== undefined) {
            p.IsPinned = filterData.IsPinned
        }
        if (filterData.PublishedFrom) {
            p.PublishedFrom = filterData.PublishedFrom
        }
        if (filterData.PublishedTo) {
            p.PublishedTo = filterData.PublishedTo
        }
        if (filterData.SortDescending !== undefined) {
            p.SortDescending = filterData.SortDescending
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.CategoryId,
        filterData.Status,
        filterData.IsPublic,
        filterData.IsActive,
        filterData.IsPinned,
        filterData.PublishedFrom,
        filterData.PublishedTo,
        filterData.SortDescending,
    ])

    const swrKey = params ? ['/api/admin/galleries', params] : null

    const { data, error, isLoading, mutate, isValidating } = useSWR(
        swrKey,
        swrKey ? ([_, p]) => apiGetGalleriesAdmin(p) : null,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            keepPreviousData: true, // Giữ data cũ khi đang load trang mới → UX mượt
            onError: (err) => {
                console.error('Lỗi khi tải danh sách bộ sưu tập:', err)
            },
        },
    )

    // Dữ liệu trả về từ API
    const galleries = React.useMemo(() => data?.items || [], [data])
    const total = data?.totalItems || 0

    return {
        galleries,
        total,
        isLoading,
        isValidating,
        error,
        mutate, // Để refetch thủ công sau create/edit/delete
        tableData,
        filterData,
        setTableData,
        setFilterData,
    }
}
