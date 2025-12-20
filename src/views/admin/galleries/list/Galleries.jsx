import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import GalleriesActionTools from './components/GalleriesActionTools'
import GalleriesTable from './components/GalleriesTable'
import GalleriesTableTools from './components/GalleriesTableTools'

const Galleries = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý bộ sưu tập</h3>
                            <GalleriesActionTools />
                        </div>
                        <GalleriesTableTools />
                        <GalleriesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Galleries
