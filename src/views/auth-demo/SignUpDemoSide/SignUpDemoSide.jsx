import Side from '@/components/layouts/AuthLayout/Side'
import { SignUpBase } from '@/views/auth/ChangePassword'

const SignUpDemoSide = () => {
    return (
        <Side>
            <SignUpBase disableSubmit={true} signInUrl="/auth/sign-in-side" />
        </Side>
    )
}

export default SignUpDemoSide
