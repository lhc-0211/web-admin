import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'

import { apiCreateDocumentAdmin } from '@/services/DocumentsService'
import useAllIssuingAuthorities from '@/views/admin/user/issuing-authorities/hooks/useAllIssuingAuthorities'
import useAllCategories from '../../categories/hooks/useAllCategories'
import useAllFields from '../../fields/hooks/useAllFields'
import useAllTypes from '../../type/hooks/useAllTypes'
import useDocuments from '../hooks/useDocuments'

const createDocumentSchema = z.object({
    documentNumber: z.string().min(1, 'Vui lòng nhập số hiệu văn bản'),
    documentTypeId: z.string().min(1, 'Vui lòng chọn loại văn bản'),
    documentCategoryId: z.string().min(1, 'Vui lòng chọn danh mục tài liệu'),
    issuingAuthorityId: z.string().min(1, 'Vui lòng chọn cơ quan ban hành'),
    fieldIds: z.array(z.string().min(1)).optional(),
    summary: z.string().min(1, 'Vui lòng nhập trích yếu'),
    content: z.string().min(1, 'Vui lòng nhập nội dung chi tiết'),
    signerName: z.string().min(1, 'Vui lòng nhập tên người ký'),
    signerTitle: z.string().optional(),
    issuedDate: z.date({ required_error: 'Vui lòng chọn ngày ban hành' }),
    effectiveDate: z.date({ required_error: 'Vui lòng chọn ngày hiệu lực' }),
    expiryDate: z.date().optional().nullable(),
    status: z.enum(['Active', 'Inactive'], {
        required_error: 'Vui lòng chọn trạng thái',
    }),
    isPublic: z.boolean().default(true),
    isPinned: z.boolean().default(false),
    pinnedOrder: z.number().int().nonnegative().default(0),
    notes: z.string().optional(),
    attachmentFileIds: z.array(z.string().min(1)).optional(),
})

const DocumentsCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useDocuments()

    const { documentTypes = [], isLoading: loadingTypes } = useAllTypes()
    const { categories = [], isLoading: loadingCategories } = useAllCategories()
    const { issuingAuthorities = [], isLoading: loadingAuthorities } =
        useAllIssuingAuthorities()
    const { fields = [], isLoading: loadingFields } = useAllFields()

    const documentTypeOptions = documentTypes.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const categoryOptions = categories.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const authorityOptions = issuingAuthorities.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const fieldOptions = fields.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const statusOptions = [
        { label: 'Đang có hiệu lực', value: 'Active' },
        { label: 'Hết hiệu lực', value: 'Expired' },
        { label: 'Bị hủy bỏ', value: 'Cancelled' },
        { label: 'Nháp', value: 'Draft' },
    ]

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            documentNumber: '',
            documentTypeId: '',
            documentCategoryId: '',
            fieldIds: [],
            issuingAuthorityId: '',
            summary: '',
            content: '',
            signerName: '',
            signerTitle: '',
            issuedDate: new Date(),
            effectiveDate: new Date(),
            expiryDate: null,
            status: 'Active',
            isPublic: true,
            isPinned: false,
            pinnedOrder: 0,
            notes: '',
            attachmentFileIds: [],
        },
    })

    const isPinned = watch('isPinned')

    const onSubmit = async (data) => {
        try {
            const body = {
                documentNumber: data.documentNumber,
                documentTypeId: data.documentTypeId,
                documentCategoryId: data.documentCategoryId,
                fieldIds: data.fieldIds || [],
                issuingAuthorityId: data.issuingAuthorityId,
                summary: data.summary,
                content: data.content || null,
                signerName: data.signerName,
                signerTitle: data.signerTitle || null,
                issuedDate: data.issuedDate.toISOString(),
                effectiveDate: data.effectiveDate.toISOString(),
                expiryDate: data.expiryDate
                    ? data.expiryDate.toISOString()
                    : null,
                status: data.status,
                isPublic: data.isPublic,
                isPinned: data.isPinned,
                pinnedOrder: data.isPinned ? data.pinnedOrder : 0,
                notes: data.notes || null,
                attachmentFileIds: data.attachmentFileIds || [],
            }

            await apiCreateDocumentAdmin(body)

            mutate()
            onClose()
            reset()

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo tài liệu <strong>{data.documentNumber}</strong> thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi tạo tài liệu:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo tài liệu thất bại:{' '}
                    {error?.response?.data?.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={1100}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo tài liệu mới
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Số hiệu văn bản */}
                        <FormItem
                            label={
                                <span>
                                    Số hiệu văn bản{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="documentNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="VD: 01/2025/QĐ-UBND"
                                        {...field}
                                        invalid={!!errors.documentNumber}
                                    />
                                )}
                            />
                            {errors.documentNumber && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />{' '}
                                    {errors.documentNumber.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Loại văn bản */}
                        <FormItem
                            label={
                                <span>
                                    Loại văn bản{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="documentTypeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={documentTypeOptions}
                                        value={documentTypeOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder={
                                            loadingTypes
                                                ? 'Đang tải...'
                                                : 'Chọn loại văn bản'
                                        }
                                        isLoading={loadingTypes}
                                        isSearchable
                                    />
                                )}
                            />
                            {errors.documentTypeId && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />{' '}
                                    {errors.documentTypeId.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Danh mục tài liệu (trước đây là Lĩnh vực) */}
                        <FormItem
                            label={
                                <span>
                                    Danh mục tài liệu{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="documentCategoryId"
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
                                                : 'Chọn danh mục'
                                        }
                                        isLoading={loadingCategories}
                                        isSearchable
                                    />
                                )}
                            />
                            {errors.documentCategoryId && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />{' '}
                                    {errors.documentCategoryId.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Cơ quan ban hành */}
                        <FormItem
                            label={
                                <span>
                                    Cơ quan ban hành{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="issuingAuthorityId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={authorityOptions}
                                        value={authorityOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value ?? '')
                                        }
                                        placeholder={
                                            loadingAuthorities
                                                ? 'Đang tải...'
                                                : 'Chọn cơ quan'
                                        }
                                        isLoading={loadingAuthorities}
                                        isSearchable
                                    />
                                )}
                            />
                            {errors.issuingAuthorityId && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />{' '}
                                    {errors.issuingAuthorityId.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Lĩnh vực tài liệu - Cho phép chọn nhiều */}
                        <FormItem label="Lĩnh vực tài liệu (có thể chọn nhiều)">
                            <Controller
                                name="fieldIds"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti // ← Quan trọng: cho phép chọn nhiều
                                        options={fieldOptions}
                                        value={fieldOptions.filter((opt) =>
                                            field.value?.includes(opt.value),
                                        )}
                                        onChange={(selectedOptions) => {
                                            const values = selectedOptions
                                                ? selectedOptions.map(
                                                      (opt) => opt.value,
                                                  )
                                                : []
                                            field.onChange(values)
                                        }}
                                        placeholder={
                                            loadingFields
                                                ? 'Đang tải...'
                                                : 'Chọn lĩnh vực tài liệu'
                                        }
                                        isLoading={loadingFields}
                                        isSearchable
                                        closeMenuOnSelect={false} // Giữ menu mở khi chọn nhiều
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Người ký */}
                        <FormItem
                            label={
                                <span>
                                    Người ký{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="signerName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Họ và tên người ký"
                                        {...field}
                                        invalid={!!errors.signerName}
                                    />
                                )}
                            />
                            {errors.signerName && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <HiExclamationCircle />{' '}
                                    {errors.signerName.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Chức vụ người ký */}
                        <FormItem label="Chức vụ người ký (tùy chọn)">
                            <Controller
                                name="signerTitle"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="VD: Chủ tịch UBND"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Ngày ban hành */}
                        <FormItem
                            label={
                                <span>
                                    Ngày ban hành{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="issuedDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.issuedDate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.issuedDate.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Ngày hiệu lực */}
                        <FormItem
                            label={
                                <span>
                                    Ngày hiệu lực{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="effectiveDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.effectiveDate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.effectiveDate.message}
                                </p>
                            )}
                        </FormItem>

                        {/* Ngày hết hiệu lực */}
                        <FormItem label="Ngày hết hiệu lực (tùy chọn)">
                            <Controller
                                name="expiryDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholder="Chọn ngày"
                                        value={field.value || undefined}
                                        onChange={(date) =>
                                            field.onChange(date || null)
                                        }
                                        clearable
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Trạng thái */}
                        <FormItem
                            label={
                                <span>
                                    Trạng thái{' '}
                                    <span className="text-red-600">*</span>
                                </span>
                            }
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={statusOptions}
                                        value={statusOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(
                                                opt?.value ?? 'Active',
                                            )
                                        }
                                        placeholder="Chọn trạng thái"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Công khai & Ghim */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <FormItem label="Công khai trên hệ thống">
                                <Controller
                                    name="isPublic"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Ghim tài liệu lên đầu">
                                <Controller
                                    name="isPinned"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormItem>

                            {isPinned && (
                                <FormItem label="Thứ tự ghim (số nhỏ hơn hiển thị trước)">
                                    <Controller
                                        name="pinnedOrder"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            )}
                        </div>
                    </div>

                    {/* Trích yếu */}
                    <FormItem
                        label={
                            <span>
                                Trích yếu{' '}
                                <span className="text-red-600">*</span>
                            </span>
                        }
                        className="md:col-span-2"
                    >
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Tóm tắt nội dung chính của văn bản"
                                    {...field}
                                    invalid={!!errors.summary}
                                />
                            )}
                        />
                        {errors.summary && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.summary.message}
                            </p>
                        )}
                    </FormItem>

                    {/* Nội dung chi tiết & Ghi chú */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Nội dung chi tiết">
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={5}
                                        placeholder="Nội dung đầy đủ văn bản (nếu có)"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Ghi chú (tùy chọn)">
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={5}
                                        placeholder="Ghi chú nội bộ"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </form>

                <div className="border-t px-8 py-5 bg-gray-50 flex justify-end gap-4">
                    <Button variant="default" size="lg" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        size="lg"
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Tạo tài liệu
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default DocumentsCreateModal
