import ApiService from "./ApiService"

export const endpointConfigAdminEmployee = {
    admin :'/api/admin/employees'
}
export async function apiListAllEmployee(params) {
  return ApiService.fetchDataWithAxios({
    url: `${endpointConfigAdminEmployee.admin}`, 
    method : 'get', 
    params
})
} 
export async function apiDetailEmployee( id) {
    return ApiService.fetchDataWithAxios({
      url: `${endpointConfigAdminEmployee.admin}/${id}`, 
      method : 'get', 
  })
} 
export async function apiUpdateEmployee({params}, id) {
    return ApiService.fetchDataWithAxios({
      url: `${endpointConfigAdminEmployee.admin}/${id}`, 
      method : 'put', 
      params
  })
} 
export async function apiDeleteEmployee( id) {
    return ApiService.fetchDataWithAxios({
      url: `${endpointConfigAdminEmployee.admin}/${id}`, 
      method : 'delete', 
  })
} 
//lấy cấp dưới của một nhân viên
export async function apiSubordinatesEmployee( id) {
    return ApiService.fetchDataWithAxios({
      url: `${endpointConfigAdminEmployee.admin}/${id}/suborinates`, 
      method : 'get', 
  })
} 

export async function apiDropdownEmployee(params) {
    return ApiService.fetchDataWithAxios({
        url: `${endpointConfigAdminEmployee.admin}/dropdown`,
        method:'get',
        params
    })
}

export async function apiStatisticsEmployee() {
    return ApiService.fetchDataWithAxios({
        url: `${endpointConfigAdminEmployee.admin}/statistics`,
        method:'get',
    })
}
export async function apiDropdownDepartment() {
  return ApiService.fetchDataWithAxios({
      url: `/api/admin/departments`,
      method:'get',
  })
}
export async function apiDropdownPosition(departmentId) {
  return ApiService.fetchDataWithAxios({
      url: `/api/admin/positons/departments/${departmentId}`,
      method:'get',
  })
}
  
