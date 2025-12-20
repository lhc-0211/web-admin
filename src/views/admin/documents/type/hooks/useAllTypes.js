import { apiGetDocumentTypesAdmin } from '@/services/DocumentsService'
import useSWR from 'swr'

export default function useAllTypes() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/document-types', { page: 1, pageSize: 99 }],
        ([_, params]) => apiGetDocumentTypesAdmin(params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    const documentTypes = data?.items || data || []
    return { documentTypes, isLoading, error, mutate }
}
