import { apiGetViolationTypesAdmin } from '@/services/Violations'
import useSWR from 'swr'

export default function useAllViolationTypes() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/violation-types', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetViolationTypesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const violationTypes = data?.items || data || []

    return {
        violationTypes,
        isLoading,
        error,
        mutate,
    }
}
