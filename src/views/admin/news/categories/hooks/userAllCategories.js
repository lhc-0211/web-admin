import { apiGetNewsCategoriesAdmin } from '@/services/News'
import useSWR from 'swr'

export default function useAllCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/news/categories', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetNewsCategoriesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const categories = data?.items || data || []
    return { categories, isLoading, error, mutate }
}
