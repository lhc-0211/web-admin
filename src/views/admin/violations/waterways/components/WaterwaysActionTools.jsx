import Button from '@/components/ui/Button'
import { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import WaterwaysCreateModal from './WaterwaysCreateModal'

const WaterwaysActionTools = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <Button
                    icon={<TbPlus className="text-xl" />}
                    variant="solid"
                    onClick={() => setCreateModalOpen(true)}
                >
                    Thêm loại tuyến kênh
                </Button>
            </div>

            <WaterwaysCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </>
    )
}

export default WaterwaysActionTools
