import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import AnnouncePrivateListTable from './components/AnnouncePrivateListTable'
import AnnouncePrivateListTableTools from './components/AnnouncePrivateListTableTools'

const CustomerList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Thông báo nội bộ</h3>
                        </div>
                        <AnnouncePrivateListTableTools />
                        <AnnouncePrivateListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default CustomerList
