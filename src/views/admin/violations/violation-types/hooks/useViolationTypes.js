import { apiGetViolationTypesAdmin } from '@/services/Violations'
import React from 'react'
import useSWR from 'swr'
import { useViolationTypesStore } from '../store/useViolationTypesStore'

export default function useViolationTypes() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useViolationTypesStore((state) => state)

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
        params ? ['/api/admin/violation-types', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiGetViolationTypesAdmin(p)
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
        violationTypes: data?.items || [],
        violationTypesTotal: data?.totalItems || 0,
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
