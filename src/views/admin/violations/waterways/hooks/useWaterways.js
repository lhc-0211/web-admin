import { apiGetWaterwaysAdmin } from '@/services/ViolationsService'
import React from 'react'
import useSWR from 'swr'
import { useWaterwaysStore } from '../store/useWaterwaysStore'

export default function useWaterways() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useWaterwaysStore((state) => state)

    const params = React.useMemo(() => {
        const p = {
            Page: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Chỉ thêm nếu có giá trị (tránh gửi undefined)
        if (filterData.Search) p.Search = filterData.Search

        return p
    }, [tableData.pageIndex, tableData.pageSize, filterData.Search])

    const { data, error, isLoading, mutate } = useSWR(
        params ? ['/api/admin/waterways', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiGetWaterwaysAdmin()
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API violations:', err)
            },
        },
    )

    return {
        waterways: data?.items || [],
        waterwaysTotal: data?.totalItems || 0,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    }
}
