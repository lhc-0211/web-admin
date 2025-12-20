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

// =======Cơ quan ban ngành===========
export async function apiGetIssuingAuthoritiesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/issuing-authorities',
        method: 'get',
        params,
    })
}

export async function apiCreateIssuingAuthoritiesAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/issuing-authorities',
        method: 'post',
        data,
    })
}

export async function apiGetIssuingAuthoritiAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/issuing-authorities/${id}`,
        method: 'get',
    })
}

export async function apiUpdateIssuingAuthoritiesAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/issuing-authorities/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteIssuingAuthoritiesAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/issuing-authorities/${id}`,
        method: 'delete',
    })
}
