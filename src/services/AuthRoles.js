import ApiService from "./ApiService";
//done
export async function apiGetRolesAdmin() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/auth/roles',
        method: 'get'
})
}
//done
export async function apiCreateRoleAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/auth/roles',
        method: 'post',
        data,
    })
}

// Get list permission
export async function apiGetPermissionAdmin({roleId}) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/roles/${roleId}/permissions`,
        method: 'get'
})
}
export async function apiUpdatePermissionAdmin(roleId, param) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/roles/${roleId}/permissions`,
        method: 'get',
        param
})
}
//done
export async function apiDeleteAuthRoles(roleId) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/roles/${roleId}`,
        method: 'delete',
    })
}
//done
export async function apiUpdateAuthRoles(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/roles/${id}`,
        method: 'put',
        data,
    })
}
/// User 
export async function apiGetAuthUsers() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/auth/users',
        method: 'get'
})
}
export async function apiCreateAuthUsers(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/auth/users',
        method: 'post',
        data,
    })
}
//=== change password  ===
export async function apiConnectUserEmployee(usersId, employeeId) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/users/${usersId}/employees/${employeeId}`,
        method: 'post',
    
    })
}
export async function apiChangepasswordEmployee(userId,data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/users/${userId}/password`,
        method: 'post',
        data,
    })
}

/// role-usser

export async function apiUpdateRolesUser(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/roles/${id}/roles`,
        method: 'put',
        data,
    })
}
export async function apiUpdateStatusUser(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/users/${id}/status`,
        method: 'put',
        data,
    })
}
export async function apiDeleteConnectEmployee(staffId) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/auth/employees/${staffId}/links`,
        method: 'delete',
    })
}