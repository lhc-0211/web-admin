import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import TypesActionTools from './components/TypesActionTools'
import TypesTable from './components/TypesTable'

const Announcements = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý loại văn bản</h3>
                            <TypesActionTools />
                        </div>
                        <TypesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Announcements
