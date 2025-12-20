import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useAllSchedulesTypes from '../../types/hooks/useAllSchedulesTypes'
import useSchedules from '../hooks/useSchedules' // Hook quản lý filter & data

export default function SchedulesTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)
    const { filterData, setFilterData } = useSchedules()

    // Lấy dữ liệu cho các select
    const { scheduleTypes = [], isLoading: loadingTypes } =
        useAllSchedulesTypes()
    // const { employees = [], isLoading: loadingEmployees } = useEmployees() // Nếu có hook lấy nhân viên
    const employees = []
    const loadingEmployees = true

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            Search: filterData.Search || '',
            StartDateFrom: filterData.StartDateFrom
                ? new Date(filterData.StartDateFrom)
                : null,
            StartDateTo: filterData.StartDateTo
                ? new Date(filterData.StartDateTo)
                : null,
            EndDateFrom: filterData.EndDateFrom
                ? new Date(filterData.EndDateFrom)
                : null,
            EndDateTo: filterData.EndDateTo
                ? new Date(filterData.EndDateTo)
                : null,
            ScheduleTypeId: filterData.ScheduleTypeId || '',
            Status: filterData.Status || '',
            Priority: filterData.Priority || '',
            CreatedById: filterData.CreatedById || '',
            ParticipantId: filterData.ParticipantId || '',
            IsAllDay: filterData.IsAllDay ?? '',
            IsPrivate: filterData.IsPrivate ?? '',
        },
    })

    // Options
    const typeOptions = scheduleTypes.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const employeeOptions = employees.map((emp) => ({
        label: emp.fullName,
        value: emp.id,
    }))

    const statusOptions = [
        { label: 'Đã lên lịch', value: 'Scheduled' },
        { label: 'Đang diễn ra', value: 'InProgress' },
        { label: 'Hoàn thành', value: 'Completed' },
        { label: 'Hủy', value: 'Cancelled' },
        { label: 'Hoãn', value: 'Postponed' },
    ]

    const priorityOptions = [
        { label: 'Thấp', value: 'Low' },
        { label: 'Trung bình', value: 'Medium' },
        { label: 'Cao', value: 'High' },
        { label: 'Khẩn cấp', value: 'Urgent' },
    ]

    const booleanOptions = [
        { label: 'Có', value: true },
        { label: 'Không', value: false },
    ]

    const getSelectValue = (options, value) =>
        value !== undefined && value !== ''
            ? options.find((opt) => opt.value === value)
            : null

    // Áp dụng bộ lọc
    const applyFilters = (data) => {
        const cleanedData = {
            Search: data.Search?.trim() || undefined,
            StartDateFrom: data.StartDateFrom
                ? data.StartDateFrom.toISOString()
                : undefined,
            StartDateTo: data.StartDateTo
                ? data.StartDateTo.toISOString()
                : undefined,
            EndDateFrom: data.EndDateFrom
                ? data.EndDateFrom.toISOString()
                : undefined,
            EndDateTo: data.EndDateTo
                ? data.EndDateTo.toISOString()
                : undefined,
            ScheduleTypeId: data.ScheduleTypeId || undefined,
            Status: data.Status || undefined,
            Priority: data.Priority || undefined,
            CreatedById: data.CreatedById || undefined,
            ParticipantId: data.ParticipantId || undefined,
            IsAllDay: data.IsAllDay !== '' ? data.IsAllDay : undefined,
            IsPrivate: data.IsPrivate !== '' ? data.IsPrivate : undefined,
        }

        setFilterData(cleanedData)
        setFilterIsOpen(false)
    }

    // Xóa bộ lọc
    const clearFilters = () => {
        reset({
            Search: '',
            StartDateFrom: null,
            StartDateTo: null,
            EndDateFrom: null,
            EndDateTo: null,
            ScheduleTypeId: '',
            Status: '',
            Priority: '',
            CreatedById: '',
            ParticipantId: '',
            IsAllDay: '',
            IsPrivate: '',
        })
        setFilterData({})
        setFilterIsOpen(false)
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1 min-w-[300px]">
                    <Controller
                        name="Search"
                        control={control}
                        render={({ field }) => (
                            <DebounceInput
                                placeholder="Tìm kiếm lịch (tiêu đề, địa điểm, người tạo...)"
                                suffix={<TbSearch className="text-lg" />}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-full"
                            />
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<TbFilter />}
                        variant="default"
                        onClick={() => setFilterIsOpen(true)}
                    >
                        Bộ lọc
                    </Button>
                </div>
            </div>

            {/* Drawer bộ lọc */}
            <Drawer
                title="Bộ lọc lịch công tác"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={520}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto pb-20">
                        {/* Loại lịch */}
                        <FormItem label="Loại lịch">
                            <Controller
                                name="ScheduleTypeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={typeOptions}
                                        value={getSelectValue(
                                            typeOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isLoading={loadingTypes}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Trạng thái */}
                        <FormItem label="Trạng thái">
                            <Controller
                                name="Status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={statusOptions}
                                        value={getSelectValue(
                                            statusOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Độ ưu tiên */}
                        <FormItem label="Độ ưu tiên">
                            <Controller
                                name="Priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={priorityOptions}
                                        value={getSelectValue(
                                            priorityOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Người tạo */}
                        <FormItem label="Người tạo">
                            <Controller
                                name="CreatedById"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={employeeOptions}
                                        value={getSelectValue(
                                            employeeOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isLoading={loadingEmployees}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Người tham gia */}
                        <FormItem label="Người tham gia">
                            <Controller
                                name="ParticipantId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={employeeOptions}
                                        value={getSelectValue(
                                            employeeOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isLoading={loadingEmployees}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Thời gian bắt đầu */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem label="Bắt đầu từ">
                                <Controller
                                    name="StartDateFrom"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            placeholder="Chọn ngày"
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem label="Đến">
                                <Controller
                                    name="StartDateTo"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            placeholder="Chọn ngày"
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Thời gian kết thúc */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem label="Kết thúc từ">
                                <Controller
                                    name="EndDateFrom"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            placeholder="Chọn ngày"
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem label="Đến">
                                <Controller
                                    name="EndDateTo"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            placeholder="Chọn ngày"
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Cả ngày & Riêng tư */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem label="Cả ngày">
                                <Controller
                                    name="IsAllDay"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={booleanOptions}
                                            value={getSelectValue(
                                                booleanOptions,
                                                field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder="Tất cả"
                                            isClearable
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem label="Lịch riêng tư">
                                <Controller
                                    name="IsPrivate"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={booleanOptions}
                                            value={getSelectValue(
                                                booleanOptions,
                                                field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder="Tất cả"
                                            isClearable
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            variant="default"
                            type="button"
                            onClick={clearFilters}
                            className="flex-1"
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            className="flex-1"
                        >
                            Áp dụng
                        </Button>
                    </div>
                </form>
            </Drawer>
        </>
    )
}
