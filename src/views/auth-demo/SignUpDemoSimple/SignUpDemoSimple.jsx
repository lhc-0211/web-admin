import Simple from '@/components/layouts/AuthLayout/Simple'
import { SignUpBase } from '@/views/auth/ChangePassword'

const SignUpDemoSimple = () => {
    return (
        <Simple>
            <SignUpBase disableSubmit={true} signInUrl="/auth/sign-in-simple" />
        </Simple>
    )
}

export default SignUpDemoSimple
