import { apiGetGalleryCategoriesAdmin } from '@/services/GalleyService'
import useSWR from 'swr'

export default function useAllCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/gallery-categories', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetGalleryCategoriesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const categories = data?.items || data || []
    return { categories, isLoading, error, mutate }
}
