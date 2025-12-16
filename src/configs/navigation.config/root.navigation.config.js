import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_TITLE,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'

const rootNavigationConfig = [
    {
        key: 'root',
        path: '',
        title: 'root',
        translateKey: 'root',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'default',
            },
        },
        subMenu: [
            {
                key: 'home',
                path: `/home`,
                title: 'Trang chủ',
                translateKey: 'Home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'announcements',
                path: '',
                title: 'Thông báo',
                translateKey: 'announcements',
                icon: 'announce',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'announcements',
                        label: 'announcements',
                    },
                },
                subMenu: [
                    {
                        key: 'private',
                        path: `/announcements/private`,
                        title: 'Thông báo nội bộ',
                        translateKey: 'announcements-private',
                        icon: 'announcements',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'public',
                        path: `/announcements/public`,
                        title: 'Thông báo công khai',
                        translateKey: 'announcements-public',
                        icon: 'announcements',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'violations',
                path: '',
                title: 'Quản lý vi phạm',
                translateKey: 'violations',
                icon: 'violations',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'violations',
                        label: 'violations',
                    },
                },
                subMenu: [
                    {
                        key: 'list',
                        path: `/admin/violations/list`,
                        title: 'Danh sách vi phạm',
                        translateKey: 'violations-list',
                        icon: 'violations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'history',
                        path: `/admin/violations/history`,
                        title: 'Lịch sử xử lý vi phạm',
                        translateKey: 'violations-history',
                        icon: 'violations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'list-violators',
                        path: `/admin/violations/list-violators`,
                        title: 'Đối tượng vi phạm',
                        translateKey: 'violations-history',
                        icon: 'violations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'violation-types',
                        path: `/admin/violations/violation-types`,
                        title: 'Loại vi phạm',
                        translateKey: 'violation-types',
                        icon: 'violations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'waterways',
                        path: `/admin/violations/waterways`,
                        title: 'Tuyến kênh',
                        translateKey: 'waterways',
                        icon: 'violations',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default rootNavigationConfig
