import { apiGetViolatorAdmin } from '@/services/ViolationsService'
import React from 'react'
import useSWR from 'swr'
import { useViolatorsListStore } from '../store/useViolatorsListStore'

export default function useViolatorList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useViolatorsListStore((state) => state)

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
        params ? ['/api/admin/violators', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiGetViolatorAdmin(p)
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
        violators: data?.items || [],
        violatorsTotal: data?.totalItems || 0,
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
