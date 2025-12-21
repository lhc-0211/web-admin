import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { apiUpdateGalleryAdmin } from '@/services/GalleyService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useCategories from '../../categories/hooks/useCategories' // Hook lấy danh mục gallery
import useGalleries from '../hooks/useGalleries' // Hook đúng cho galleries

// Schema validation cho sửa Gallery
const editGallerySchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề bộ sưu tập'),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
    status: z.enum(['Draft', 'Scheduled', 'Published', 'Archived'], {
        required_error: 'Vui lòng chọn trạng thái',
    }),
    isPublic: z.boolean(),
    isActive: z.boolean(),
    isPinned: z.boolean(),
    displayOrder: z.number().int().min(0).default(0),
    featuredRank: z.number().int().min(0).default(0),
    autoPlay: z.boolean(),
    autoPlayInterval: z.number().int().min(1000).optional(),
    showIndicators: z.boolean(),
    showControls: z.boolean(),
    loop: z.boolean(),
    pauseOnHover: z.boolean(),
})

const GalleriesEditModal = ({ isOpen, onClose, gallery }) => {
    const { mutate } = useGalleries()
    const { categories = [], isLoading: loadingCategories } = useCategories()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const statusOptions = [
        { label: 'Bản nháp', value: 'Draft' },
        { label: 'Lên lịch', value: 'Scheduled' },
        { label: 'Đã đăng', value: 'Published' },
        { label: 'Lưu trữ', value: 'Archived' },
    ]

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editGallerySchema),
        defaultValues: {
            title: '',
            shortDescription: '',
            description: '',
            categoryId: '',
            status: 'Draft',
            isPublic: true,
            isActive: true,
            isPinned: false,
            displayOrder: 0,
            featuredRank: 0,
            autoPlay: true,
            autoPlayInterval: 5000,
            showIndicators: true,
            showControls: true,
            loop: true,
            pauseOnHover: true,
        },
    })

    const autoPlay = watch('autoPlay')

    // Reset form khi modal mở hoặc gallery thay đổi
    useEffect(() => {
        if (isOpen && gallery) {
            reset({
                title: gallery.title || '',
                shortDescription: gallery.shortDescription || '',
                description: gallery.description || '',
                categoryId: gallery.categoryId || '',
                status: gallery.status || 'Draft',
                isPublic: gallery.isPublic ?? true,
                isActive: gallery.isActive ?? true,
                isPinned: gallery.isPinned ?? false,
                displayOrder: gallery.displayOrder ?? 0,
                featuredRank: gallery.featuredRank ?? 0,
                autoPlay: gallery.autoPlay ?? true,
                autoPlayInterval: gallery.autoPlayInterval ?? 5000,
                showIndicators: gallery.showIndicators ?? true,
                showControls: gallery.showControls ?? true,
                loop: gallery.loop ?? true,
                pauseOnHover: gallery.pauseOnHover ?? true,
            })
        }
    }, [isOpen, gallery, reset])

    const onSubmit = async (data) => {
        if (!gallery?.id) return

        try {
            const body = {
                title: data.title.trim(),
                shortDescription: data.shortDescription?.trim() || null,
                description: data.description?.trim() || null,
                categoryId: data.categoryId,
                status: data.status,
                isPublic: data.isPublic,
                isActive: data.isActive,
                isPinned: data.isPinned,
                displayOrder: data.displayOrder,
                featuredRank: data.featuredRank,
                autoPlay: data.autoPlay,
                autoPlayInterval: data.autoPlay ? data.autoPlayInterval : null,
                showIndicators: data.showIndicators,
                showControls: data.showControls,
                loop: data.loop,
                pauseOnHover: data.pauseOnHover,
            }

            await apiUpdateGalleryAdmin(gallery.id, body)

            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật bộ sưu tập <strong>{data.title}</strong> thành
                    công!
                </Notification>,
            )

            onClose()
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Vui lòng thử lại!'

            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {message}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!isOpen || !gallery) return null

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                {/* Header */}
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sửa bộ sưu tập
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        ID:{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded">
                            {gallery.id}
                        </code>
                        {gallery.categoryName && (
                            <>
                                {' '}
                                | Danh mục:{' '}
                                <strong>{gallery.categoryName}</strong>
                            </>
                        )}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col flex-1"
                >
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[55vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tiêu đề */}
                            <FormItem label="Tiêu đề bộ sưu tập *">
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Ví dụ: Banner Tết 2026"
                                                autoFocus
                                                {...field}
                                                invalid={!!errors.title}
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle />
                                                    {errors.title.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Danh mục */}
                            <FormItem label="Danh mục *">
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                options={categoryOptions}
                                                value={categoryOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(
                                                        opt?.value ?? '',
                                                    )
                                                }
                                                placeholder={
                                                    loadingCategories
                                                        ? 'Đang tải...'
                                                        : 'Chọn danh mục'
                                                }
                                                isLoading={loadingCategories}
                                                isSearchable
                                            />
                                            {errors.categoryId && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <HiExclamationCircle />
                                                    {errors.categoryId.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </FormItem>

                            {/* Trạng thái */}
                            <FormItem label="Trạng thái">
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={statusOptions}
                                            value={statusOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(
                                                    opt?.value ?? 'Draft',
                                                )
                                            }
                                            placeholder="Chọn trạng thái"
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Thứ tự hiển thị */}
                            <FormItem label="Thứ tự hiển thị">
                                <Controller
                                    name="displayOrder"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Cấu hình hiển thị */}
                        <div className="border-t pt-6">
                            <h4 className="text-lg font-semibold mb-4">
                                Cấu hình hiển thị
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormItem label="Ghim nổi bật">
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
                                <FormItem label="Công khai">
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
                                <FormItem label="Hoạt động">
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <Switcher
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Tự động chạy">
                                    <Controller
                                        name="autoPlay"
                                        control={control}
                                        render={({ field }) => (
                                            <Switcher
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            {autoPlay && (
                                <div className="mt-4">
                                    <FormItem label="Thời gian chuyển slide (ms)">
                                        <Controller
                                            name="autoPlayInterval"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    min="1000"
                                                    max="30000"
                                                    step="500"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 5000,
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            )}
                        </div>

                        {/* Mô tả */}
                        <FormItem label="Mô tả ngắn (tùy chọn)">
                            <Controller
                                name="shortDescription"
                                control={control}
                                render={({ field }) => (
                                    <Input textArea rows={2} {...field} />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Mô tả chi tiết (tùy chọn)">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input textArea rows={4} {...field} />
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
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}

export default GalleriesEditModal
