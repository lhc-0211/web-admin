import DebouceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter, TbSearch } from 'react-icons/tb'
import useAllCategories from '../../categories/hooks/userAllCategories'
import useAllTags from '../../tags/hooks/useAllTags'
import useNews from '../hooks/useNews'

export default function NewsTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            Search: '',
            CategoryId: '',
            TagIds: [], // mảng ID tags
            Status: '',
        },
    })

    const { filterData, setFilterData } = useNews()

    // Lấy danh mục và tags
    const { categories, isLoading: loadingCategories } = useAllCategories()
    const { tags, isLoading: loadingTags } = useAllTags()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }))

    const statusOptions = [
        { label: 'Nháp', value: 'Draft' },
        { label: 'Đã đăng', value: 'Published' },
        { label: 'Đã lưu trữ', value: 'Archived' },
    ]

    // Hàm áp dụng filter
    const applyFilters = (data) => {
        setFilterData({
            ...filterData,
            Search: data.Search?.trim() || undefined,
            CategoryId: data.CategoryId || undefined,
            TagIds: data.TagIds.length > 0 ? data.TagIds : undefined,
            Status: data.Status || undefined,
        })
        setFilterIsOpen(false)
    }

    const handleClearFilters = () => {
        reset({
            Search: '',
            CategoryId: '',
            TagIds: [],
            Status: '',
        })
        setFilterData({})
        setFilterIsOpen(false)
    }

    return (
        <>
            {/* Thanh tìm kiếm nhanh */}
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1 min-w-[300px]">
                    <Controller
                        name="Search"
                        control={control}
                        render={({ field }) => (
                            <DebouceInput
                                placeholder="Tìm kiếm tin tức (tiêu đề, tóm tắt...)"
                                suffix={<TbSearch className="text-lg" />}
                                {...field}
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
                title="Bộ lọc tin tức"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={450}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between "
                >
                    <div className="space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
                        {/* Danh mục */}
                        <FormItem label="Danh mục">
                            <Controller
                                name="CategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={categoryOptions}
                                        value={categoryOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder={
                                            loadingCategories
                                                ? 'Đang tải...'
                                                : 'Tất cả'
                                        }
                                        isLoading={loadingCategories}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Tags (multi-select) */}
                        <FormItem label="Tags">
                            <Controller
                                name="TagIds"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={tagOptions}
                                        value={tagOptions.filter((opt) =>
                                            field.value?.includes(opt.value),
                                        )}
                                        onChange={(opts) =>
                                            field.onChange(
                                                opts.map((opt) => opt.value),
                                            )
                                        }
                                        isMulti
                                        placeholder={
                                            loadingTags
                                                ? 'Đang tải...'
                                                : 'Chọn tags'
                                        }
                                        isLoading={loadingTags}
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
                                        value={statusOptions.find(
                                            (opt) => opt.value === field.value,
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

                    {/* Nút hành động */}
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <Button
                            variant="default"
                            type="button"
                            onClick={handleClearFilters}
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
