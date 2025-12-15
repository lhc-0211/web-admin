import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import {
    apiChangePassword,
    apiGetMe,
    apiSignIn,
    apiSignOut,
} from '@/services/AuthService'
import { useSessionUser, useToken } from '@/store/authStore'
import { useImperativeHandle, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import AuthContext from './AuthContext'

const IsolatedNavigator = ({ ref }) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])

    return <></>
}

function AuthProvider({ children }) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()
    const [tokenState, setTokenState] = useState(token)

    const authenticated = Boolean(tokenState && signedIn)

    const navigatorRef = useRef(null)

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        )
    }

    const handleSignIn = async (tokens) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)

        const meResp = await apiGetMe()

        if (meResp) {
            const authority = (meResp.user.roles || []).map((r) =>
                r.toLowerCase(),
            )

            setUser({
                ...meResp.user,
                authority,
                employee: meResp.employee,
            })
        }
    }

    const handleSignOut = () => {
        setToken('')
        setUser({})
        setSessionSignedIn(false)
    }

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values)
            if (resp) {
                handleSignIn({ accessToken: resp.accessToken })
                redirect()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign in',
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const changePassword = async (values) => {
        try {
            await apiChangePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            })

            redirect()

            return {
                status: 'success',
                message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
            }
        } catch (errors) {
            return {
                status: 'failed',
                message:
                    errors?.response?.data?.message ||
                    errors?.message ||
                    'Đổi mật khẩu thất bại',
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate('/')
        }
    }
    const oAuthSignIn = (callback) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                changePassword,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
