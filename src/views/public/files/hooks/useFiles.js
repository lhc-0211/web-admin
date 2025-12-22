import { apiGetFilesPublic } from '@/services/FileService'
import React from 'react'
import useSWR from 'swr'
import { useFilesStore } from '../store/useFilesStore'

export default function useFiles() {
    const { tableData, filterData, setTableData, setFilterData } =
        useFilesStore((state) => state)

    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        if (filterData.Search?.trim()) {
            p.SearchTerm = filterData.Search.trim()
        }

        if (filterData.Category) {
            p.Category = filterData.Category
        }

        if (filterData.UploadedById) {
            p.UploadedById = filterData.UploadedById
        }

        if (
            filterData.IsOrphaned !== undefined &&
            filterData.IsOrphaned !== ''
        ) {
            p.IsOrphaned = filterData.IsOrphaned
        }

        if (filterData.FromDate) {
            p.FromDate = filterData.FromDate
        }

        if (filterData.ToDate) {
            p.ToDate = filterData.ToDate
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.Category,
        filterData.UploadedById,
        filterData.IsOrphaned,
        filterData.FromDate,
        filterData.ToDate,
    ])

    const swrKey = React.useMemo(() => {
        if (Object.keys(params).length === 2) {
            return '/api/files/my-files'
        }
        return ['/api/files/my-files', params]
    }, [params])

    // Gọi API bằng SWR
    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        (key) => {
            if (typeof key === 'string') {
                return apiGetFilesPublic()
            }
            return apiGetFilesPublic(key[1])
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
    const files = data?.items || []
    const totalItems = data?.totalItems || 0

    return {
        files,
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
