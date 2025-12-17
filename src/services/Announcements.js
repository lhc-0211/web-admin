import ApiService from './ApiService'

// ========Announcement===========
export async function apiGetAnnouncementsAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/announcements',
        method: 'get',
        params,
    })
}

export async function apiGetAnnouncementAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteAnnouncementAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}`,

        method: 'delete',
    })
}

export async function apiUpdateAnnouncementAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateAnnouncementAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/announcements',
        method: 'post',
        data,
    })
}

export async function apiArchiveAnnouncementAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}/archive`,
        method: 'patch',
        data,
    })
}

export async function apiPinAnnouncementAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}/pin`,
        method: 'patch',
        data,
    })
}

export async function apiUnpinAnnouncementAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}/unpin`,
        method: 'patch',
        data,
    })
}

export async function apiPublishAnnouncementAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcements/${id}/publish`,
        method: 'patch',
        data,
    })
}

// =============Categories==========
export async function apiGetAnnouncementCategoriesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/announcement-categories',
        method: 'get',
        params,
    })
}

export async function apiGetAnnouncementCategoryAdmin({ id, ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcement-categories/${id}`,
        method: 'get',
        params,
    })
}

export async function apiDeleteAnnouncementCategoryAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcement-categories/${id}`,
        method: 'delete',
    })
}

export async function apiUpdateAnnouncementCategoryAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/announcement-categories/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateAnnouncementCategoryAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/announcement-categories',
        method: 'post',
        data,
    })
}
