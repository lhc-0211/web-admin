import { apiGetDocumentsAdmin } from '@/services/DocumentsService'
import React from 'react'
import useSWR from 'swr'
import { useDocumentsStore } from '../store/useDocumentsStore'

export default function useDocuments() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useDocumentsStore((state) => state)

    // Tạo params gửi lên API
    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1, // API thường bắt đầu từ 1
            PageSize: tableData.pageSize,
        }

        // Các filter tìm kiếm và chọn đơn
        if (filterData.Search?.trim()) {
            p.SearchTerm = filterData.Search.trim()
        }
        if (filterData.DocumentTypeId) {
            p.DocumentTypeId = filterData.DocumentTypeId
        }
        if (filterData.DocumentCategoryId) {
            p.DocumentCategoryId = filterData.DocumentCategoryId
        }
        if (filterData.IssuingAuthorityId) {
            p.IssuingAuthorityId = filterData.IssuingAuthorityId
        }
        if (filterData.Status) {
            p.Status = filterData.Status
        }

        // Lĩnh vực: mảng ID (nếu có ít nhất 1)
        if (
            Array.isArray(filterData.FieldIds) &&
            filterData.FieldIds.length > 0
        ) {
            p.FieldIds = filterData.FieldIds
        }

        // Các khoảng ngày (ISO string)
        if (filterData.IssuedDateFrom) {
            p.IssuedDateFrom = filterData.IssuedDateFrom
        }
        if (filterData.IssuedDateTo) {
            p.IssuedDateTo = filterData.IssuedDateTo
        }
        if (filterData.EffectiveDateFrom) {
            p.EffectiveDateFrom = filterData.EffectiveDateFrom
        }
        if (filterData.EffectiveDateTo) {
            p.EffectiveDateTo = filterData.EffectiveDateTo
        }
        if (filterData.ExpiryDateFrom) {
            p.ExpiryDateFrom = filterData.ExpiryDateFrom
        }
        if (filterData.ExpiryDateTo) {
            p.ExpiryDateTo = filterData.ExpiryDateTo
        }

        // Boolean filters (true/false) – chỉ gửi khi có giá trị cụ thể
        if (filterData.IsPublic !== undefined && filterData.IsPublic !== '') {
            p.IsPublic = filterData.IsPublic // true hoặc false
        }
        if (filterData.IsPinned !== undefined && filterData.IsPinned !== '') {
            p.IsPinned = filterData.IsPinned
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.DocumentTypeId,
        filterData.DocumentCategoryId,
        filterData.FieldIds,
        filterData.IssuingAuthorityId,
        filterData.Status,
        filterData.IssuedDateFrom,
        filterData.IssuedDateTo,
        filterData.EffectiveDateFrom,
        filterData.EffectiveDateTo,
        filterData.ExpiryDateFrom,
        filterData.ExpiryDateTo,
        filterData.IsPublic,
        filterData.IsPinned,
    ])

    const swrKey = React.useMemo(() => {
        return ['/api/admin/documents', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetDocumentsAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API documents:', err)
            },
        },
    )

    // Dữ liệu từ API
    const documents = data?.items || [] // Mảng văn bản
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        documents, // Danh sách văn bản (dùng để render bảng)
        total: totalItems, // Tổng số bản ghi (cho pagination)
        error,
        isLoading,
        mutate, // Refetch thủ công nếu cần
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    }
}
