import { useAuth } from '@/auth'
import Avatar from '@/components/ui/Avatar'
import Drawer from '@/components/ui/Drawer' // hoặc đường dẫn đúng của bạn
import Dropdown from '@/components/ui/Dropdown'
import appConfig from '@/configs/app.config'
import { useSessionUser } from '@/store/authStore'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { format } from 'date-fns' // npm install date-fns
import { useEffect, useState } from 'react'
import { PiSignOutDuotone, PiUserDuotone } from 'react-icons/pi'
import { Link } from 'react-router'

const dropdownItemList = [
    // {
    //     label: 'Account Setting',
    //     path: '/concepts/account/settings',
    //     icon: <PiGearDuotone />,
    // },
    // {
    //     label: 'Activity Log',
    //     path: '/concepts/account/activity-log',
    //     icon: <PiPulseDuotone />,
    // },
]

const _UserDropdown = () => {
    const { avatar, userName, email, id } = useSessionUser(
        (state) => state.user,
    )
    const { signOut } = useAuth()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [userDetail, setUserDetail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [isEditing, setIsEditing] = useState(false)
    const [editingData, setEditingData] = useState()
    const [saving, setSaving] = useState(false)

    const token = localStorage.getItem('token')

    // Fetch dữ liệu khi mở Drawer
    useEffect(() => {
        if (!isDrawerOpen) return

        const fetchUserDetail = async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem('token') // hoặc lấy từ auth store

                const response = await fetch(
                    `${appConfig.apiPrefix}/api/employees/me`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                if (!response.ok) throw new Error('Không thể tải thông tin')

                const data = await response.json()
                setUserDetail(data)
                setEditingData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                    address: data.address,
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUserDetail()
    }, [isDrawerOpen])

    const handleSignOut = () => {
        signOut()
    }

    const avatarProps = {
        src: userDetail?.avatarFileUrl || avatar,
        icon:
            !userDetail?.avatarFileUrl && !avatar ? (
                <PiUserDuotone />
            ) : undefined,
    }

    // Hàm bắt đầu chỉnh sửa
    const handleStartEdit = () => {
        setIsEditing(true)
    }

    // Hàm hủy chỉnh sửa
    const handleCancelEdit = () => {
        setIsEditing(false)
        // Reset lại dữ liệu edit
        if (userDetail) {
            setEditingData({
                firstName: userDetail.firstName,
                lastName: userDetail.lastName,
                dateOfBirth: userDetail.dateOfBirth,
                gender: userDetail.gender,
                address: userDetail.address,
            })
        }
    }

    // Hàm lưu thay đổi
    const handleSave = async () => {
        if (!userDetail) return

        setSaving(true)
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${appConfig.apiPrefix}/api/employees/me`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingData),
                },
            )

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.message || 'Cập nhật thất bại')
            }

            const updatedData = await response.json()
            setUserDetail(updatedData)
            setIsEditing(false)
            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật thông tin thành công
                </Notification>,
            )
        } catch (err) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    {err.message || 'Có lỗi xảy ra khi lưu'}
                </Notification>,
            )
        } finally {
            setSaving(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return format(new Date(dateString), 'dd/MM/yyyy')
    }

    const genderText = (gender) => {
        if (gender === 'Male') return 'Nam'
        if (gender === 'Female') return 'Nữ'
        return 'Khác'
    }

    const currentFullName = userDetail?.fullName || userName || 'Admin'
    const currentEmail =
        userDetail?.userAccount.email || email || 'No email available'

    return (
        <>
            <Dropdown
                className="flex"
                toggleClassName="flex items-center"
                renderTitle={
                    <div className="cursor-pointer flex items-center">
                        <Avatar size={32} {...avatarProps} />
                    </div>
                }
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-3">
                        <Avatar {...avatarProps} />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {currentFullName}
                            </div>
                            <div className="text-xs">{currentEmail}</div>
                        </div>
                    </div>
                </Dropdown.Item>

                <Dropdown.Item variant="divider" />

                <Dropdown.Item className="px-0">
                    <div
                        className="flex h-full w-full px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">
                                <PiUserDuotone />
                            </span>
                            <span>Thông tin tài khoản</span>
                        </span>
                    </div>
                </Dropdown.Item>

                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2 py-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}

                <Dropdown.Item variant="divider" />

                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={handleSignOut}
                >
                    <span className="text-xl">
                        <PiSignOutDuotone />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>

            {/* Drawer hiển thị thông tin chi tiết */}
            <Drawer
                title="Thông tin tài khoản"
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false)
                    setIsEditing(false) // reset khi đóng
                }}
                onRequestClose={() => setIsDrawerOpen(false)}
                width={700}
            >
                <div className="p-6">
                    {loading && (
                        <div className="text-center py-10">Đang tải...</div>
                    )}
                    {error && (
                        <div className="text-red-600 text-center py-8">
                            Lỗi: {error}
                        </div>
                    )}

                    {userDetail && !loading && !error && (
                        <div className="space-y-8">
                            {/* Header với nút Chỉnh sửa */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <Avatar size={100} {...avatarProps} />
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {currentFullName}
                                        </h2>
                                        <p className="text-gray-600">
                                            {currentEmail}
                                        </p>
                                        <span
                                            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                                                userDetail.employmentStatus ===
                                                'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {userDetail.employmentStatus ===
                                            'Active'
                                                ? 'Đang làm việc'
                                                : 'Đã nghỉ việc'}
                                        </span>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <button
                                        onClick={handleStartEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <PiPencilSimple />
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>

                            {/* Form chỉnh sửa hoặc hiển thị thông tin */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Họ */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Họ
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingData.firstName || ''}
                                            onChange={(e) =>
                                                setEditingData({
                                                    ...editingData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg">
                                            {userDetail.firstName || '-'}
                                        </p>
                                    )}
                                </div>

                                {/* Tên */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Tên
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingData.lastName || ''}
                                            onChange={(e) =>
                                                setEditingData({
                                                    ...editingData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg">
                                            {userDetail.lastName || '-'}
                                        </p>
                                    )}
                                </div>

                                {/* Ngày sinh */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Ngày sinh
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={
                                                editingData.dateOfBirth?.slice(
                                                    0,
                                                    10,
                                                ) || ''
                                            }
                                            onChange={(e) =>
                                                setEditingData({
                                                    ...editingData,
                                                    dateOfBirth: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg">
                                            {formatDate(userDetail.dateOfBirth)}
                                        </p>
                                    )}
                                </div>

                                {/* Giới tính */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Giới tính
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editingData.gender || 'Male'}
                                            onChange={(e) =>
                                                setEditingData({
                                                    ...editingData,
                                                    gender: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Male">Nam</option>
                                            <option value="Female">Nữ</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                    ) : (
                                        <p className="mt-1 text-lg">
                                            {genderText(userDetail.gender)}
                                        </p>
                                    )}
                                </div>

                                {/* Địa chỉ */}
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Địa chỉ
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingData.address || ''}
                                            onChange={(e) =>
                                                setEditingData({
                                                    ...editingData,
                                                    address: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="mt-1 text-lg">
                                            {userDetail.address || '-'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Các thông tin khác không cho sửa (giữ nguyên như cũ) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Mã nhân viên
                                    </label>
                                    <p className="mt-1 text-lg">
                                        {userDetail.employeeCode || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Phòng ban
                                    </label>
                                    <p className="mt-1 text-lg">
                                        {userDetail.department?.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Chức vụ
                                    </label>
                                    <p className="mt-1 text-lg">
                                        {userDetail.position?.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Quản lý trực tiếp
                                    </label>
                                    <p className="mt-1 text-lg">
                                        {userDetail.manager?.fullName ||
                                            'Không có'}
                                    </p>
                                </div>
                            </div>

                            {/* Nút hành động khi đang edit */}
                            {isEditing && (
                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        disabled={saving}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving
                                            ? 'Đang lưu...'
                                            : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)
export default UserDropdown
