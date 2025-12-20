import { useState } from 'react'

const SchedulesActionTools = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false)

    return (
        <>
            {/* <div className="flex flex-col md:flex-row gap-3">
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
            /> */}
        </>
    )
}

export default SchedulesActionTools
