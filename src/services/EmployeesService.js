import ApiService from './ApiService'

// ======Employees =======
export async function apiGetEmployeesAdmin(params) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/employees',
        method: 'get',
        params,
    })
}

export async function apiCreateEmployeeAdmin(data) {
    return ApiService.fetchDataWithAxios({
        url: '/api/admin/employees',
        method: 'post',
        data,
    })
}

export async function apiGetEmployeeAdmin({ id }) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/employees/${id}`,
        method: 'get',
    })
}

export async function apiUpdateEmployeeAdmin(id, data) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/employees/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteEmployeeAdmin(id) {
    return ApiService.fetchDataWithAxios({
        url: `/api/admin/employees/${id}`,
        method: 'delete',
    })
}
