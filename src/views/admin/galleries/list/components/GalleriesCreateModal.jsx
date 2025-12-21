import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { apiCreateGalleryAdmin } from '@/services/GalleyService'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { HiExclamationCircle } from 'react-icons/hi'
import * as z from 'zod'
import useAllCategories from '../../categories/hooks/useAllCategories'
import useGalleries from '../hooks/useGalleries'

// Schema validation đầy đủ cho Gallery
const createGallerySchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề bộ sưu tập'),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
    status: z.enum(['Draft', 'Published'], {
        required_error: 'Vui lòng chọn trạng thái',
    }),
    isPublic: z.boolean().default(true),
    isActive: z.boolean().default(true),
    isPinned: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
    featuredRank: z.number().int().min(0).default(0),
    autoPlay: z.boolean().default(true),
    autoPlayInterval: z.number().int().min(1000).max(30000).optional(),
    showIndicators: z.boolean().default(true),
    showControls: z.boolean().default(true),
    loop: z.boolean().default(true),
    pauseOnHover: z.boolean().default(true),
    transitionEffect: z.string().optional(),
    transitionDuration: z.number().int().min(100).max(5000).optional(),
    aspectRatio: z.string().optional(),
    fullWidth: z.boolean().default(true),
    scheduledPublishAt: z.date().nullable().optional(),
    expiresAt: z.date().nullable().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
})

const GalleriesCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useGalleries()
    const { categories = [], isLoading: loadingCategories } = useAllCategories()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createGallerySchema),
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
            transitionEffect: 'slide',
            transitionDuration: 600,
            aspectRatio: '16:9',
            fullWidth: true,
            scheduledPublishAt: null,
            expiresAt: null,
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
        },
    })

    const statusOptions = [
        {
            label: 'Bản nháp',
            value: 'Draft',
        },
        {
            label: 'Lên lịch',
            value: 'Scheduled',
        },
        {
            label: 'Đã đăng',
            value: 'Published',
        },
        {
            label: 'Lưu trữ',
            value: 'Archived',
        },
    ]

    const autoPlay = watch('autoPlay')

    const onSubmit = async (data) => {
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
                transitionEffect: data.transitionEffect || null,
                transitionDuration: data.transitionDuration || null,
                aspectRatio: data.aspectRatio || null,
                fullWidth: data.fullWidth,
                scheduledPublishAt: data.scheduledPublishAt || null,
                expiresAt: data.expiresAt || null,
                metaTitle: data.metaTitle?.trim() || null,
                metaDescription: data.metaDescription?.trim() || null,
                metaKeywords: data.metaKeywords?.trim() || null,
            }

            await apiCreateGalleryAdmin(body)

            mutate(undefined, { revalidate: true })

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo bộ sưu tập <strong>{data.title}</strong> thành công!
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
                    Tạo bộ sưu tập thất bại: {message}
                </Notification>,
            )
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={900}>
            <div className="flex flex-col">
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Tạo bộ sưu tập mới
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col flex-1"
                >
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[55vh]">
                        {/* Thông tin cơ bản */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem
                                label={
                                    <span>
                                        Tiêu đề bộ sưu tập{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Input
                                                placeholder="Ví dụ: Banner trang chủ Tết 2026"
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

                            <FormItem
                                label={
                                    <span>
                                        Danh mục{' '}
                                        <span className="text-red-600">*</span>
                                    </span>
                                }
                            >
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

                            <FormItem label="Trạng thái">
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={statusOptions}
                                            value={statusOptions?.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value ?? '')
                                            }
                                            placeholder="Chọn trạng thái"
                                        />
                                    )}
                                />
                            </FormItem>

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
                                <FormItem label="Vòng lặp">
                                    <Controller
                                        name="loop"
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
                            )}
                        </div>

                        {/* Mô tả ngắn & đầy đủ */}
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
                            Tạo bộ sưu tập
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}

export default GalleriesCreateModal
