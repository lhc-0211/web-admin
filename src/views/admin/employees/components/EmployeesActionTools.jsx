import { useState } from 'react'

const EmployeesActionTools = () => {
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

            <PositionsCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            /> */}
        </>
    )
}

export default EmployeesActionTools
