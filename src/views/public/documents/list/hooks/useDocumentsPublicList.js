import {
    apiGetDocumentsPublic,
    apiGetDocumentsSearch,
} from '@/services/DocumentsService' // API list cũ
import useSWR from 'swr'
import { useDocumentsPublicListStore } from '../store/useDocumentsPublicListStore'

export default function useDocumentsPublicList() {
    const { tableData, filterData, setTableData, setFilterData } =
        useDocumentsPublicListStore()

    const hasSearchQuery = filterData.Search?.trim().length > 0

    const listParams = {
        PageNumber: tableData.pageIndex + 1,
        PageSize: tableData.pageSize,
        DocumentTypeId: filterData.DocumentTypeId,
        DocumentCategoryId: filterData.DocumentCategoryId,
        FieldIds: filterData.FieldIds,
        IssuingAuthorityId: filterData.IssuingAuthorityId,
        Status: filterData.Status,
        IssuedDateFrom: filterData.IssuedDateFrom,
        IssuedDateTo: filterData.IssuedDateTo,
        EffectiveDateFrom: filterData.EffectiveDateFrom,
        EffectiveDateTo: filterData.EffectiveDateTo,
        ExpiryDateFrom: filterData.ExpiryDateFrom,
        ExpiryDateTo: filterData.ExpiryDateTo,
        IsPublic: true, // luôn công khai
        IsPinned: filterData.IsPinned,
    }

    const searchParams = {
        query: filterData.Search,
        page: tableData.pageIndex + 1,
        pageSize: tableData.pageSize,
        isPublic: true,
    }

    const { data: searchData, isLoading: searchLoading } = useSWR(
        hasSearchQuery ? ['/api/documents/search', searchParams] : null,
        ([_, p]) => apiGetDocumentsSearch(p),
        { keepPreviousData: true },
    )

    const { data: listData, isLoading: listLoading } = useSWR(
        !hasSearchQuery ? ['/api/documents/public', listParams] : null,
        ([_, p]) => apiGetDocumentsPublic(p),
        { keepPreviousData: true },
    )

    const data = hasSearchQuery ? searchData : listData
    const documentsPublicList = data?.items || []
    const documentsPublicListTotal = data?.totalItems || data?.total || 0
    const isLoading = hasSearchQuery ? searchLoading : listLoading

    return {
        documentsPublicList,
        documentsPublicListTotal,
        isLoading,
        tableData,
        filterData,
        setTableData,
        setFilterData,
    }
}
