import { apiGetViolationTypesAdmin } from '@/services/Violations'
import React from 'react'
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 50

const getKey = (pageIndex, previousPageData) => {
    if (pageIndex === 0)
        return `violation-types-all?page=1&pageSize=${PAGE_SIZE}`

    if (!previousPageData) return null

    if (!previousPageData.items || previousPageData.items.length === 0)
        return null

    if (previousPageData.items.length < PAGE_SIZE) return null

    return `violation-types-all?page=${pageIndex + 1}&pageSize=${PAGE_SIZE}`
}

const fetcher = (key) => {
    const searchParams = key.split('?')[1]
    const params = Object.fromEntries(new URLSearchParams(searchParams))
    return apiGetViolationTypesAdmin(params)
}

export default function useAllViolationTypes() {
    const { data, error, size, setSize, isLoading } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
        },
    )

    const violationTypes = data ? data.flatMap((page) => page.items || []) : []

    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')

    const lastPage = data?.[data.length - 1]
    const isReachingEnd =
        lastPage && (!lastPage.items || lastPage.items.length < PAGE_SIZE)

    React.useEffect(() => {
        if (!isLoadingMore && !isReachingEnd) {
            setSize(size + 1)
        }
    }, [isLoadingMore, isReachingEnd, size, setSize])

    return {
        violationTypes,
        isLoading: isLoading || isLoadingMore,
        error,
    }
}
