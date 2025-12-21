import ApiService from './ApiService'

// ========Documents===========
export async function apiGetDocumentsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/documents',
        method: 'get',
        params,
    })
}

export async function apiGetDocumentAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteDocumentAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}`,

        method: 'delete',
    })
}

export async function apiUpdateDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateDocumentAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/documents',
        method: 'post',
        data,
    })
}

export async function apiArchiveDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}/archive`,
        method: 'patch',
        data,
    })
}

export async function apiCancelDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}/cancel`,
        method: 'patch',
        data,
    })
}

export async function apiPinDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}/pin`,
        method: 'patch',
        data,
    })
}

export async function apiUnpinDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}/unpin`,
        method: 'patch',
        data,
    })
}

export async function apiPublishDocumentAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/documents/${id}/publish`,
        method: 'patch',
        data,
    })
}

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

// =============Fields==========
export async function apiGetDocumentFieldsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-fields',
        method: 'get',
        params,
    })
}

export async function apiGetDocumentFieldAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-fields/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteDocumentFieldAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-fields/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateDocumentFieldAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/document-fields/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateDocumentFieldAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/document-fields',
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
