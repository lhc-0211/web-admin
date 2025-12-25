import Button from '@/components/ui/Button'
import { CSVLink } from 'react-csv'
import { TbCloudDownload } from 'react-icons/tb'
import useAnnouncePublicList from '../hooks/useAnnouncePublicList'

const AnnouncePublicListActionTools = () => {
    const { announcePublicList } = useAnnouncePublicList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="announcePublicList.csv"
                data={announcePublicList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Tải xuống
                </Button>
            </CSVLink>
        </div>
    )
}

export default AnnouncePublicListActionTools
