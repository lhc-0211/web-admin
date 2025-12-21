import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiDetailEmployee, apiUpdateEmployee } from '@/services/AdminEmployees'
import EmployeeForm from '../EmployeeForm'
import sleep from '@/utils/sleep'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'

const EmployeeEdit = ({id: idPord}) => {
    const navigate = useNavigate()

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


    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

  


    const handleFormSubmit = async (values) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(<Notification type="success">Changes Saved!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/customers/customer-list')
    }

    const getDefaultValues = () => {
        if (!data) return {
            id: undefined,
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            gender: '',
            applicationUserId: '',
            departmentId: '',
            positionId: '',
            managerId: '',
            employmentStatus: 'Active', // default
            joinDate: '',
            probationEndDate: '',
            leaveDate: '',
            isActive: true,
            address: '',
            description: '',
            salary: 0,
            avatarFileId: '',
        }
    
        return {
            id: data.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            middleName: data.middleName || '',
            email: data.userAccount?.email || '',
            phoneNumber: data.phoneNumber || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            applicationUserId: data.applicationUserId || '',
            departmentId: data.department?.id || '',
            positionId: data.position?.id || '',
            managerId: data.manager?.id || '',
            employmentStatus: data.employmentStatus || 'Active',
            joinDate: data.joinDate || '',
            probationEndDate: data.probationEndDate || '',
            leaveDate: data.leaveDate || '',
            isActive: data.isActive ?? true,
            address: data.address || '',
            description: data.description || '',
            salary: data.salary ?? 0,
            avatarFileId: data.avatarFileId || '',
        }
    }
    const onSubmit = async (data) => {
        try {
            const body = {
                id: data.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            middleName: data.middleName || '',
            email: data.email || '',
            phoneNumber: data.personalInfo?.phoneNumber || '',
            dateOfBirth: data.personalInfo?.dateOfBirth || '',
            gender: data.gender || '',
            applicationUserId: data.applicationUserId || '',
            departmentId: data.departmentId || '',
            positionId: data.positionId || '',
            managerId: data.managerId || '',
            employmentStatus: data.employmentStatus || 'Active',
            joinDate: data.joinDate || '',
            probationEndDate: data.probationEndDate || '',
            leaveDate: data.leaveDate || '',
            isActive: data.isActive ?? true,
            address: data.address || '',
            description: data.description || '',
            salary: data.salary ?? 0,
            avatarFileId: data.avatarFileId || '',
            }

            await apiUpdateEmployee(body,id )

            mutate() // Refresh 
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật loại nhân viên <strong>{data.code}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi cập nhật nhân viên:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {error.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }
    

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer deleted!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/customers/customer-list')
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <EmployeeForm
                        defaultValues={getDefaultValues()}
                        newCustomer={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </EmployeeForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remove customers"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to remove this customer? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default EmployeeEdit
