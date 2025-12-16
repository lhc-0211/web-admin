import { apiGetViolationsAdmin } from '@/services/Violations'
import React from 'react'
import useSWR from 'swr'
import { useViolationsListStore } from '../store/useViolationsListStore'

export default function useViolationsList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useViolationsListStore((state) => state)

    const params = React.useMemo(() => {
        const p = {
            Page: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Chỉ thêm nếu có giá trị (tránh gửi undefined)
        if (filterData.Search) p.Search = filterData.Search
        if (filterData.WaterwayId) p.WaterwayId = filterData.WaterwayId
        if (filterData.ViolationTypeId)
            p.ViolationTypeId = filterData.ViolationTypeId
        if (filterData.ViolatorId) p.ViolatorId = filterData.ViolatorId
        if (filterData.AssignedToId) p.AssignedToId = filterData.AssignedToId
        if (filterData.HandledById) p.HandledById = filterData.HandledById
        if (filterData.Severity) p.Severity = filterData.Severity
        if (filterData.Status) p.Status = filterData.Status
        if (filterData.Side) p.Side = filterData.Side
        if (filterData.ViolationDateFrom)
            p.ViolationDateFrom = filterData.ViolationDateFrom
        if (filterData.ViolationDateTo)
            p.ViolationDateTo = filterData.ViolationDateTo

        if (tableData.sort?.key) {
            p.SortBy = `${tableData.sort.key},${tableData.sort.order === 'ascend' ? 'asc' : 'desc'}`
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort?.key,
        tableData.sort?.order,
        filterData.Search,
        filterData.WaterwayId,
        filterData.ViolationTypeId,
        filterData.ViolatorId,
        filterData.AssignedToId,
        filterData.HandledById,
        filterData.Severity,
        filterData.Status,
        filterData.Side,
        filterData.ViolationDateFrom,
        filterData.ViolationDateTo,
    ])

    const { data, error, isLoading, mutate } = useSWR(
        params ? ['/api/violations', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiGetViolationsAdmin(p)
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
        violations: data?.items || [],
        violationsTotal: data?.totalItems || 0,
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
