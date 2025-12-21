import Button from '@/components/ui/Button'
import { useRolePermissionsStore } from '../store/rolePermissionsStore'
import { TbPlus } from 'react-icons/tb'
import { useState } from 'react'
import RolesPermissionCreateModal from './RolesPermissionsCreateModal'
import RolesUserCreateModal from './RolesUserCreateModal'
const RolesPermissionsGroupsAction = ({titles}) => {
    const [createModalOpen, setCreateModalOpen]= useState(false)

    return (
        <>
        <div>
            <Button
                variant="solid"
                icon={<TbPlus className='text-xl'/>}
                style={{
                    backgroundColor: '#A6B28B',
                    color: '#1C352D',
                }}
                onClick={() =>
                    setCreateModalOpen(true)
                }
            >
                {titles}
            </Button>
        </div>
         {titles == "Thêm mới vai trò" &&(<RolesPermissionCreateModal
         isOpen={createModalOpen}
         onClose={() => setCreateModalOpen(false)}
     />)}
      {titles == "Thêm mới người dùng" &&(<RolesUserCreateModal
         isOpen={createModalOpen}
         onClose={() => setCreateModalOpen(false)}
     />)}
    </>
    )
}

export default RolesPermissionsGroupsAction
