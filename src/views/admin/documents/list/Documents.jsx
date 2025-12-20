import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DocumentsActionTools from './components/DocumentsActionTools'
import DocumentsTable from './components/DocumentsTable'
import DocumentsTableTools from './components/DocumentsTableTools'

const Documents = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý văn bản</h3>
                            <DocumentsActionTools />
                        </div>
                        <DocumentsTableTools />
                        <DocumentsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Documents
