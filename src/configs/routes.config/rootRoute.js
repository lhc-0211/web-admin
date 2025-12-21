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
    {
        key: 'list',
        path: `/admin/violations/list`,
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
        key: 'roles-persmission',
        path: `/admin/user/roles-permission`,
        component: lazy(() => import('@/views/admin/roles-permission')),
        authority: [ADMIN],
    },
    {
        key: 'employees',
        path: `/admin/user/employees`,
        component: lazy(() => import('@/views/admin/employees/EmployeeList')),
        authority: [ADMIN],
    },
    {
        key: 'employees-detail',
        path: `admin/users/details-employee/:id`,
        component: lazy(() => import('@/views/admin/employees/EmployeeDetails')),
        authority: [ADMIN],
    },
    {
        key: 'employees-edit',
        path: `/admin/users/edit-employee/:id`,
        component: lazy(() => import('@/views/admin/employees/EmployeeEdit')),
        authority: [ADMIN],
    },
]

export default dashboardsRoute
