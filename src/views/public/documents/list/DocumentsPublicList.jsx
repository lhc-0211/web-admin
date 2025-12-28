import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DocumentsPublicListTable from './components/DocumentsPublicListTable'
import DocumentsPublicListTableTools from './components/DocumentsPublicListTableTools'

const DocumentsPublicList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách văn bản công khai</h3>
                        </div>
                        <DocumentsPublicListTableTools />
                        <DocumentsPublicListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default DocumentsPublicList
