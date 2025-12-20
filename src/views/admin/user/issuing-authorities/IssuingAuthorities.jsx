import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import IssuingAuthoritiesActionTools from './components/IssuingAuthoritiesActionTools'
import IssuingAuthoritiesTable from './components/IssuingAuthoritiesTable'

const Departments = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý cơ quan ban hành</h3>
                            <IssuingAuthoritiesActionTools />
                        </div>
                        <IssuingAuthoritiesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Departments
