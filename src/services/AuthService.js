import endpointConfig from '@/configs/endpoint.config'
import ApiService from './ApiService'

//Login
export async function apiSignIn(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

// Lấy thông tin tài khoản + prof
export async function apiGetMe() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.me,
        method: 'get',
    })
}

// Đổi mật khẩu
export async function apiChangePassword(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.changePassword,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}
