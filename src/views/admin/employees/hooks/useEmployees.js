import { apiGetEmployeesAdmin } from '@/services/EmployeesService'
import React from 'react'
import useSWR from 'swr'
import { usePositionsStore } from '../store/useEmployeesStore'

export default function useEmployees() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = usePositionsStore((state) => state)

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
        return ['/api/admin/employees', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetEmployeesAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API employees:', err)
            },
        },
    )

    // Dữ liệu từ API
    const employees = data || [] // Mảng loại chức vụ
    const totalItems = data?.length || 0 // Tổng số bản ghi

    return {
        employees, // Danh sách loại chức vụ (dùng để render bảng)
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
