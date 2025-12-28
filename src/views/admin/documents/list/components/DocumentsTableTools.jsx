import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import useAllIssuingAuthorities from '@/views/admin/user/issuing-authorities/hooks/useAllIssuingAuthorities'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TbFilter } from 'react-icons/tb'
import useAllCategories from '../../categories/hooks/useAllCategories'
import useAllFields from '../../fields/hooks/useAllFields'
import useAllTypes from '../../type/hooks/useAllTypes'
import useDocuments from '../hooks/useDocuments'

export default function DocumentsTableTools() {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { filterData, setFilterData } = useDocuments()

    const { documentTypes = [], isLoading: loadingTypes } = useAllTypes()
    const { categories = [], isLoading: loadingCategories } = useAllCategories()
    const { fields = [], isLoading: loadingFields } = useAllFields()
    const { issuingAuthorities = [], isLoading: loadingAuthorities } =
        useAllIssuingAuthorities()

    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            Search: filterData.Search || '',
            DocumentTypeId: filterData.DocumentTypeId || '',
            DocumentCategoryId: filterData.DocumentCategoryId || '',
            FieldIds: filterData.FieldIds || [],
            IssuingAuthorityId: filterData.IssuingAuthorityId || '',
            Status: filterData.Status || '',
            IssuedDateFrom: filterData.IssuedDateFrom
                ? new Date(filterData.IssuedDateFrom)
                : null,
            IssuedDateTo: filterData.IssuedDateTo
                ? new Date(filterData.IssuedDateTo)
                : null,
            EffectiveDateFrom: filterData.EffectiveDateFrom
                ? new Date(filterData.EffectiveDateFrom)
                : null,
            EffectiveDateTo: filterData.EffectiveDateTo
                ? new Date(filterData.EffectiveDateTo)
                : null,
            ExpiryDateFrom: filterData.ExpiryDateFrom
                ? new Date(filterData.ExpiryDateFrom)
                : null,
            ExpiryDateTo: filterData.ExpiryDateTo
                ? new Date(filterData.ExpiryDateTo)
                : null,
            IsPublic: filterData.IsPublic ?? '',
            IsPinned: filterData.IsPinned ?? '',
        },
    })

    // Options cho các Select
    const typeOptions = documentTypes.map((item) => ({
        label: item.name,
        value: item.id,
    }))
    const categoryOptions = categories.map((item) => ({
        label: item.name,
        value: item.id,
    }))
    const fieldOptions = fields.map((item) => ({
        label: item.name,
        value: item.id,
    }))
    const authorityOptions = issuingAuthorities.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const statusOptions = [
        { label: 'Đang có hiệu lực', value: 'Active' },
        { label: 'Hết hiệu lực', value: 'Expired' },
        { label: 'Bị hủy bỏ', value: 'Cancelled' },
        { label: 'Nháp', value: 'Draft' },
    ]

    const booleanOptions = [
        { label: 'Có', value: true },
        { label: 'Không', value: false },
    ]

    const getSelectValue = (options, value) =>
        value ? options.find((opt) => opt.value === value) : null

    const getMultiSelectValue = (options, values) =>
        options.filter((opt) => values?.includes(opt.value))

    // Áp dụng bộ lọc
    const applyFilters = (data) => {
        const cleanedData = {
            Search: data.Search?.trim() || undefined,
            DocumentTypeId: data.DocumentTypeId || undefined,
            DocumentCategoryId: data.DocumentCategoryId || undefined,
            FieldIds: data.FieldIds?.length > 0 ? data.FieldIds : undefined,
            IssuingAuthorityId: data.IssuingAuthorityId || undefined,
            Status: data.Status || undefined,
            IssuedDateFrom: data.IssuedDateFrom
                ? data.IssuedDateFrom.toISOString()
                : undefined,
            IssuedDateTo: data.IssuedDateTo
                ? data.IssuedDateTo.toISOString()
                : undefined,
            EffectiveDateFrom: data.EffectiveDateFrom
                ? data.EffectiveDateFrom.toISOString()
                : undefined,
            EffectiveDateTo: data.EffectiveDateTo
                ? data.EffectiveDateTo.toISOString()
                : undefined,
            ExpiryDateFrom: data.ExpiryDateFrom
                ? data.ExpiryDateFrom.toISOString()
                : undefined,
            ExpiryDateTo: data.ExpiryDateTo
                ? data.ExpiryDateTo.toISOString()
                : undefined,
            IsPublic: data.IsPublic !== '' ? data.IsPublic : undefined,
            IsPinned: data.IsPinned !== '' ? data.IsPinned : undefined,
        }

        setFilterData(cleanedData)
        setFilterIsOpen(false)
    }

    // Xóa bộ lọc
    const clearFilters = () => {
        reset({
            Search: '',
            DocumentTypeId: '',
            DocumentCategoryId: '',
            FieldIds: [],
            IssuingAuthorityId: '',
            Status: '',
            IssuedDateFrom: null,
            IssuedDateTo: null,
            EffectiveDateFrom: null,
            EffectiveDateTo: null,
            ExpiryDateFrom: null,
            ExpiryDateTo: null,
            IsPublic: '',
            IsPinned: '',
        })
        setFilterData({})
        setFilterIsOpen(false)
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                <div className="flex-1 min-w-[300px]">
                    <DebounceInput
                        placeholder="Tìm kiếm tài liệu (số hiệu, trích yếu, người ký...)"
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

            {/* Drawer bộ lọc */}
            <Drawer
                title="Bộ lọc Quản lý tài liệu"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                width={500}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(applyFilters)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="space-y-6 overflow-y-auto pb-20">
                        {/* Loại văn bản */}
                        <FormItem label="Loại văn bản">
                            <Controller
                                name="DocumentTypeId"
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

                        {/* Danh mục tài liệu */}
                        <FormItem label="Danh mục tài liệu">
                            <Controller
                                name="DocumentCategoryId"
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
                                        placeholder="Tất cả"
                                        isLoading={loadingCategories}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Lĩnh vực tài liệu (chọn nhiều) */}
                        <FormItem label="Lĩnh vực tài liệu">
                            <Controller
                                name="FieldIds"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={fieldOptions}
                                        value={getMultiSelectValue(
                                            fieldOptions,
                                            field.value,
                                        )}
                                        onChange={(opts) =>
                                            field.onChange(
                                                opts
                                                    ? opts.map((o) => o.value)
                                                    : [],
                                            )
                                        }
                                        placeholder="Chọn lĩnh vực (có thể nhiều)"
                                        isLoading={loadingFields}
                                        isSearchable
                                        closeMenuOnSelect={false}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Cơ quan ban hành */}
                        <FormItem label="Cơ quan ban hành">
                            <Controller
                                name="IssuingAuthorityId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={authorityOptions}
                                        value={getSelectValue(
                                            authorityOptions,
                                            field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder="Tất cả"
                                        isLoading={loadingAuthorities}
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

                        {/* Công khai & Ghim */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem label="Công khai">
                                <Controller
                                    name="IsPublic"
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
                            <FormItem label="Ghim">
                                <Controller
                                    name="IsPinned"
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

                        {/* Ngày ban hành */}
                        <FormItem label="Ngày ban hành từ">
                            <Controller
                                name="IssuedDateFrom"
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
                                name="IssuedDateTo"
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

                        {/* Ngày hiệu lực */}
                        <FormItem label="Ngày hiệu lực từ">
                            <Controller
                                name="EffectiveDateFrom"
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
                                name="EffectiveDateTo"
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

                        {/* Ngày hết hiệu lực */}
                        <FormItem label="Ngày hết hiệu lực từ">
                            <Controller
                                name="ExpiryDateFrom"
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
                                name="ExpiryDateTo"
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
