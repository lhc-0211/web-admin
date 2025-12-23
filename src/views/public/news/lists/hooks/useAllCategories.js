import { apiGetNewsCategoriesPublic } from '@/services/NewsService'
import useSWR from 'swr'

export default function useAllCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/news/categories/dropdown'],
        ([_, params]) => apiGetNewsCategoriesPublic(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const categories = data?.items || data || []
    return { categories, isLoading, error, mutate }
}
