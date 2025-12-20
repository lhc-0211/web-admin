import ApiService from './ApiService'

// ========news===========
export async function apiGetNewsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news',
        method: 'get',
        params,
    })
}

export async function apiGetNewAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteNewAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}`,

        method: 'delete',
    })
}

export async function apiUpdateNewAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateNewAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news',
        method: 'post',
        data,
    })
}

export async function apiArchiveNewAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}/archive`,
        method: 'patch',
        data,
    })
}

export async function apiPinNewAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}/pin`,
        method: 'patch',
        data,
    })
}

export async function apiUnpinNewAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}/unpin`,
        method: 'patch',
        data,
    })
}

export async function apiPublishNewAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news/${id}/publish`,
        method: 'patch',
        data,
    })
}

// =============Categories==========
export async function apiGetNewsCategoriesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news-categories',
        method: 'get',
        params,
    })
}

export async function apiGetNewsCategoryAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-categories/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteNewsCategoryAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-categories/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateNewsCategoryAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-categories/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateNewsCategoryAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news-categories',
        method: 'post',
        data,
    })
}

// =============Tags==========
export async function apiGetNewsTagsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news-tags',
        method: 'get',
        params,
    })
}

export async function apiGetNewTagsAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-tags/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteNewsTagsAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-tags/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateNewsTagsAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/news-tags/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateNewsTagsAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/news-tags',
        method: 'post',
        data,
    })
}
