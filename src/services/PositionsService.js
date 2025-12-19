import ApiService from './ApiService'

// ======Positions =======
export async function apiGetPositionsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/positions',
        method: 'get',
        params,
    })
}

export async function apiCreatePositionAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/positions',
        method: 'post',
        data,
    })
}

export async function apiGetPositionAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/positions/${id}`,
        method: 'get',
    })
}

export async function apiUpdatePositionAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/positions/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeletePositionAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/positions/${id}`,
        method: 'delete',
    })
}
