import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import ItemsActionTools from './components/ItemsActionTools'
import ItemsTable from './components/ItemsTable'

const Items = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Gallảy Items</h3>
                            <ItemsActionTools />
                        </div>
                        <ItemsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Items
