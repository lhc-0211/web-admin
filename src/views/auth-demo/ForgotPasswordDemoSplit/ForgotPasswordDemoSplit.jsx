import Split from '@/components/layouts/AuthLayout/Split'
import { ForgotPasswordBase } from '@/views/auth/ChangePassword'

const ForgotPasswordDemoSplit = () => {
    return (
        <Split>
            <ForgotPasswordBase signInUrl="/auth/sign-in-side" />
        </Split>
    )
}

export default ForgotPasswordDemoSplit
