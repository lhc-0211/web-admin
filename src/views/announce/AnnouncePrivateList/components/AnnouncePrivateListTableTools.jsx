import DebouceInput from '@/components/shared/DebouceInput'
import Select from '@/components/ui/Select'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbSearch } from 'react-icons/tb'
import { useAnnouncementCategories } from '../hooks/useAnnouncementCategories'

export default function AnnouncePrivateListTableTools({ onSubmit }) {
    const { control, watch } = useForm({
        defaultValues: {
            Search: '',
            CategoryId: '',
            Priority: '',
            Status: '',
        },
    })

    const { options: categoryOptions, isLoading } = useAnnouncementCategories()

    const watchAllFields = watch()

    React.useEffect(() => {
        // Map form fields sang param API
        const params = {
            query: watchAllFields.Search || undefined,
            categoryId: watchAllFields.CategoryId || undefined,
            priority: watchAllFields.Priority || undefined,
            status: watchAllFields.Status || undefined,
        }

        // Gọi callback khi form thay đổi
        onSubmit?.(params)
    }, [watchAllFields])

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

    return (
        <div className="flex flex-col md:flex-row gap-2 w-full">
            {/* Search input */}
            <div className="flex-1 min-w-[150px]">
                <Controller
                    name="Search"
                    control={control}
                    render={({ field }) => (
                        <DebouceInput
                            placeholder="Tìm kiếm nhanh..."
                            suffix={<TbSearch />}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-full"
                        />
                    )}
                />
            </div>

            {/* Category */}
            <div className="flex-1 min-w-[150px]">
                <Controller
                    name="CategoryId"
                    control={control}
                    render={({ field }) => {
                        const value = field.value
                            ? categoryOptions.find(
                                  (option) => option.value === field.value,
                              )
                            : null
                        return (
                            <Select
                                options={categoryOptions}
                                placeholder="Tất cả danh mục"
                                value={value}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                isClearable
                                isLoading={isLoading}
                            />
                        )
                    }}
                />
            </div>

            {/* Priority */}
            <div className="flex-1 min-w-[150px]">
                <Controller
                    name="Priority"
                    control={control}
                    render={({ field }) => {
                        const value = field.value
                            ? priorityOptions.find(
                                  (option) => option.value === field.value,
                              )
                            : null
                        return (
                            <Select
                                options={priorityOptions}
                                placeholder="Tất cả mức độ ưu tiên"
                                value={value}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )
                    }}
                />
            </div>

            {/* Status */}
            <div className="flex-1 min-w-[150px]">
                <Controller
                    name="Status"
                    control={control}
                    render={({ field }) => {
                        const value = field.value
                            ? statusOptions.find(
                                  (option) => option.value === field.value,
                              )
                            : null
                        return (
                            <Select
                                options={statusOptions}
                                placeholder="Tất cả trạng thái"
                                value={value}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )
                    }}
                />
            </div>
        </div>
    )
}
