import { apiGetIssuingAuthoritiesAdmin } from '@/services/User'
import React from 'react'
import useSWR from 'swr'
import { useIssuingAuthoritiesStore } from '../store/useIssuingAuthoritiesStore'

export default function useIssuingAuthorities() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useIssuingAuthoritiesStore((state) => state)

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
        return ['/admin/issuing-authorities', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetIssuingAuthoritiesAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API issuingAuthorities:', err)
            },
        },
    )

    // Dữ liệu từ API
    const issuingAuthorities = data?.items || [] // Mảng cơ quan ban hành
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        issuingAuthorities, // Danh sách cơ quan ban hành (dùng để render bảng)
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
