import ActionLink from '@/components/shared/ActionLink'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import { useThemeStore } from '@/store/themeStore'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import SignUpForm from './components/ChangePasswordForm'

export const ChangePasswordBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={60}
                />
            </div>
            <div className="mb-8">
                <h3 className="mb-1">Đổi mật khẩu</h3>
                <p className="font-semibold heading-text">
                    Vui lòng nhập thông tin để đổi mật khẩu
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div>
                <div className="mt-6 text-center">
                    <span>Bạn đã có tài khoản? </span>
                    <ActionLink
                        to={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Đăng nhập
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const ChangePassword = () => {
    return <ChangePasswordBase />
}

export default ChangePassword
