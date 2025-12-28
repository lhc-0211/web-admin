import { Button } from '@/components/ui'
import { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import SchedulesCreateModal from './SchedulesCreateModal'

const SchedulesActionTools = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <Button
                    icon={<TbPlus className="text-xl" />}
                    variant="solid"
                    onClick={() => setCreateModalOpen(true)}
                >
                    Thêm mới
                </Button>
            </div>

            <SchedulesCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </>
    )
}

export default SchedulesActionTools
