import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import { useAnnouncementCategories } from '../hooks/useAnnouncementCategories'
import useAnnouncePrivateList from '../hooks/useAnnouncePrivateList'

export default function AnnouncePrivateListTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { control, handleSubmit, getValues, reset, setValue } = useForm({
        defaultValues: {
            Search: '',
            CategoryId: '',
            Priority: '',
            Status: '',
        },
    })

    const { options: categoryOptions, isLoading: categoriesLoading } =
        useAnnouncementCategories()
    const { filterData, setFilterData } = useAnnouncePrivateList()

    const priorityOptions = [
        { label: 'Thấp', value: 'Low' },
        { label: 'Bình thường', value: 'Normal' },
        { label: 'Cao', value: 'High' },
        { label: 'Cực kỳ', value: 'Critical' },
    ]

    const statusOptions = [
        { label: 'Bản nháp', value: 'Draft' },
        { label: 'Đã lên lịch', value: 'Scheduled' },
        { label: 'Đã xuất bản', value: 'Published' },
        { label: 'Lưu trữ', value: 'Archived' },
    ]

    // Hàm lấy giá trị hiện tại cho Select
    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

    // Áp dụng filter
    const applyFilters = (data) => {
        setFilterData({
            ...filterData,
            Search: data.Search?.trim() || undefined,
            CategoryId: data.CategoryId?.trim() || undefined,
            Priority: data.Priority || undefined,
            Status: data.Status || undefined,
        })
        setFilterIsOpen(false)
    }

    const handleSearchChange = (value) => {
        setValue('Search', value)
        setFilterData({
            ...filterData,
            Search: data.Search?.trim() || undefined,
        })
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                {/* Search input */}
                <div className="flex-1 min-w-[300px]">
                    <Controller
                        name="Search"
                        control={control}
                        render={({ field }) => (
                            <DebounceInput
                                placeholder="Tìm kiếm file (tên, mô tả, alt text...)"
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
                        )}
                    />
                </div>

                {/* Nút mở bộ lọc */}
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
                title="Bộ lọc Danh sách nội bộ"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
                width={400}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto h-[calc(100%-100px)]">
                        {/* Category */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="CategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={categoryOptions}
                                        placeholder="Tất cả danh mục"
                                        value={getSelectValue(
                                            categoryOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        isClearable
                                        isLoading={categoriesLoading}
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
                                        placeholder="Tất cả mức độ ưu tiên"
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

                        {/* Status */}
                        <FormItem label="Trạng thái">
                            <Controller
                                name="Status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={statusOptions}
                                        placeholder="Tất cả trạng thái"
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
                                    Status: '',
                                })
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
