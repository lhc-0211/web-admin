import useSWR from 'swr'
import { useRolePermissionsStore } from '../store/rolePermissionsStore'
import { apiGetRolesAdmin } from '@/services/AuthRoles'
import React from 'react'

export default function useRolePermissonsRoles() {
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        setSelectedUser,
        setSelectAllUser,
        setSelectedRole,
        setRoleDialog
    }= useRolePermissionsStore((state) =>state)
    const params = React.useMemo(() => {
        const p = {
            Page: tableData.pageIndex + 1,
            PageSize: tableData.pageSize,
        }

        if (filterData.Search) p.Search = filterData.Search

        return p
    }, [tableData.pageIndex, tableData.pageSize, filterData.Search])

    const { data, isLoading, error, mutate } = useSWR(
        params ? 'api/admin/auth/roles' : null,
        async () => {
            const res = await apiGetRolesAdmin()
            return res  
        },
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onError: (err) => {
                console.error('Lỗi khi gọi API vai trò:', err)
            },
        }
    )
    



    return {
        roleList :data || [],
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        setFilterData,
        setSelectedUser,
        setSelectAllUser,
        setSelectedRole,
        setRoleDialog
    }
}
