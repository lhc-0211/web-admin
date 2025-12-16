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
        key: 'private',
        path: `/announcements/private`,
        component: lazy(() => import('@/views/announce/AnnouncePrivateList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'public',
        path: `/announcements/public`,
        component: lazy(() => import('@/views/announce/AnnouncePublicList')),
        authority: [ADMIN, USER],
    },
]

export default dashboardsRoute
