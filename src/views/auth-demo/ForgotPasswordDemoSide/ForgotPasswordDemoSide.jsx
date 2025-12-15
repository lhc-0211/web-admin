import Side from '@/components/layouts/AuthLayout/Side'
import { ForgotPasswordBase } from '@/views/auth/ChangePassword'

const ForgotPasswordDemoSide = () => {
    return (
        <Side>
            <ForgotPasswordBase signInUrl="/auth/sign-in-side" />
        </Side>
    )
}

export default ForgotPasswordDemoSide
