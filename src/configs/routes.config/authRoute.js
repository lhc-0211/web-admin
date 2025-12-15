import { lazy } from 'react'

const authRoute = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'changePassword',
        path: `/change-password`,
        component: lazy(() => import('@/views/auth/ChangePassword')),
        authority: [],
    },
]

export default authRoute
