import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import FeaturedTable from './components/FeaturedTable'

const Featured = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách nổi bật</h3>
                        </div>{' '}
                        <FeaturedTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Featured
