import { apiGetDepartmentsAdmin } from '@/services/User'
import React from 'react'
import useSWR from 'swr'
import { useDepartmentsStore } from '../store/useDepartmentsStore'

export default function useDepartments() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useDepartmentsStore((state) => state)

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
        params ? ['/api/admin/departments', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiGetDepartmentsAdmin()
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
        departments: data || [],
        departmentsTotal: data?.length || 0,
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
