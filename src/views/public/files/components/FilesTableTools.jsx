import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import useEmployeeAll from '@/views/admin/employees/EmployeeList/hooks/useEmployeeAll'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useFiles from '../hooks/useFiles' // Hook quản lý filter & table data

export default function FilesTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)
    const { filterData, setFilterData } = useFiles()

    const { users = [], isLoading: loadingUsers } = useEmployeeAll?.() || {
        users: [],
        isLoading: false,
    }

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            Search: filterData.Search || '',
            Category: filterData.Category || '',
            UploadedById: filterData.UploadedById || '',
            IsOrphaned: filterData.IsOrphaned ?? '',
            FromDate: filterData.FromDate
                ? new Date(filterData.FromDate)
                : null,
            ToDate: filterData.ToDate ? new Date(filterData.ToDate) : null,
        },
    })

    // Options cố định
    const categoryOptions = [
        { label: 'Hình ảnh', value: 'Image' },
        { label: 'Tài liệu', value: 'Document' },
        { label: 'Video', value: 'Video' },
        { label: 'Âm thanh', value: 'Audio' },
        { label: 'Nén (Archive)', value: 'Archive' },
        { label: 'Khác', value: 'Other' },
    ]

    const booleanOptions = [
        { label: 'Có', value: true },
        { label: 'Không', value: false },
    ]

    const userOptions = users.map((user) => ({
        label: user.fullName || user.email || user.username,
        value: user.id,
    }))

    const getSelectValue = (options, value) =>
        value !== '' && value !== undefined && value !== null
            ? options.find((opt) => opt.value === value)
            : null

    // Áp dụng bộ lọc
    const applyFilters = (data) => {
        const cleanedData = {
            Search: data.Search?.trim() || undefined,
            Category: data.Category || undefined,
            UploadedById: data.UploadedById || undefined,
            IsOrphaned: data.IsOrphaned !== '' ? data.IsOrphaned : undefined,
            FromDate: data.FromDate ? data.FromDate.toISOString() : undefined,
            ToDate: data.ToDate ? data.ToDate.toISOString() : undefined,
        }

        setFilterData(cleanedData)
        setFilterIsOpen(false)
    }

    // Xóa bộ lọc
    const clearFilters = () => {
        reset({
            Search: '',
            Category: '',
            UploadedById: '',
            IsOrphaned: '',
            FromDate: null,
            ToDate: null,
        })
        setFilterData({})
        setFilterIsOpen(false)
    }

    return (
        <>
            {/* Thanh tìm kiếm + nút lọc */}
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
                <Button
                    icon={<TbFilter />}
                    variant="default"
                    onClick={() => setFilterIsOpen(true)}
                >
                    Bộ lọc
                </Button>
            </div>

            {/* Drawer bộ lọc */}
            <Drawer
                title="Bộ lọc file"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={450}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto pb-20">
                        {/* Danh mục file */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="Category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={categoryOptions}
                                        value={getSelectValue(
                                            categoryOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả danh mục"
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Người tải lên */}
                        <FormItem label="Người tải lên">
                            <Controller
                                name="UploadedById"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={userOptions}
                                        value={getSelectValue(
                                            userOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả người dùng"
                                        isClearable
                                        isSearchable
                                        isLoading={loadingUsers}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* File không sử dụng */}
                        <FormItem label="File không sử dụng (Orphaned)">
                            <Controller
                                name="IsOrphaned"
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

                        {/* Ngày tải lên */}
                        <FormItem label="Ngày tải lên từ">
                            <Controller
                                name="FromDate"
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

                        <FormItem label="Đến ngày">
                            <Controller
                                name="ToDate"
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

                    {/* Nút hành động cố định dưới cùng */}
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
