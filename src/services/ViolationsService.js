import ApiService from './ApiService'

// ===========public===========
export async function apiGetViolations(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/violations',
        method: 'get',
        params,
    })
}
export async function apiGetViolation(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}`,
        method: 'get',
    })
}

export async function apiCreateViolationsPublic(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/violations',
        method: 'post',
        data,
    })
}

export async function apiUpdateViolationPublic(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}`,
        method: 'put',
        data,
    })
}

//history
export async function apiGetViolationsHistories(id, params) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}/histories`,
        method: 'get',
        params,
    })
}
export async function apiGetViolationHistories(id, historyId) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}/histories/${historyId}`,
        method: 'get',
    })
}

export async function apiCreateViolationsHistoriesPublic(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}/histories`,
        method: 'post',
        data,
    })
}

export async function apiUpdateViolationHistoriesPublic(id, editingId, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violations/${id}/histories/${editingId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteViolatorHistoriesPublic(id, historyId) {
    return ApiService.fetchDataWithAxios({
        url: `/api/violators/${id}/histories/${historyId}`,
        method: 'delete',
    })
}

// ========Admin========
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

export async function apiGetViolationAdmin(id) {
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

export async function apiDeleteViolatorAdmin(id) {
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
