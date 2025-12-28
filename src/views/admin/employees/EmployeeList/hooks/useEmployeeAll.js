import { apiListAllEmployee } from '@/services/AdminEmployees'
import useSWR from 'swr'

export default function useEmployeeAll() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/employees', { page: 1, pageSize: 99 }],
        ([_, params]) => apiListAllEmployee(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const users = data?.items || data || []
    return { users, isLoading, error, mutate }
}
