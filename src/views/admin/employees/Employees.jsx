import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import EmployeesActionTools from './components/EmployeesActionTools'
import EmployeesTable from './components/EmployeesTable'

const Employees = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý nhân viên</h3>
                            <EmployeesActionTools />
                        </div>
                        <EmployeesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Employees
