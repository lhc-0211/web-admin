import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import WaterwaysActionTools from './components/WaterwaysActionTools'
import WaterwaysTable from './components/WaterwaysTable'

const Waterways = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý tuyến kênh</h3>
                            <WaterwaysActionTools />
                        </div>
                        <WaterwaysTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Waterways
