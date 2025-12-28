import { apiGetSchedulesPublic } from '@/services/ScheduleService'
import React from 'react'
import useSWR from 'swr'
import { useSchedulesStore } from '../store/useSchedulesStore'

export default function useSchedulesTypes() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedViolation,
        setSelectedViolation,
        setSelectAllViolation,
        setFilterData,
    } = useSchedulesStore((state) => state)

    // Tạo params gửi lên API
    const params = React.useMemo(() => {
        const p = {
            PageNumber: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Thêm các filter nếu có giá trị
        if (filterData.Search?.trim()) {
            p.SearchTerm = filterData.Search.trim()
        }
        if (filterData.ScheduleTypeId) {
            p.ScheduleTypeId = filterData.ScheduleTypeId
        }
        if (filterData.Status) {
            p.Status = filterData.Status
        }
        if (filterData.Priority) {
            p.Priority = filterData.Priority
        }
        if (filterData.CreatedById) {
            p.CreatedById = filterData.CreatedById
        }
        if (filterData.ParticipantId) {
            p.ParticipantId = filterData.ParticipantId
        }
        if (filterData.StartDateFrom) {
            p.StartDateFrom = filterData.StartDateFrom
        }
        if (filterData.StartDateTo) {
            p.StartDateTo = filterData.StartDateTo
        }
        if (filterData.EndDateFrom) {
            p.EndDateFrom = filterData.EndDateFrom
        }
        if (filterData.EndDateTo) {
            p.EndDateTo = filterData.EndDateTo
        }
        if (filterData.IsAllDay !== undefined && filterData.IsAllDay !== '') {
            p.IsAllDay = filterData.IsAllDay
        }
        if (filterData.IsPrivate !== undefined && filterData.IsPrivate !== '') {
            p.IsPrivate = filterData.IsPrivate
        }
        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        filterData.Search,
        filterData.ScheduleTypeId,
        filterData.Status,
        filterData.Priority,
        filterData.CreatedById,
        filterData.ParticipantId,
        filterData.StartDateFrom,
        filterData.StartDateTo,
        filterData.EndDateFrom,
        filterData.EndDateTo,
        filterData.IsAllDay,
        filterData.IsPrivate,
    ])

    const swrKey = React.useMemo(() => {
        return ['/api/schedules', params]
    }, [params])

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        ([_, p]) => apiGetSchedulesPublic(p), // Truyền params vào API
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API schedules:', err)
            },
        },
    )

    // Dữ liệu từ API
    const schedules = data?.items || [] // Mảng loại sự kine
    const totalItems = data?.totalItems || 0 // Tổng số bản ghi

    return {
        schedules, // Danh sách loại sự kine (dùng để render bảng)
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
