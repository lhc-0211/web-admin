
import useSWR from 'swr'
import React from 'react'
import { useEmployeeListStore } from '../store/employeeListStore'
import { apiListAllEmployee } from '@/services/AdminEmployees'

export default function useEmployeeList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedEmployee,
        setSelectedEmployee,
        setSelectAllEmployee,
        setFilterData,
    } = useEmployeeListStore((state) => state)
    const params = React.useMemo(() => {
        const p = {
            pageNumber: tableData.pageIndex, // backend 1-based
            pageSize: tableData.pageSize,
        }
    
        // 🔍 Search
        if (tableData.search) {
            p.search = tableData.search
        }
    
        // 🎯 Filters
        if (filterData.departmentId) {
            p.departmentId = filterData.departmentId
        }
    
        if (filterData.positionId) {
            p.positionId = filterData.positionId
        }
    
        if (filterData.managerId) {
            p.managerId = filterData.managerId
        }
    
        if (filterData.employmentStatus) {
            p.employmentStatus = filterData.employmentStatus
        }
    
        // boolean cần check khác null
        if (filterData.isActive !== null) {
            p.isActive = filterData.isActive
        }
    
        if (filterData.fromJoinDate) {
            p.fromJoinDate = filterData.fromJoinDate
        }
    
        if (filterData.toJoinDate) {
            p.toJoinDate = filterData.toJoinDate
        }
    
        // 🔃 Sort
        if (tableData.sortBy && tableData.sortDirection) {
            p.sortBy = tableData.sortBy
            p.sortDirection = tableData.sortDirection
        }
    
        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.search,
        tableData.sortBy,
        tableData.sortDirection,
    
        filterData.departmentId,
        filterData.positionId,
        filterData.managerId,
        filterData.employmentStatus,
        filterData.isActive,
        filterData.fromJoinDate,
        filterData.toJoinDate,
    ])
    
    const { data, error, isLoading, mutate } = useSWR(
        params ? ['/api/admin/employees', params] : null, // ← Nếu params null → không fetch
        ([_, p]) => {
            return apiListAllEmployee(p)
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API violations:', err)
            },
        },
    )


    return {
        employeeList: data?.items || [],
        employeeListTotal:  data?.totalItems || 0,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedEmployee,
        setSelectedEmployee,
        setSelectAllEmployee,
        setFilterData,
    }
}
