import { apiGetAnnouncementCategoriesDropdown } from '@/services/Announcements'
import useSWR from 'swr'

export function useAnnouncementCategories() {
    const { data, error, isLoading } = useSWR(
        '/api/announcements/categories/dropdown',
        apiGetAnnouncementCategoriesDropdown,
        { revalidateOnFocus: false },
    )

    const options =
        data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || []

    return { options, error, isLoading }
}
