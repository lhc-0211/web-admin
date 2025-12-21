import Button from '@/components/ui/Button'
import { Notification, toast } from '@/components/ui'
import { TbArrowRight } from 'react-icons/tb'
import { useMemo, useState } from 'react'
import useRolePermissonsRoles from '../hooks/useRolePermissonsRoles'
import Dialog from '@/components/ui/Dialog'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { apiDeleteAuthRoles } from '@/services/AuthRoles'
import RolesPermissionsEditModal from './RolesPermissionsEditModal'
const RolesPermissionsGroups = () => {
    const{
        roleList,
        isLoading,
        mutate
    } = useRolePermissonsRoles()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState(null)

    const openEditModal = (type) => {
        setSelectedRoles(type)
        setEditModalOpen(true)
    }
    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedRoles(id)
    }
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [roleToDelete, setRolesToDelete] = useState(null)
  
    const openDeleteModal = (id) => {
        setRolesToDelete(id)
        setDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setRolesToDelete(null)
    }
    const confirmDelete = async () => {
        if (!roleToDelete) return

        console.log('role to delete: ', roleToDelete.id)
        try {
            await apiDeleteAuthRoles(roleToDelete?.id) // Gọi API xóa vai trò
            mutate()

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa vai trò: <strong>{roleToDelete.name}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa loại vai trò thất bại! 
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }
    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {roleList.map((role) => (
                <div
                    key={role.id}
                    className="flex flex-col justify-between rounded-2xl p-5 bg-gray-100 dark:bg-gray-700 min-h-[140px]"
                >
                    <div className="flex items-center justify-between">
                        <h6 className="font-bold">{role.name}</h6>
                        <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(role)}
                                title="Xóa"
                            />
                    </div>
                    <p className="mt-2">{role.description}</p>
                    <div className="flex items-center justify-between mt-4">
                    <p className="mt-2">{role.userCount}</p>
                        <Button
                            variant="plain"
                            size="sm"
                            className="py-0 h-auto"
                            icon={<TbArrowRight />}
                            iconAlignment="end"
                            onClick={() => openEditModal(role)}
                        >
                            Sửa vai trò
                        </Button>
                    </div>
                </div>
            ))}
        </div>
        <RolesPermissionsEditModal
        isOpen={editModalOpen}
        onClose ={closeEditModal}
        roles = {selectedRoles}
        />
        <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận xóa vai trò
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa loại vai trò
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{roleToDelete?.name}"
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
                            onClick={closeDeleteModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            size="lg"
                            onClick={confirmDelete}
                            className="px-8"
                        >
                            Xóa vĩnh viễn
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default RolesPermissionsGroups
