import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import PositionsActionTools from './components/PositionsActionTools'
import PositionsTable from './components/PositionsTable'

const Positions = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý chức vụ</h3>
                            <PositionsActionTools />
                        </div>
                        <PositionsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Positions
