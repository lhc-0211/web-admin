import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'

import EmployeeListTableTools from './components/EmployeeListTableTools'
import EmployeeListView from './components/EmployeeListView'
import useResponsive from './hooks/useReponsive'
import { useState, useEffect } from 'react'
import EmployeeDetails from '../EmployeeDetails'
import NoUserFound from '@/assets/svg/NoUserFound'
import EmployeeEdit from '../EmployeeEdit'

const EmployeeList = () => {
    const { isMobile } = useResponsive()

    const [viewMode, setViewMode] = useState(null)

    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const openViewModal = (employee) => {
        setSelectedEmployee(employee)
        setViewMode('view')
    }

    const openEditModal = (employee) => {
        console.log(' onpen edit modal')
        setSelectedEmployee(employee)
        setViewMode('edit')
    }
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col xl:flex-row gap-4 h-screen">
                        <div className="flex flex-col gap-4 2xl:min-w-[100px]">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <h3>Danh sách nhân viên</h3>
                            </div>
                            <EmployeeListTableTools />
                            <EmployeeListView
                                onViewEmployee={(employee) =>
                                    openViewModal(employee)
                                }
                                onEditEmployee={(employee) =>
                                    openEditModal(employee)
                                }
                            />
                        </div>
                        <div className="flex flex-1 overflow-x-auto">
                            {!isMobile && (
                                <div className="flex-1 w-full shadow-xl">
                                    {viewMode !== 'view' &&
                                        viewMode !== 'edit' && (
                                            <div className="flex flex-col items-center justify-center min-h-[420px]">
                                                <NoUserFound
                                                    height={100}
                                                    width={100}
                                                />
                                                <h3 className="mt-8">
                                                    Vui lòng chọn người dùng để
                                                    xem chi tiết
                                                </h3>
                                            </div>
                                        )}

                                    {viewMode === 'view' &&
                                        selectedEmployee?.id && (
                                            <EmployeeDetails
                                                id={selectedEmployee.id}
                                            />
                                        )}
                                    {viewMode === 'edit'&& (
                                            <EmployeeEdit
                                                id={selectedEmployee?.id}
                                            />
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </AdaptiveCard>
            </Container>
            {/* <CustomerListSelected /> */}
        </>
    )
}

export default EmployeeList
