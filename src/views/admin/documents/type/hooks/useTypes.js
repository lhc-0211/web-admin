import { apiGetDocumentTypesAdmin } from '@/services/DocumentsService'
import React from 'react'
import useSWR from 'swr'
import { useNewsCategoriesStore } from '../store/useNewsCategoriesStore'

export default function useCategories() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useNewsCategoriesStore((state) => state)

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
        return ['/api/admin/document-types', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetDocumentTypesAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API types:', err)
            },
        },
    )

    // Dữ liệu từ API
    const types = data?.items || [] // Mảng loại thông báo
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        types, // Danh sách loại thông báo (dùng để render bảng)
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
