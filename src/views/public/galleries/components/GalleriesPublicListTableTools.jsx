import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker' // Giả sử dự án có DatePicker
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import useAllCategories from '@/views/admin/galleries/categories/hooks/useAllCategories'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useGalleries from '../hooks/useGalleriesPublicList'

const statusOptions = [
    { label: 'Bản nháp', value: 'Draft' },
    { label: 'Lên lịch', value: 'Scheduled' },
    { label: 'Đã đăng', value: 'Published' },
    { label: 'Lưu trữ', value: 'Archived' },
]

export default function GalleriesPublicListTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { filterData, setFilterData } = useGalleries()
    const { categories = [], isLoading: loadingCategories } = useAllCategories()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            Search: filterData.Search || '',
            CategoryId: filterData.CategoryId || '',
            Status: filterData.Status || '',
            IsPublic: filterData.IsPublic ?? null,
            IsActive: filterData.IsActive ?? null,
            IsPinned: filterData.IsPinned ?? null,
            SortDescending: filterData.SortDescending ?? true,
            PublishedFrom: filterData.PublishedFrom || null,
            PublishedTo: filterData.PublishedTo || null,
        },
    })

    // Áp dụng bộ lọc
    const applyFilters = (data) => {
        const cleanedData = {
            Search: data.Search?.trim() || undefined,
            CategoryId: data.CategoryId || undefined,
            Status: data.Status || undefined,
            IsPublic: data.IsPublic !== null ? data.IsPublic : undefined,
            IsActive: data.IsActive !== null ? data.IsActive : undefined,
            IsPinned: data.IsPinned !== null ? data.IsPinned : undefined,
            SortDescending: data.SortDescending,
            PublishedFrom: data.PublishedFrom || undefined,
            PublishedTo: data.PublishedTo || undefined,
        }

        setFilterData(cleanedData)
        setFilterIsOpen(false)
    }

    // Xóa toàn bộ bộ lọc
    const clearFilters = () => {
        reset({
            Search: '',
            CategoryId: '',
            Status: '',
            IsPublic: null,
            IsActive: null,
            IsPinned: null,
            SortDescending: true,
            PublishedFrom: null,
            PublishedTo: null,
        })
        setFilterData({})
        setFilterIsOpen(false)
    }

    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                {/* Ô tìm kiếm */}
                <div className="flex-1 min-w-[300px]">
                    <DebounceInput
                        placeholder="Tìm kiếm bộ sưu tập (tiêu đề, mô tả...)"
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

                {/* Nút mở bộ lọc */}
                <Button
                    icon={<TbFilter />}
                    variant="default"
                    onClick={() => setFilterIsOpen(true)}
                >
                    Bộ lọc
                </Button>
            </div>

            {/* Drawer bộ lọc nâng cao */}
            <Drawer
                title="Bộ lọc Danh sách công khai"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
                width={450}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto pb-4">
                        {/* Danh mục */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="CategoryId"
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
                                        isLoading={loadingCategories}
                                        isSearchable
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
                                        value={getSelectValue(
                                            statusOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả trạng thái"
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Thời gian đăng */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem label="Từ ngày">
                                <Controller
                                    name="PublishedFrom"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholder="Chọn ngày"
                                            value={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Đến ngày">
                                <Controller
                                    name="PublishedTo"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholder="Chọn ngày"
                                            value={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                            clearable
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Các switcher */}
                        <div className="space-y-4">
                            <FormItem label="Công khai">
                                <Controller
                                    name="IsPublic"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value === true}
                                            onChange={(checked) =>
                                                field.onChange(
                                                    checked
                                                        ? true
                                                        : checked === false
                                                          ? false
                                                          : null,
                                                )
                                            }
                                            checkedContent="Có"
                                            unCheckedContent="Không"
                                            indeterminate={
                                                !field.value &&
                                                field.value !== false
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Hoạt động">
                                <Controller
                                    name="IsActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value === true}
                                            onChange={(checked) =>
                                                field.onChange(
                                                    checked
                                                        ? true
                                                        : checked === false
                                                          ? false
                                                          : null,
                                                )
                                            }
                                            checkedContent="Có"
                                            unCheckedContent="Không"
                                            indeterminate={
                                                !field.value &&
                                                field.value !== false
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Ghim nổi bật">
                                <Controller
                                    name="IsPinned"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value === true}
                                            onChange={(checked) =>
                                                field.onChange(
                                                    checked
                                                        ? true
                                                        : checked === false
                                                          ? false
                                                          : null,
                                                )
                                            }
                                            checkedContent="Có"
                                            unCheckedContent="Không"
                                            indeterminate={
                                                !field.value &&
                                                field.value !== false
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Sắp xếp giảm dần">
                                <Controller
                                    name="SortDescending"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                            checkedContent="Mới nhất trước"
                                            unCheckedContent="Cũ nhất trước"
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
