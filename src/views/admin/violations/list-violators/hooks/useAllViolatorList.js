// hooks/useAllViolatorList.js
import { apiGetViolatorAdmin } from '@/services/ViolationsService'
import useSWR from 'swr'

export default function useAllViolatorList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/violators', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetViolatorAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const violators = data?.items || data || []

    return {
        violators,
        isLoading,
        error,
        mutate,
    }
}
