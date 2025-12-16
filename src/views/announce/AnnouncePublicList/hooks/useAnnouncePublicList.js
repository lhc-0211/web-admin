import { apiGetPublicAnnouncements } from '@/services/AnnounceService'
import React from 'react'
import useSWR from 'swr'
import { useAnnouncePublicListStore } from '../store/useAnnouncePublicListStore'

export default function useAnnouncePublicList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useAnnouncePublicListStore((state) => state)

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
        ['/api/announcements/public', params],
        ([_, p]) => apiGetPublicAnnouncements(p),
        { revalidateOnFocus: false },
    )

    return {
        announcePublicList: data?.items || [],
        announcePublicListTotal: data?.totalItems || 0,
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
