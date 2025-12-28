import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import { useAnnouncementCategories } from '../hooks/useAnnouncementCategories'
import useAnnouncePublicList from '../hooks/useAnnouncePublicList'

export default function AnnouncePublicListTableTools() {
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
    const { filterData, setFilterData } = useAnnouncePublicList()

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

    // Hàm lấy giá trị cho Select (để hiển thị đúng option đã chọn)
    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

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
                <div className="flex-1 min-w-[300px]">
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

            {/* Drawer Bộ lọc */}
            <Drawer
                title="Bộ lọc Danh sách công khai"
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
                        {/* Danh mục */}
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

                        {/* Độ ưu tiên */}
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

                        {/* Trạng thái */}
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
                                    Search: getValues('Search'), // giữ lại search hiện tại
                                    CategoryId: '',
                                    Priority: '',
                                    Status: '',
                                })
                                setFilterData({
                                    ...filterData,
                                    Search:
                                        getValues('Search')?.trim() ||
                                        undefined,
                                    CategoryId: undefined,
                                    Priority: undefined,
                                    Status: undefined,
                                })
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
