import DebouceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useAnnouncements from '../hooks/useAnnouncements'

export default function AnnouncementsTableTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { control, handleSubmit, getValues, reset } = useForm({
        defaultValues: {
            Search: '',
            CategoryId: '',
            Priority: '',
        },
    })

    const { filterData, setFilterData } = useAnnouncements()

    const priorityOptions = [
        { label: 'Thấp', value: 'Low' },
        { label: 'Bình thường', value: 'Normal' },
        { label: 'Cao', value: 'High' },
        { label: 'Nghiêm trọng', value: 'Critical' },
    ]

    // Hàm áp dụng filter
    const applyFilters = (data) => {
        setFilterData({
            ...filterData,
            Search: data.Search?.trim() || undefined,
            CategoryId: data.CategoryId?.trim() || undefined,
            Priority: data.Priority || undefined,
        })
        setFilterIsOpen(false)
    }

    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1 min-w-[300px]">
                    <Controller
                        name="Search"
                        control={control}
                        render={({ field }) => (
                            <DebouceInput
                                placeholder="Tìm kiếm thông báo (tiêu đề, tóm tắt...)"
                                suffix={<TbSearch className="text-lg" />}
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                }}
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
                title="Bộ lọc thông báo"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={400}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto h-[calc(100%-100px)]">
                        {/* CategoryId */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="CategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Nhập ID hoặc tên danh mục"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Priority */}
                        <FormItem label="Độ ưu tiên">
                            <Controller
                                name="Priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={priorityOptions}
                                        placeholder="Tất cả"
                                        value={getSelectValue(
                                            priorityOptions,
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
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <Button
                            variant="default"
                            type="button"
                            onClick={() => {
                                reset({
                                    Search: '',
                                    CategoryId: '',
                                    Priority: '',
                                })
                                setFilterData({}) // Xóa toàn bộ filter
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
