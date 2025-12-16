import Button from '@/components/ui/Button'
import { CSVLink } from 'react-csv'
import { TbCloudDownload } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import useCustomerList from '../hooks/useAnnouncePrivateList'

const AnnouncePrivateListActionTools = () => {
    const navigate = useNavigate()

    const { customerList } = useCustomerList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="customerList.csv"
                data={customerList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Tải xuống
                </Button>
            </CSVLink>
            {/* <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => navigate('/concepts/customers/customer-create')}
            >
                Add new
            </Button> */}
        </div>
    )
}

export default AnnouncePrivateListActionTools
