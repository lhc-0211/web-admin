import { apiGetDocumentsSearch } from '@/services/DocumentsService'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export default function useDocumentsSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 20

    const params = useMemo(
        () => ({
            query: searchQuery.trim(),
            page: pageIndex + 1,
            pageSize,
        }),
        [searchQuery, pageIndex],
    )

    const shouldFetch = searchQuery.trim().length > 0

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ['/api/documents/search', params] : null,
        ([_, p]) => apiGetDocumentsSearch(p),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        },
    )

    const documents = data?.items || []
    const total = data?.total || 0

    return {
        documents,
        total,
        isLoading,
        searchQuery,
        setSearchQuery,
        pageIndex,
        setPageIndex,
        mutate,
    }
}
