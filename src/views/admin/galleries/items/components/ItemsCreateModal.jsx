import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { apiCreateGalleryCategoryAdmin } from '@/services/GalleyService'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useCategories from '../hooks/useItems'

// Schema validation - thêm code và các rule hợp lý
const createCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Vui lòng nhập tên danh mục')
        .max(100, 'Tên quá dài'),
    description: z.string().optional(),
    displayOrder: z
        .number({ invalid_type_error: 'Thứ tự phải là số' })
        .int('Phải là số nguyên')
        .min(0, 'Thứ tự phải ≥ 0')
        .default(0),
    isActive: z.boolean().default(true),
})

const ItemsCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useCategories()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            displayOrder: 0,
            isActive: true,
        },
    })

    const onSubmit = async (data) => {
        try {
            const body = {
                name: data.name.trim(),
                description: data.description?.trim() || null,
                displayOrder: Number(data.displayOrder),
                isActive: data.isActive,
            }

            await apiCreateGalleryCategoryAdmin(body)

            // Refetch danh sách danh mục
            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo danh mục <strong>{data.name}</strong> thành công!
                </Notification>,
            )

            handleClose()
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Vui lòng thử lại!'

            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo danh mục thất bại: {message}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={700}>
            <div className="flex flex-col">
                {/* Header */}
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo danh mục mới
                    </h3>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col flex-1"
                >
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tên danh mục */}
                            <FormItem
                                label={
                                    <span>
                                        Tên danh mục{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Ví dụ: Tin tức chung"
                                                autoFocus
                                                {...field}
                                                invalid={!!errors.name}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Thứ tự hiển thị */}
                            <FormItem label="Thứ tự hiển thị">
                                <Controller
                                    name="displayOrder"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ''
                                                            ? 0
                                                            : parseInt(
                                                                  e.target
                                                                      .value,
                                                                  10,
                                                              ),
                                                    )
                                                }
                                                invalid={!!errors.displayOrder}
                                            />
                                            {errors.displayOrder && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle className="text-lg" />
                                                    {
                                                        errors.displayOrder
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Trạng thái */}
                            <FormItem label="Trạng thái">
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={field.onChange}
                                            checkedContent="Hoạt động"
                                            unCheckedContent="Tạm dừng"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Mô tả */}
                        <FormItem label="Mô tả (tùy chọn)">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={4}
                                        placeholder="Mô tả ngắn gọn về mục đích của danh mục này..."
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Footer */}
                    <div className="border-t px-8 py-5 bg-gray-50 flex justify-end gap-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="solid"
                            size="lg"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Tạo danh mục
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}

export default ItemsCreateModal
