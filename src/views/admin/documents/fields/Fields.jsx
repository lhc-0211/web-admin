import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import FieldsActionTools from './components/FieldsActionTools'
import FieldsTable from './components/FieldsTable'

const Fields = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Lĩnh vực tài liệu</h3>
                            <FieldsActionTools />
                        </div>
                        <FieldsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Fields
