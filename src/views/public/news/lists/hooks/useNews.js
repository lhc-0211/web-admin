import { apiGetNewsPublic } from '@/services/NewsService'
import React from 'react'
import useSWR from 'swr'
import { useNewsStore } from '../store/useNewsStore'

export default function useNews() {
    const { tableData, filterData, setTableData, setFilterData } = useNewsStore(
        (state) => state,
    )

    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        if (filterData.Search?.trim()) {
            p.SearchTerm = filterData.Search.trim()
        }

        if (filterData.CategoryId) {
            p.CategoryId = filterData.CategoryId
        }

        if (filterData.TagIds) {
            p.TagIds = filterData.TagIds
        }

        if (filterData.Status) {
            p.Status = filterData.Status
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.CategoryId,
        filterData.TagIds,
        filterData.Status,
    ])

    const swrKey = React.useMemo(() => {
        return ['/api/news', params]
    }, [params])

    // Gọi API bằng SWR
    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        (key) => {
            if (typeof key === 'string') {
                return apiGetNewsPublic()
            }
            return apiGetNewsPublic(key[1])
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            keepPreviousData: true, // Giữ data cũ khi đang load trang mới
            onError: (err) => {
                console.error('Lỗi khi tải danh sách file:', err)
            },
        },
    )

    // Xử lý dữ liệu trả về
    const news = data?.items || []
    const totalItems = data?.totalItems || 0

    return {
        news,
        total: totalItems,
        isLoading,
        error,
        mutate,
        tableData,
        filterData,
        setTableData,
        setFilterData,
    }
}
