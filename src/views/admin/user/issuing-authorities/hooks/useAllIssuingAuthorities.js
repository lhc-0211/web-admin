import { apiGetIssuingAuthoritiesAdmin } from '@/services/User'
import useSWR from 'swr'

export default function useAllIssuingAuthorities() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/issuing-authorities', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetIssuingAuthoritiesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const issuingAuthorities = data?.items || data || []
    return { issuingAuthorities, isLoading, error, mutate }
}
