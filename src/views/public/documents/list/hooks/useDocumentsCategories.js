import { apiGetDocumentsCategoriesDropdown } from '@/services/DocumentsService'
import useSWR from 'swr'

export function useDocumentsCategories() {
    const { data, error, isLoading } = useSWR(
        '/api/documents/categories/dropdown',
        apiGetDocumentsCategoriesDropdown,
        { revalidateOnFocus: false },
    )

    const options =
        data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || []

    return { options, error, isLoading }
}
