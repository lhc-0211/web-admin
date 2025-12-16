import ApiService from './ApiService'

export async function apiGetViolationsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violations',
        method: 'get',
        params,
    })
}

export async function apiCreateViolationAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violations',
        method: 'post',
        data,
    })
}

// =======Violator===========
export async function apiGetViolatorAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violators',
        method: 'get',
        params,
    })
}

export async function apiCreateViolatorAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violators',
        method: 'post',
        data,
    })
}

export async function apiGetViolationAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violations/${id}`,
        method: 'get',
    })
}

export async function apiUpdateViolatorAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violators/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteViolatorAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violators/${id}`,
        method: 'delete',
    })
}

// ======violation types =======
export async function apiGetViolationTypesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violation-types',
        method: 'get',
        params,
    })
}

export async function apiCreateViolationTypeAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/violation-types',
        method: 'post',
        data,
    })
}

export async function apiGetViolationTypeAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violation-types/${id}`,
        method: 'get',
    })
}

export async function apiUpdateViolationTypeAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violation-types/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteViolationTypeAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/violation-types/${id}`,
        method: 'delete',
    })
}

// ======waterway=======
export async function apiGetWaterwaysAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/waterways',
        method: 'get',
        params,
    })
}

export async function apiCreateWaterwayAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/waterways',
        method: 'post',
        data,
    })
}

export async function apiGetWaterwayAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/waterways/${id}`,
        method: 'get',
    })
}

export async function apiUpdateWaterwayAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/waterways/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteWaterwayAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/waterways/${id}`,
        method: 'delete',
    })
}
