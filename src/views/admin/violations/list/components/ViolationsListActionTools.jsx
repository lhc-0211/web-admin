import Button from '@/components/ui/Button'
import { useState } from 'react'
import { CSVLink } from 'react-csv'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import useViolationsList from '../hooks/useViolationsList'
import ViolationCreateModal from './ViolationCreateModal'

const ViolationsListActionTools = () => {
    const { violations } = useViolationsList()
    const [createModalOpen, setCreateModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <CSVLink filename="danh-sach-vi-pham.csv" data={violations}>
                    <Button
                        icon={<TbCloudDownload className="text-xl" />}
                        variant="twoTone"
                    >
                        Tải xuống CSV
                    </Button>
                </CSVLink>

                <Button
                    icon={<TbPlus className="text-xl" />}
                    variant="solid"
                    onClick={() => setCreateModalOpen(true)}
                >
                    Thêm vi phạm
                </Button>
            </div>

            <ViolationCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </>
    )
}

export default ViolationsListActionTools
