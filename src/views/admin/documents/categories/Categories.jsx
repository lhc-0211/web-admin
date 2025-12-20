import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import CategoriesActionTools from './components/CategoriesActionTools'
import CategoriesTable from './components/CategoriesTable'

const Announcements = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh mục văn bản</h3>
                            <CategoriesActionTools />
                        </div>
                        <CategoriesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Announcements
