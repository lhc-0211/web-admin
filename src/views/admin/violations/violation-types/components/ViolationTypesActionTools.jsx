import Button from '@/components/ui/Button'
import { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import ViolationCreateModal from './ViolationTypesCreateModal'

const ViolationTypesActionTools = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <Button
                    icon={<TbPlus className="text-xl" />}
                    variant="solid"
                    onClick={() => setCreateModalOpen(true)}
                >
                    Thêm loại vi phạm
                </Button>
            </div>

            <ViolationCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </>
    )
}

export default ViolationTypesActionTools
