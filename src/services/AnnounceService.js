import ApiService from './ApiService'

export async function apiGetAnnouncements(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/announcements',
        method: 'get',
        params,
    })
}

export async function apiGetAnnouncementDetail(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/announcements/${id}`,
        method: 'get',
    })
}

export async function apiGetAnnouncementCategoriesDropdown() {
    return ApiService.fetchDataWithAxios({
        url: '/api/announcements/categories/dropdown',
        method: 'get',
    })
}

export async function apiGetPublicAnnouncements(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/announcements/public',
        method: 'get',
        params,
    })
}

export async function apiGetPublicAnnouncementDetail(slug) {
    return ApiService.fetchDataWithAxios({
        url: `/api/announcements/public/${slug}`,
        method: 'get',
    })
}
