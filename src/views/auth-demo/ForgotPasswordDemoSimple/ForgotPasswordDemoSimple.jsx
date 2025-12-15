import Simple from '@/components/layouts/AuthLayout/Simple'
import { ForgotPasswordBase } from '@/views/auth/ChangePassword'

const ForgotPasswordDemoSimple = () => {
    return (
        <Simple>
            <ForgotPasswordBase signInUrl="/auth/sign-in-side" />
        </Simple>
    )
}

export default ForgotPasswordDemoSimple
