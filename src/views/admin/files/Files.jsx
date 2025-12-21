import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import FilesTable from './components/FilesTable'

const Files = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý Files</h3>
                        </div>
                        <FilesTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default Files
