import { useMemo, useState } from 'react'
import { Notification, toast } from '@/components/ui'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import useRolePermissonsUsers from '../hooks/useRolePermissonsUsers'
import { HiPencil, HiKey, HiOutlineLink, HiOutlineX } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import RolesUserChangePasswordModal from './RolesUserChangePasswordModal'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { apiUpdateStatusUser } from '@/services/AuthRoles'
import Dialog from '@/components/ui/Dialog'
import RolesUserConnectModal from './RolesUserConnectDisconnectModal'
const RolesPermissionsUserTable = () => {
    const {
        userList,
        userListTotal,
        tableData,
        isLoading,
        mutate,
        setTableData,
    } = useRolePermissonsUsers()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedChangePassword, setSelectedChangePassword] = useState(null)
    const openEditModal = (user) => {
        console.log('CLICK ĐỔI MẬT KHẨU:', user)
        setSelectedChangePassword(user)
        setEditModalOpen(true)
    }
    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedChangePassword(null)
    }

    const [activeModalOpen, setActiveModalOpen] = useState(false)
    const [userToActive, setUserToActive] = useState(null)

    const openActiveModal = (user) => {
        setUserToActive(user)
        setActiveModalOpen(true)
    }
    const closeActiveModal = () => {
        setActiveModalOpen(false)
        setUserToActive(null)
    }
    const confirmActive = async () => {
        if (!userToActive) return
        const body = {
            isActive: !userToActive.isActive,
        }

        try {
            await apiUpdateStatusUser(userToActive.id, body) // Gọi API xóa vai trò
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã cập nhật: <strong>{userToActive.isActive}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật trạng thái thất bại!
                </Notification>,
            )
            console.log('active to delete: ', error)
        } finally {
            closeActiveModal()
        }
    }

    const [connectModalOpen, setConnectModalOpen] = useState(false)
    const [userToConnect, setUserToConnect] = useState(null)

    const openConnectModal = (user) => {
        setUserToConnect(user)
        setConnectModalOpen(true)
    }
    const closeConnectModal = () => {
        console.log('Đóng kết nối')
        setConnectModalOpen(false)
        setUserToConnect(null)
    }

    const [disconnectModalOpen, setDiconnectModalOpen] = useState(false)
    const [userToDisconnect, setUserToDisconnect] = useState(null)

    const openDisconnectModal = (user) => {
      console.log('MỞ hủy kết nối')
        setUserToConnect(user)
        setDiconnectModalOpen(true)
    }
    const closeDisconnectModal = () => {
        console.log('Đóng hủy kết nối')
        setDiconnectModalOpen(false)
        setUserToDisconnect(null)
    }


    const columns = useMemo(
        () => [
            {
                header: 'Mã người dùng',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.id || '-'}
                    </span>
                ),
            },
            {
                header: 'Email người dùng',
                accessorKey: 'email',
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.email || '-'}
                    </span>
                ),
            },
            {
                header: 'Vai trò',
                accessorKey: 'roles',
                cell: ({ row }) => (
                    <div className="flex gap-1">
                        {row.original.roles?.map((r) => (
                            <Tag key={r}>{r}</Tag>
                        ))}
                    </div>
                ),
            },
            {
                header: 'Trạng thái',
                accessorKey: 'active',
                cell: ({ row }) => {
                    const isActive = row.original.isActive

                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                            isActive
                                ? 'text-green-700 bg-green-100'
                                : 'text-red-700 bg-red-100'
                        }`}
                        >
                            {isActive ? 'Đang hoạt động' : 'Dừng hoạt động'}
                        </span>
                    )
                },
            },
            {
                header: 'Hành động',
                id: 'action',
                cell: ({ row }) => {
                    const user = row.original

                    return (
                        <div className="flex gap-1">
                            {/* Đổi mật khẩu */}
                            <Tooltip title="Đổi mật khẩu">
                                <span>
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        icon={<HiKey />}
                                        onClick={() => openEditModal(user)}
                                    />
                                </span>
                            </Tooltip>

                            {/* Cập nhật user */}
                            <Tooltip title="Cập nhật trạng thái">
                                <span>
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        icon={<HiPencil />}
                                        onClick={() => openActiveModal(user)}
                                    />
                                </span>
                            </Tooltip>

                            {/* Hủy liên kết employee */}
                            {user.employeeId ? (
                                <Tooltip title="Hủy liên kết nhân viên">
                                  <span>
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        icon={<HiOutlineX />}
                                        onClick={() => openConnectModal(user)}
                                    />
                                    </span>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Liên kết với nhân viên">
                                  <span>
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        icon={<HiOutlineLink />}
                                        onClick={() =>
                                            openDisconnectModal(user)
                                        }
                                    />
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
        ], // eslint-disable-next-line react-hooks/exhaustive-deps
        [userList, openEditModal],
    )

    const handlePaginationChange = (page) => {
        setTableData({ ...tableData, pageIndex: page - 1 })
    }

    const handleSelectChange = (value) => {
        setTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 0,
        })
    }

    const handleSort = (sort) => {
        setTableData({ ...tableData, sort })
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={userList}
                noData={!isLoading && (!userList || userList.length === 0)}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: userListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                hoverable={false}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <RolesUserChangePasswordModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                user={selectedChangePassword}
            />
            <RolesUserConnectModal
                isOpen={
                    userToConnect?.employeeId 
                        ? disconnectModalOpen: connectModalOpen
                }
                onClose={
                    userToConnect?.employeeId
                        ?closeDisconnectModal:  closeConnectModal
                }
                users={
                    userToConnect?.employeeId
                        ?  userToDisconnect:userToConnect
                        
                }
            />
            <Dialog
                isOpen={activeModalOpen}
                onClose={closeActiveModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận thay đổi trạng thái
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn thay đổi trạng thái
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{' '}
                            {userToActive?.isActive
                                ? 'Đang hoạt động'
                                : 'Dừng hoạt động'}
                            "
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-red-600 font-medium">
                            Hành động này không thể hoàn tác!
                        </span>
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeActiveModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            size="lg"
                            onClick={confirmActive}
                            className="px-8"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default RolesPermissionsUserTable
