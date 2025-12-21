import { apiGetNewsTagsAdmin } from '@/services/NewsService'
import useSWR from 'swr'

export default function useAllTags() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/news/tags', { page: 1, pageSize: 99 }], // ← Key khác: /news/tags
        ([_, params]) => apiGetNewsTagsAdmin(params), // ← API riêng cho tags
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const tags = data?.items || data || []
    return { tags, isLoading, error, mutate }
}
