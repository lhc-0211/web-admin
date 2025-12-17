import { apiGetDepartmentsAdmin } from '@/services/User'
import React from 'react'
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 50

const getKey = (pageIndex, previousPageData) => {
    if (pageIndex === 0) return { page: 1, pageSize: PAGE_SIZE }

    if (!previousPageData || previousPageData.length === 0) return null

    if (previousPageData.length < PAGE_SIZE) return null

    // Tiếp tục load trang tiếp theo
    return { page: pageIndex + 1, pageSize: PAGE_SIZE }
}

const fetcher = (key) => apiGetDepartmentsAdmin(key)

export default function useAllDepartments() {
    const { data, error, size, setSize, isLoading } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const departments = data ? data.flat() : []

    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')

    const lastPage = data?.[data.length - 1]
    const isReachingEnd = lastPage && lastPage.length < PAGE_SIZE

    // Tự động load thêm trang nếu chưa hết
    React.useEffect(() => {
        if (!isLoadingMore && !isReachingEnd) {
            setSize(size + 1)
        }
    }, [isLoadingMore, isReachingEnd, size, setSize])

    return {
        departments,
        isLoading: isLoading || isLoadingMore,
        error,
    }
}
