import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DepartmentsActionTools from './components/DepartmentsActionTools'
import DepartmentsTable from './components/DepartmentsTable'

const Departments = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý phòng ban</h3>
                            <DepartmentsActionTools />
                        </div>
                        <DepartmentsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Departments
