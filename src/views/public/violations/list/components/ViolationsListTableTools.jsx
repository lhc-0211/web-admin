import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useViolationsList from '../hooks/useViolationsList'

export default function ViolationsListTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)
    const { control, handleSubmit, getValues, reset } = useForm({
        defaultValues: {
            Search: '',
            WaterwayId: '',
            ViolationTypeId: '',
            ViolatorId: '',
            AssignedToId: '',
            HandledById: '',
            Severity: '',
            Status: '',
            Side: '',
            ViolationDateFrom: '',
            ViolationDateTo: '',
        },
    })

    const { filterData, setFilterData } = useViolationsList()

    const severityOptions = [
        { label: 'Thấp', value: 'Low' },
        { label: 'Trung bình', value: 'Medium' },
        { label: 'Cao', value: 'High' },
        { label: 'Nghiêm trọng', value: 'Critical' },
    ]

    const statusOptions = [
        { label: 'Mới', value: 'New' },
        { label: 'Đang xử lý', value: 'InProgress' },
        { label: 'Đã xử lý', value: 'Resolved' },
        { label: 'Đóng', value: 'Closed' },
        { label: 'Hủy', value: 'Cancelled' },
    ]

    const sideOptions = [
        { label: 'Trái', value: 'Left' },
        { label: 'Phải', value: 'Right' },
        { label: 'Không rõ', value: 'Unknown' },
    ]

    // Hàm áp dụng filter
    const applyFilters = (data) => {
        setFilterData({
            ...filterData,
            Search: data.Search || undefined,
            WaterwayId: data.WaterwayId || undefined,
            ViolationTypeId: data.ViolationTypeId || undefined,
            ViolatorId: data.ViolatorId || undefined,
            AssignedToId: data.AssignedToId || undefined,
            HandledById: data.HandledById || undefined,
            Severity: data.Severity || undefined,
            Status: data.Status || undefined,
            Side: data.Side || undefined,
            ViolationDateFrom: data.ViolationDateFrom || undefined,
            ViolationDateTo: data.ViolationDateTo || undefined,
        })
        setFilterIsOpen(false)
    }

    const handleQuickSearch = () => {
        const values = getValues()
        applyFilters({ ...values })
    }

    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

    return (
        <>
            {/* Thanh công cụ chính */}
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1 min-w-[300px]">
                    <DebounceInput
                        placeholder="Tìm kiếm nhanh (mã vi phạm, biển số tàu...)"
                        suffix={<TbSearch className="text-lg" />}
                        className="w-full"
                        onChange={(e) => {
                            const value = e.target.value

                            setFilterData({
                                ...filterData,
                                Search: value?.trim() || undefined,
                            })
                        }}
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

            {/* Drawer filter */}
            <Drawer
                title="Bộ lọc Vi phạm được giao"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={400}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto">
                        {/* Các field cũ giữ nguyên */}
                        <FormItem label="Tuyến đường thủy">
                            <Controller
                                name="WaterwayId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Mã hoặc tên tuyến"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Loại vi phạm">
                            <Controller
                                name="ViolationTypeId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Mã hoặc tên loại vi phạm"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Đối tượng vi phạm">
                            <Controller
                                name="ViolatorId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Biển số tàu, tên tàu..."
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Người được giao">
                            <Controller
                                name="AssignedToId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Id người được giao"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Người xử lý">
                            <Controller
                                name="HandledById"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Id người xử lý"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Mức độ nghiêm trọng">
                            <Controller
                                name="Severity"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={severityOptions}
                                        placeholder="Tất cả"
                                        value={getSelectValue(
                                            severityOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Trạng thái">
                            <Controller
                                name="Status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={statusOptions}
                                        placeholder="Tất cả"
                                        value={getSelectValue(
                                            statusOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Bên vi phạm">
                            <Controller
                                name="Side"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={sideOptions}
                                        placeholder="Tất cả"
                                        value={getSelectValue(
                                            sideOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* THÊM TRƯỜNG NGÀY VI PHẠM (RANGE) */}
                        <FormItem label="Ngày vi phạm">
                            <Controller
                                name="dateRange" // tên tạm để quản lý range
                                control={control}
                                render={({ field }) => (
                                    <DatePicker.DatePickerRange
                                        value={{
                                            from: field.value?.ViolationDateFrom
                                                ? new Date(
                                                      field.value.ViolationDateFrom,
                                                  )
                                                : undefined,
                                            to: field.value?.ViolationDateTo
                                                ? new Date(
                                                      field.value.ViolationDateTo,
                                                  )
                                                : undefined,
                                        }}
                                        onChange={(range) => {
                                            field.onChange({
                                                ViolationDateFrom: range?.from
                                                    ? range.from.toISOString()
                                                    : '', // hoặc format khác
                                                ViolationDateTo: range?.to
                                                    ? range.to.toISOString()
                                                    : '',
                                            })
                                        }}
                                        placeholder="Chọn khoảng ngày vi phạm"
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <Button
                            variant="default"
                            onClick={() => {
                                reset()
                                setFilterData({})
                                setFilterIsOpen(false)
                            }}
                            className="w-1/2"
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button variant="solid" type="submit" className="w-1/2">
                            Áp dụng
                        </Button>
                    </div>
                </form>
            </Drawer>
        </>
    )
}
