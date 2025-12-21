import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import AnnouncementsActionTools from './components/AnnouncementsActionTools'
import AnnouncementsTable from './components/AnnouncementsTable'
import AnnouncementsTableTableTools from './components/AnnouncementsTableTableTools'

const Announcements = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý thông báo</h3>
                            <AnnouncementsActionTools />
                        </div>
                        <AnnouncementsTableTableTools />
                        <AnnouncementsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Announcements
