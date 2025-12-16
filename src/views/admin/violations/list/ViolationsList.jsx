import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import ViolationsListActionTools from './components/ViolationsListActionTools'
import ViolationsListTable from './components/ViolationsListTable'
import ViolationsListTableTools from './components/ViolationsListTableTools'

const ViolationsList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách vi phạm</h3>
                            <ViolationsListActionTools />
                        </div>
                        <ViolationsListTableTools />
                        <ViolationsListTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default ViolationsList
