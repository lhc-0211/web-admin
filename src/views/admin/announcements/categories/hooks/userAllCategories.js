import { apiGetAnnouncementCategoriesAdmin } from '@/services/Announcements'
import useSWR from 'swr'

const fetcher = (url) => apiGetAnnouncementCategoriesAdmin(url)

export default function useAllCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        { page: 1, pageSize: 99 },
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const categories = data?.items || data || []

    return {
        categories,
        isLoading,
        error,
        mutate, // Để refresh nếu cần
    }
}
