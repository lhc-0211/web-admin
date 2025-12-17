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
        authority: [USER],
    },
    {
        key: 'public',
        path: `/announcements/public`,
        component: lazy(() => import('@/views/announce/AnnouncePublicList')),
        authority: [USER],
    },
    {
        key: 'violations',
        path: `/admin/violations`,
        component: lazy(() => import('@/views/admin/violations/list')),
        authority: [ADMIN],
    },
    {
        key: 'list-violators',
        path: `/admin/violations/list-violators`,
        component: lazy(
            () => import('@/views/admin/violations/list-violators'),
        ),
        authority: [ADMIN],
    },
    {
        key: 'violation-types',
        path: `/admin/violations/violation-types`,
        component: lazy(
            () => import('@/views/admin/violations/violation-types'),
        ),
        authority: [ADMIN],
    },
    {
        key: 'waterways',
        path: `/admin/violations/waterways`,
        component: lazy(() => import('@/views/admin/violations/waterways')),
        authority: [ADMIN],
    },
    {
        key: 'departments',
        path: `/admin/user/departments`,
        component: lazy(() => import('@/views/admin/user/departments')),
        authority: [ADMIN],
    },
    {
        key: 'announcements',
        path: `/admin/announcements`,
        component: lazy(() => import('@/views/admin/announcements/list')),
        authority: [ADMIN],
    },
    {
        key: 'announcements-categories',
        path: `/admin/announcements/categories`,
        component: lazy(() => import('@/views/admin/announcements/categories')),
        authority: [ADMIN],
    },
]

export default dashboardsRoute
