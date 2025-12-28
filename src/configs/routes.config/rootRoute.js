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

    // ========Vi phạm========
    {
        key: 'violations-list-user',
        path: `/violations`,
        component: lazy(() => import('@/views/public/violations/list')),
        authority: [ADMIN, USER],
    },
    {
        key: 'violations-list',
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
        key: 'roles-persmission',
        path: `/admin/user/roles-permission`,
        component: lazy(() => import('@/views/admin/roles-permission')),
    },
    {
        key: 'issuing-authorities',
        path: `/admin/user/issuing-authorities`,
        component: lazy(() => import('@/views/admin/user/issuing-authorities')),
        authority: [ADMIN],
    },

    // =======Thông báo==========
    {
        key: 'list-announcements',
        path: `/announcements`,
        component: lazy(
            () => import('@/views/public/announce/AnnouncePrivateList'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'public-announcements',
        path: `/announcements/public`,
        component: lazy(
            () => import('@/views/public/announce/AnnouncePublicList'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'announcements-list',
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

    // =======NEWS========
    {
        key: 'public-news',
        path: `/news`,
        component: lazy(() => import('@/views/public/news/lists')),
        authority: [ADMIN, USER],
    },
    {
        key: 'public-news-featured',
        path: `/news/featured`,
        component: lazy(() => import('@/views/public/news/featured')),
        authority: [ADMIN, USER],
    },
    {
        key: 'public-my-news',
        path: `/news/my-news`,
        component: lazy(() => import('@/views/public/news/my-news')),
        authority: [ADMIN, USER],
    },
    {
        key: 'admin-news',
        path: `/admin/news`,
        component: lazy(() => import('@/views/admin/news/list')),
        authority: [ADMIN],
    },
    {
        key: 'news-categories',
        path: `/admin/news/categories`,
        component: lazy(() => import('@/views/admin/news/categories')),
        authority: [ADMIN],
    },
    {
        key: 'news-tags',
        path: `/admin/news/tags`,
        component: lazy(() => import('@/views/admin/news/tags')),
        authority: [ADMIN],
    },

    // =======FILE=======
    {
        key: 'files-admin',
        path: `/admin/files`,
        component: lazy(() => import('@/views/admin/files')),
        authority: [ADMIN],
    },
    {
        key: 'files-public',
        path: `/files`,
        component: lazy(() => import('@/views/public/files')),
        authority: [ADMIN],
    },
    {
        key: 'positions',
        path: `/admin/positions`,
        component: lazy(() => import('@/views/admin/positions')),
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
        component: lazy(
            () => import('@/views/admin/employees/EmployeeDetails'),
        ),
        authority: [ADMIN],
    },
    {
        key: 'employees-edit',
        path: `/admin/users/edit-employee/:id`,
        component: lazy(() => import('@/views/admin/employees/EmployeeEdit')),
        path: `/admin/employees`,
        component: lazy(() => import('@/views/admin/employees')),
        authority: [ADMIN],
    },

    // Văn bản
    {
        key: 'documents-list-public',
        path: `/documents`,
        component: lazy(() => import('@/views/public/documents/list')),
        authority: [ADMIN, USER],
    },
    {
        key: 'documents-list',
        path: `/admin/documents`,
        component: lazy(() => import('@/views/admin/documents/list')),
        authority: [ADMIN],
    },
    {
        key: 'document-categories',
        path: `/admin/document/categories`,
        component: lazy(() => import('@/views/admin/documents/categories')),
        authority: [ADMIN],
    },
    {
        key: 'document-types',
        path: `/admin/document/types`,
        component: lazy(() => import('@/views/admin/documents/type')),
        authority: [ADMIN],
    },
    {
        key: 'document-fields',
        path: `/admin/document/fields`,
        component: lazy(() => import('@/views/admin/documents/fields')),
        authority: [ADMIN],
    },

    // Lịch công tác
    {
        key: 'schedules-list-public',
        path: `/schedules`,
        component: lazy(() => import('@/views/public/schedules/list')),
        authority: [ADMIN],
    },
    {
        key: 'schedules-list',
        path: `/admin/schedules`,
        component: lazy(() => import('@/views/admin/schedules/list')),
        authority: [ADMIN],
    },
    {
        key: 'schedules-types',
        path: `/admin/schedules/types`,
        component: lazy(() => import('@/views/admin/schedules/types')),
        authority: [ADMIN],
    },

    // Bộ sưu tập
    {
        key: 'galleries-list-public',
        path: `/galleries`,
        component: lazy(() => import('@/views/public/galleries')),
        authority: [ADMIN],
    },
    {
        key: 'galleries-list',
        path: `/admin/galleries`,
        component: lazy(() => import('@/views/admin/galleries/list')),
        authority: [ADMIN],
    },
    {
        key: 'gallery-categories',
        path: `/admin/gallery/categories`,
        component: lazy(() => import('@/views/admin/galleries/categories')),
        authority: [ADMIN],
    },
]

export default dashboardsRoute
