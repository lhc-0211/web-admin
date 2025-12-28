import { apiGetScheduleStypeAdmin } from '@/services/ScheduleService'
import useSWR from 'swr'

export default function useAllSchedulesTypes() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/schedules-types', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetScheduleStypeAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const schedulesTypes = data?.items || data || []
    return { schedulesTypes, isLoading, error, mutate }
}
