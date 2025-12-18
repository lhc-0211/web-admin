import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import TagsActionTools from './components/TagsActionTools'
import TagsTable from './components/TagsTable'

const Tags = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách tag</h3>
                            <TagsActionTools />
                        </div>
                        <TagsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Tags
