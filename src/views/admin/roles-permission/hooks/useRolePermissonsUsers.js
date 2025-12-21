import { useRolePermissionsStore } from '../store/rolePermissionsStore'
import React from 'react'
import useSWR from 'swr'
import { apiGetAuthUsers } from '@/services/AuthRoles'

export default function useRolePermissonsUsers() {
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        setSelectAllUser,
        selectedUser,
        setSelectedUser,
    } = useRolePermissionsStore((state) => state)
    const params = React.useMemo(() => {
        const p = {
            Page: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        // Chỉ thêm nếu có giá trị (tránh gửi undefined)
        if (filterData.Search) p.Search = filterData.Search
        if (filterData.WaterwayId) p.WaterwayId = filterData.WaterwayId
        if (filterData.ViolationTypeId)
            p.ViolationTypeId = filterData.ViolationTypeId
        if (filterData.ViolatorId) p.ViolatorId = filterData.ViolatorId
        if (filterData.AssignedToId) p.AssignedToId = filterData.AssignedToId
        if (filterData.HandledById) p.HandledById = filterData.HandledById
        if (filterData.Severity) p.Severity = filterData.Severity
        if (filterData.Status) p.Status = filterData.Status
        if (filterData.Side) p.Side = filterData.Side
        if (filterData.ViolationDateFrom)
            p.ViolationDateFrom = filterData.ViolationDateFrom
        if (filterData.ViolationDateTo)
            p.ViolationDateTo = filterData.ViolationDateTo

        if (tableData.sort?.key) {
            p.SortBy = `${tableData.sort.key},${tableData.sort.order === 'ascend' ? 'asc' : 'desc'}`
        }

        return p
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort?.key,
        tableData.sort?.order,
        filterData.Search,
        filterData.WaterwayId,
        filterData.ViolationTypeId,
        filterData.ViolatorId,
        filterData.AssignedToId,
        filterData.HandledById,
        filterData.Severity,
        filterData.Status,
        filterData.Side,
        filterData.ViolationDateFrom,
        filterData.ViolationDateTo,
    ])

    const { data, isLoading, error, mutate } = useSWR(
       params ? ['/api/admin/auth/users',params]:null,
        // eslint-disable-next-line no-unused-vars
        ([_, p]) => {
            return apiGetAuthUsers(p)},
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API User:', err)
            },
        },
    )



    return {
        userList:data,
        userListTotal:data?.length ?? 0,
        error,
        isLoading,
        tableData,
        filterData,
        setFilterData,
        setTableData,
        selectedUser,
        setSelectAllUser,
        setSelectedUser,
        mutate,
    }
}
