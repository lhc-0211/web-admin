import ApiService from './ApiService'

export async function apiGetCalendar() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedule-types',
        method: 'get',
    })
}

export async function apiCreateCalendarAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedule-types',
        method: 'post',
        data,
    })
}

export async function apiGetCalendarAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCalendarAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteCalendarAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'delete',
    })
}
