import ActionLink from '@/components/shared/ActionLink'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import { useThemeStore } from '@/store/themeStore'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import SignInForm from './components/SignInForm'

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
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
            <div className="mb-10">
                <h2 className="mb-2">Chào mừng bạn trở lại!</h2>
                <p className="font-semibold heading-text">
                    Vui lòng nhập thông tin đăng nhập của bạn để đăng nhập!
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div>
                <div className="mt-6 text-center">
                    <span>{`Bạn có muốn đổi mật khẩu?`} </span>
                    <ActionLink
                        to={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Đổi mật khẩu
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
