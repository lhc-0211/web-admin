import { apiGetAnnouncements } from '@/services/Announcements'
import React from 'react'
import useSWR from 'swr'
import { useAnnouncePrivateListStore } from '../store/useAnnouncePrivateListStore'

export default function useAnnouncePrivateList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useAnnouncePrivateListStore((state) => state)

    // Chỉ gửi param cần thiết
    const params = React.useMemo(
        () => ({
            Page: tableData.pageIndex,
            PageSize: tableData.pageSize,
            CategoryId: filterData.CategoryId || undefined,
            Priority: filterData.Priority || undefined,
            Status: filterData.Status || undefined,
            Search: filterData.Search || undefined,
            SortBy: tableData.sort?.key ? tableData.sort : undefined,
        }),
        [tableData.pageIndex, tableData.pageSize, tableData.sort, filterData],
    )

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/announcements', params],
        ([_, p]) => apiGetAnnouncements(p),
        { revalidateOnFocus: false },
    )

    return {
        announcePrivateLis: data?.items || [],
        announcePrivateLisTotal: data?.totalItems || 0,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}
