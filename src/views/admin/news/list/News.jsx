import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import NewsActionTools from './components/NewsActionTools'
import NewsTable from './components/NewsTable'
import NewsTableTools from './components/NewsTableTools'

const News = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Quản lý tin tức</h3>
                            <NewsActionTools />
                        </div>
                        <NewsTableTools />
                        <NewsTable />
                    </div>
                </AdaptiveCard>
            </Container>
        </>
    )
}

export default News
