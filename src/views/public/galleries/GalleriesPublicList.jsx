import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import GalleriesPublicListTable from './components/GalleriesPublicListTable'
import GalleriesPublicListTableTools from './components/GalleriesPublicListTableTools'

const DocumentsPublicList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách công khai</h3>
                        </div>
                        <GalleriesPublicListTableTools />
                        <GalleriesPublicListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default DocumentsPublicList
