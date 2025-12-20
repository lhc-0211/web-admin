import { apiGetWaterwaysAdmin } from '@/services/ViolationsService'
import useSWR from 'swr'

export default function useAllWaterways() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/waterways', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetWaterwaysAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const waterways = data?.items || data || []

    return {
        waterways,
        isLoading,
        error,
        mutate,
    }
}
