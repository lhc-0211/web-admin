import { ADMIN, USER } from '@/constants/roles.constant'
import { lazy } from 'react'

const dashboardsRoute = [
    {
        key: 'home',
        path: `/home`,
        component: lazy(() => import('@/views/home/Home')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'announce',
        path: `/announce`,
        component: lazy(() => import('@/views/announce')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default dashboardsRoute
