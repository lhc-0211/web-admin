import { apiGetDocumentFieldsAdmin } from '@/services/DocumentsService'
import useSWR from 'swr'

export default function useAllFields() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/announcement-fields', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetDocumentFieldsAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const fields = data?.items || data || []
    return { fields, isLoading, error, mutate }
}
