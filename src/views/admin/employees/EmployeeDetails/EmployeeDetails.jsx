import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import ProfileSection from './ProfileSection'
import useSWR from 'swr'
import { useParams } from 'react-router'
import isEmpty from 'lodash/isEmpty'
import { apiDetailEmployee } from '@/services/AdminEmployees'


const EmployeeDetails = ({ id: idPord }) => {
    const { id: idFromRoute } = useParams()
    const employeeId = idPord || idFromRoute

    const { data, isLoading } = useSWR(
        employeeId ? ['/api/admin/employees', employeeId] : null,
        ([_, id]) => apiDetailEmployee(id),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    return (
        <Loading loading={isLoading}>
            {!isEmpty(data) && (
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="w-full">
                        <ProfileSection data={data} />
                    </div>
                </div>
            )}
        </Loading>
    )
}

export default EmployeeDetails
