import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import SchedulesActionTools from './components/SchedulesActionTools'
import SchedulesTable from './components/SchedulesTable'
import SchedulesTableTools from './components/SchedulesTableTools'

const Schedules = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách lịch công tác</h3>
                            <SchedulesActionTools />
                        </div>
                        <SchedulesTableTools />
                        <SchedulesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Schedules
