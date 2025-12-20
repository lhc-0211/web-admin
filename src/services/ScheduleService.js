import ApiService from './ApiService'

//========list=========
export async function apiGetSchedulesAdmin() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedules',
        method: 'get',
    })
}

export async function apiCreateSchedulesAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedules',
        method: 'post',
        data,
    })
}

export async function apiGetScheduleAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedules/${id}`,
        method: 'get',
    })
}

export async function apiUpdateScheduleAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedules/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteScheduleAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedules/${id}`,
        method: 'delete',
    })
}

//========type=========
export async function apiGetScheduleStypeAdmin() {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedule-types',
        method: 'get',
    })
}

export async function apiCreateScheduleStypeAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/schedule-types',
        method: 'post',
        data,
    })
}

export async function apiGetScheduletypeAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'get',
    })
}

export async function apiUpdateScheduleStypeAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteScheduleStypeAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/schedule-types/${id}`,
        method: 'delete',
    })
}
