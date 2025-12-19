import ApiService from './ApiService'

// =============Categories==========
export async function apiGetDocumentCategoriesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-categories',
        method: 'get',
        params,
    })
}

export async function apiGetDocumentCategoryAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-categories/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteDocumentCategoryAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-categories/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateDocumentCategoryAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-categories/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateDocumentCategoryAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-categories',
        method: 'post',
        data,
    })
}

// =============Types==========
export async function apiGetDocumentTypesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-types',
        method: 'get',
        params,
    })
}

export async function apiGetDocumentTypeAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-types/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteDocumentTypeAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-types/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateDocumentTypeAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-types/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateDocumentTypeAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-types',
        method: 'post',
        data,
    })
}
