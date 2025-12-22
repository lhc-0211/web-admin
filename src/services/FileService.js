import ApiService from './ApiService'

// ======Files admin=======
export async function apiGetFilesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files',
        method: 'get',
        params,
    })
}

export async function apiGetFilesDownloadAdmin(id, params) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/files/${id}/download`,
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

export async function apiGetFilesOrphanedAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files/orphaned',
        method: 'get',
        params,
    })
}

export async function apiDeleteAllOrphanedFilesAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files/cleanup-orphaned',
        method: 'post',
        data,
    })
}

export async function apiGetFilesStatisticsAdmin() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/files/statistics',
        method: 'get',
    })
}

// ======Files user=======
export async function apiGetFilesPublic(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/files/my-files',
        method: 'get',
        params,
    })
}
export async function apiGetFilesDownloadPublic(id, params) {
    return ApiService.fetchDataWithAxios({
        url: `/api/files/${id}/download`,
        method: 'get',
        params,
    })
}

export async function apiCreateFilePublic(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/files/upload',
        method: 'post',
        data,
    })
}

export async function apiGetFilePublic({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/files/${id}`,
        method: 'get',
    })
}

export async function apiUpdateFilePublic(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/files/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteFilePublic(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/files/${id}`,
        method: 'delete',
    })
}
