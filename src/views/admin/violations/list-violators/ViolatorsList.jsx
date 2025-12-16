import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import ViolatorsListActionTools from './components/ViolatorsListActionTools'
import ViolatorsListTable from './components/ViolatorsListTable'

const ViolatorsList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Đối tượng vi phạm</h3>
                            <ViolatorsListActionTools />
                        </div>
                        <ViolatorsListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default ViolatorsList
