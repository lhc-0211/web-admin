import ApiService from './ApiService'

export async function apiGetFiles(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/files',
        method: 'get',
        params,
    })
}

// ======Files =======
export async function apiGetFilesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files',
        method: 'get',
        params,
    })
}

export async function apiCreateFileAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files',
        method: 'post',
        data,
    })
}

export async function apiGetFileAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/files/${id}`,
        method: 'get',
    })
}

export async function apiUpdateFileAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/files/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteFileAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/files/${id}`,
        method: 'delete',
    })
}
