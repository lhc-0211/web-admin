import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import ViolationTypesActionTools from './components/ViolationTypesActionTools'
import ViolationTypesTable from './components/ViolationTypesTable'

const ViolationTypes = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Loại vi phạm</h3>
                            <ViolationTypesActionTools />
                        </div>
                        <ViolationTypesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default ViolationTypes
