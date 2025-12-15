import Split from '@/components/layouts/AuthLayout/Split'
import { SignUpBase } from '@/views/auth/ChangePassword'

const SignUpDemoSplit = () => {
    return (
        <Split>
            <SignUpBase disableSubmit={true} signInUrl="/auth/sign-in-split" />
        </Split>
    )
}

export default SignUpDemoSplit
