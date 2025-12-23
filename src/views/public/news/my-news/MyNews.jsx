import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import MyNewsTable from './components/MyNewsTable'
import MyNewsTableTools from './components/MyNewsTableTools'

const MyNews = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Danh sách tin tức</h3>
                        </div>{' '}
                        <MyNewsTableTools />
                        <MyNewsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default MyNews
