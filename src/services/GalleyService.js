import ApiService from './ApiService'

// ======Galleries =======
export async function apiGetGalleriesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/galleries',
        method: 'get',
        params,
    })
}

export async function apiCreateGalleryAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/galleries',
        method: 'post',
        data,
    })
}

export async function apiGetGalleryAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/galleries/${id}`,
        method: 'get',
    })
}

export async function apiUpdateGalleryAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/galleries/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteGalleryAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/galleries/${id}`,
        method: 'delete',
    })
}

// =============Categories==========
export async function apiGetGalleryCategoriesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/gallery-categories',
        method: 'get',
        params,
    })
}

export async function apiGetGalleryCategoryAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-categories/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteGalleryCategoryAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-categories/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateGalleryCategoryAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-categories/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateGalleryCategoryAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/gallery-categories',
        method: 'post',
        data,
    })
}

// =============Items==========
export async function apiGetGalleryItemsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/gallery-items',
        method: 'get',
        params,
    })
}

export async function apiGetGalleryItemAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-items/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteGalleryItemAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-items/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateGalleryItemAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/gallery-items/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateGalleryItemAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/gallery-items',
        method: 'post',
        data,
    })
}
