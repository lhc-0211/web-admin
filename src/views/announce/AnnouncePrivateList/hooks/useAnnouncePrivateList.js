import { apiGetAnnouncements } from '@/services/AnnounceService'
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
    const params = {
        Page: tableData.pageIndex,
        PageSize: tableData.pageSize,
        CategoryId: filterData.categoryId || undefined,
        Priority: filterData.priority || undefined,
        Status: filterData.status || undefined,
        Search: filterData.Search || undefined,
        SortBy: tableData.sort?.key ? tableData.sort : undefined,
    }

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/announcements', params],
        ([_, p]) => apiGetAnnouncements(p),
        { revalidateOnFocus: false },
    )

    return {
        customerList: data?.list || [],
        customerListTotal: data?.total || 0,
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
