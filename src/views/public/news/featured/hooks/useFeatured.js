import { apiGetFeaturedNews } from '@/services/NewsService'
import React from 'react'
import useSWR from 'swr'

export const useFeaturedStore = (selector) => {
    const [state, setState] = React.useState({
        tableData: { pageIndex: 0, pageSize: 10 },
        setTableData: (updater) =>
            setState((prev) => ({
                ...prev,
                tableData:
                    typeof updater === 'function'
                        ? updater(prev.tableData)
                        : updater,
            })),
    })
    return selector(state)
}

export default function useFeatured() {
    const { tableData, setTableData } = useFeaturedStore((state) => ({
        tableData: state.tableData,
        setTableData: state.setTableData,
    }))

    const params = React.useMemo(() => {
        return {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }
    }, [tableData.pageIndex, tableData.pageSize])

    const swrKey = React.useMemo(() => {
        return ['/api/news/featured', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([url, queryParams]) => apiGetFeaturedNews(queryParams),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            keepPreviousData: true, // Giữ data cũ khi chuyển trang
            onError: (err) => {
                console.error('Lỗi khi tải danh sách tin nổi bật:', err)
            },
        },
    )

    // Xử lý response
    const news = data?.items || []
    const total = data?.totalItems || 0

    return {
        news,
        total,
        tableData,
        isLoading,
        error,
        mutate,
        setTableData,
    }
}
