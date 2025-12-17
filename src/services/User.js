import ApiService from './ApiService'

// =======Phòng ban===========
export async function apiGetDepartmentsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/departments',
        method: 'get',
        params,
    })
}

export async function apiCreateDepartmentsAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/departments',
        method: 'post',
        data,
    })
}

export async function apiGetDepartmentAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/departments/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDepartmentsAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/departments/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDepartmentsAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/departments/${id}`,
        method: 'delete',
    })
}
