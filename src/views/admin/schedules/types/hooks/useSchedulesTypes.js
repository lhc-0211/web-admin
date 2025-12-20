import { apiGetScheduleStypeAdmin } from '@/services/ScheduleService'
import React from 'react'
import useSWR from 'swr'
import { usePositionsStore } from '../store/usePositionsStore'

export default function useSchedulesTypes() {
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
        return ['/api/admin/schedules-types', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetScheduleStypeAdmin(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API schedules-types:', err)
            },
        },
    )

    // Dữ liệu từ API
    const schedulesTypes = data?.items || [] // Mảng loại sự kine
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        schedulesTypes, // Danh sách loại sự kine (dùng để render bảng)
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
