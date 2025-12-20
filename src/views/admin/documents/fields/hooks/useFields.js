import { apiGetDocumentFieldsAdmin } from '@/services/DocumentsService'
import React from 'react'
import useSWR from 'swr'
import { useDocumentsFieldsStore } from '../store/useDocumentsFieldsStore'

export default function useFields() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useDocumentsFieldsStore((state) => state)

    // Tạo params gửi lên API
    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Thêm các filter nếu có giá trị
        if (filterData.Search?.trim()) p.SearchTerm = filterData.Search.trim()

        return p
    }, [tableData.pageIndex, tableData.pageSize, filterData.Search])

    const swrKey = React.useMemo(() => {
        return ['/api/admin/document-fields', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetDocumentFieldsAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API fields:', err)
            },
        },
    )

    // Dữ liệu từ API
    const fields = data?.items || [] // Mảng loại lĩnh vực
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        fields, // Danh sách loại lĩnh vực (dùng để render bảng)
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
