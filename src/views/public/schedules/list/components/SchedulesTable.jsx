import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { apiDeleteSchedulePublic } from '@/services/ScheduleService'
import { useMemo, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useSchedules from '../hooks/useSchedules'
import SchedulesEditModal from './SchedulesEditModal'

const SchedulesTable = () => {
    const {
        schedules, // Danh sách lịch công tác
        total: schedulesTotal,
        tableData,
        isLoading,
        setTableData,
        mutate,
    } = useSchedules()

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState(null)

    // Modal xác nhận xóa
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [scheduleToDelete, setScheduleToDelete] = useState(null)

    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule)
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditModalOpen(false)
        setSelectedSchedule(null)
    }

    const openDeleteModal = (schedule) => {
        setScheduleToDelete(schedule)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setScheduleToDelete(null)
    }

    const confirmDelete = async () => {
        if (!scheduleToDelete) return

        try {
            await apiDeleteSchedulePublic(scheduleToDelete.id)
            mutate() // Refetch lại danh sách

            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa lịch công tác:{' '}
                    <strong>{scheduleToDelete.title}</strong>
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa lịch công tác thất bại!
                </Notification>,
            )
        } finally {
            closeDeleteModal()
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                size: 300,
                cell: ({ row }) => (
                    <span className="font-semibold text-primary">
                        {row.original.title || '-'}
                    </span>
                ),
            },
            {
                header: 'Loại lịch',
                accessorKey: 'scheduleTypeName',
                size: 180,
                cell: ({ row }) => row.original.scheduleTypeName || '-',
            },
            {
                header: 'Thời gian',
                id: 'timeRange',
                size: 250,
                cell: ({ row }) => {
                    const { startTime, endTime, isAllDay } = row.original
                    if (!startTime) return '-'

                    const format = (date) =>
                        new Date(date).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })

                    if (isAllDay) return 'Cả ngày'
                    return `${format(startTime)} → ${endTime ? format(endTime) : '...'}`
                },
            },
            {
                header: 'Địa điểm',
                accessorKey: 'location',
                size: 200,
                cell: ({ row }) => row.original.location || '-',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                size: 140,
                cell: ({ row }) => {
                    const status = row.original.status
                    const statusColors = {
                        Scheduled: 'bg-blue-100 text-blue-800',
                        Completed: 'bg-green-100 text-green-800',
                        Cancelled: 'bg-red-100 text-red-800',
                    }
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[status] ||
                                'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {status || '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Người tạo',
                accessorKey: 'createdBy.fullName',
                size: 180,
                cell: ({ row }) => row.original.createdBy?.fullName || '-',
            },
            {
                header: 'Ngày tạo',
                accessorKey: 'createdAtUtc',
                size: 180,
                cell: ({ row }) => {
                    const date = row.original.createdAtUtc
                    if (!date) return '-'
                    return new Date(date).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                },
            },
            {
                header: 'Hành động',
                id: 'actions',
                size: 120,
                cell: ({ row }) => {
                    const schedule = row.original
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="blue-600"
                                icon={<HiPencil />}
                                onClick={() => openEditModal(schedule)}
                                title="Sửa"
                            />
                            <Button
                                size="xs"
                                variant="twoTone"
                                color="red-600"
                                icon={<HiTrash />}
                                onClick={() => openDeleteModal(schedule)}
                                title="Xóa"
                            />
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const handlePaginationChange = (page) => {
        setTableData({ ...tableData, pageIndex: page - 1 })
    }

    const handleSelectChange = (value) => {
        setTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 0,
        })
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={schedules}
                loading={isLoading}
                noData={!isLoading && schedules?.length === 0}
                pagingData={{
                    total: schedulesTotal,
                    pageIndex: tableData.pageIndex + 1,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                selectable={false}
            />

            {/* Modal sửa lịch công tác */}
            <SchedulesEditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                schedule={selectedSchedule}
            />

            {/* Modal xác nhận xóa */}
            <Dialog
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                width={500}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Xác nhận xóa lịch công tác
                    </h5>

                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                        Bạn có chắc chắn muốn xóa lịch công tác
                        <br />
                        <span className="font-semibold text-red-700 text-lg">
                            "{scheduleToDelete?.title}"
                        </span>
                        <br />
                        không?
                        <br />
                        <span className="text-sm text-red-600 font-medium">
                            Hành động này không thể hoàn tác!
                        </span>
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={closeDeleteModal}
                            className="px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            size="lg"
                            onClick={confirmDelete}
                            className="px-8"
                        >
                            Xóa vĩnh viễn
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SchedulesTable
