import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import AnnouncePublicListActionTools from './components/AnnouncePublicListActionTools'
import AnnouncePublicListTable from './components/AnnouncePublicListTable'
import AnnouncePublicListTableTools from './components/AnnouncePublicListTableTools'

const AnnouncePublicList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Thông báo công khai</h3>
                            <AnnouncePublicListActionTools />
                        </div>
                        <AnnouncePublicListTableTools />
                        <AnnouncePublicListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default AnnouncePublicList
