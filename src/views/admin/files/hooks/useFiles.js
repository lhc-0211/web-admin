import { apiGetNewsAdmin } from '@/services/News'
import React from 'react'
import useSWR from 'swr'
import { useFilesStore } from '../store/useFilesStore'
import { apiGetFilesAdmin } from '@/services/FileService'

export default function useFiles() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useFilesStore((state) => state)

    // Tạo params gửi lên API
    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Thêm các filter nếu có giá trị
        if (filterData.Search?.trim()) p.SearchTerm = filterData.Search.trim()
        if (filterData.CategoryId?.trim())
            p.CategoryId = filterData.CategoryId.trim()
        if (filterData.Priority) p.Priority = filterData.Priority
        if (filterData.Status) p.Status = filterData.Status

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.CategoryId,
        filterData.Priority,
        filterData.Status,
    ])

    const swrKey = React.useMemo(() => {
        return ['/api/admin/files', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetFilesAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API files:', err)
            },
        },
    )

    // Dữ liệu từ API
    const files = data?.items || [] // Mảng thông báo
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        files, // Danh sách thông báo (dùng để render bảng)
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
