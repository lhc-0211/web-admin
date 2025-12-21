import { apiGetDocumentCategoriesAdmin } from '@/services/DocumentsService'
import useSWR from 'swr'

export default function useAllCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/document-categories', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetDocumentCategoriesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const categories = data?.items || data || []
    return { categories, isLoading, error, mutate }
}
