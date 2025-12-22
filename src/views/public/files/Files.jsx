import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import { Button } from '@/components/ui'
import { useState } from 'react'
import FilesTable from './components/FilesTable'
import FilesTableTools from './components/FilesTableTools'

const Files = () => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)

    const openUploadModal = () => setUploadModalOpen(true)
    const closeUploadModal = () => setUploadModalOpen(false)

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách files</h3>
                            <Button
                                variant="solid"
                                color="blue-600"
                                size="md"
                                onClick={openUploadModal}
                            >
                                + Tải lên file mới
                            </Button>
                        </div>{' '}
                        <FilesTableTools />
                        <FilesTable
                            uploadModalOpen={uploadModalOpen}
                            closeUploadModal={closeUploadModal}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Files
