import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateNewPublic } from '@/services/NewsService'
import useAllTags from '@/views/admin/news/tags/hooks/useAllTags'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiUploadCloud } from 'react-icons/fi'
import { z } from 'zod'
import useAllCategories from '../hooks/useAllCategories'

// Định nghĩa schema validation bằng zod
const createNewsSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề bài viết'),
    summary: z.string().min(1, 'Vui lòng nhập tóm tắt'),
    content: z.string().min(1, 'Vui lòng nhập nội dung bài viết'),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
    featuredImageId: z.string().nullable().optional(),
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    metaKeywords: z.string().nullable().optional(),
    scheduledPublishAt: z.date().nullable().optional(),
    tagIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một tag'),
})

const NewsCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const { categories } = useAllCategories()
    const { tags } = useAllTags()

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(createNewsSchema),
        defaultValues: {
            title: '',
            summary: '',
            content: '',
            categoryId: '',
            featuredImageId: '',
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            scheduledPublishAt: null,
            tagIds: [],
        },
    })

    const handleClose = useCallback(() => {
        reset()
        onClose()
    }, [reset, onClose])

    const onSubmit = async (data) => {
        try {
            const payload = {
                title: data.title.trim(),
                summary: data.summary?.trim() || '',
                content: data.content?.trim() || '',
                categoryId: data.categoryId,
                featuredImageId: data.featuredImageId || null,
                metaTitle: data.metaTitle?.trim() || null,
                metaDescription: data.metaDescription?.trim() || null,
                metaKeywords: data.metaKeywords?.trim() || null,
                scheduledPublishAt: data.scheduledPublishAt
                    ? data.scheduledPublishAt.toISOString()
                    : null,
                tagIds: data.tagIds,
            }

            await apiCreateNewPublic(payload)

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo bài viết thành công!
                </Notification>,
            )

            onSuccess?.()
            handleClose()
        } catch (error) {
            console.error('Create news error:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo bài viết thất bại! Vui lòng thử lại.
                </Notification>,
            )
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6 overflow-y-auto max-h-[78vh]"
            >
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-bold">Tạo bài viết mới</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột trái */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <Input
                                {...register('title')}
                                placeholder="Nhập tiêu đề bài viết"
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tóm tắt <span className="text-red-500">*</span>
                            </label>
                            <Input
                                textArea
                                rows={4}
                                {...register('summary')}
                                placeholder="Tóm tắt ngắn gọn nội dung bài viết"
                                disabled={isSubmitting}
                            />
                            {errors.summary && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.summary.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={categoryOptions}
                                        value={categoryOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value || '')
                                        }
                                        placeholder="Chọn danh mục"
                                        isDisabled={isSubmitting}
                                    />
                                )}
                            />
                            {errors.categoryId && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="tagIds"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={tagOptions}
                                        isMulti
                                        value={tagOptions.filter((opt) =>
                                            field.value.includes(opt.value),
                                        )}
                                        onChange={(options) =>
                                            field.onChange(
                                                options
                                                    ? options.map(
                                                          (opt) => opt.value,
                                                      )
                                                    : [],
                                            )
                                        }
                                        placeholder="Chọn các tag liên quan"
                                        isDisabled={isSubmitting}
                                    />
                                )}
                            />
                            {errors.tagIds && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tagIds.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ảnh đại diện (Featured Image)
                            </label>
                            {/* Bạn có thể tích hợp MediaPicker ở đây và setValue('featuredImageId', id) */}
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer`}
                            >
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <FiUploadCloud className="w-12 h-12 text-blue-500" />
                                    <p className="text-base font-medium text-gray-700">
                                        Kéo thả file vào đây hoặc click để chọn
                                    </p>
                                </div>
                            </div>
                            {/* Ví dụ: khi chọn ảnh xong */}
                            {/* <button type="button" onClick={() => setValue('featuredImageId', '123')}>Set image ID</button> */}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian đăng lịch
                            </label>
                            <Controller
                                name="scheduledPublishAt"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        showTimeSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Chọn ngày giờ đăng (tùy chọn)"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (SEO)
                            </label>
                            <Input
                                {...register('metaTitle')}
                                placeholder="Tiêu đề SEO (tùy chọn)"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (SEO)
                            </label>
                            <Input
                                textArea
                                rows={3}
                                {...register('metaDescription')}
                                placeholder="Mô tả SEO (tùy chọn)"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords (SEO)
                            </label>
                            <Input
                                {...register('metaKeywords')}
                                placeholder="Từ khóa cách nhau bằng dấu phẩy"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Nội dung bài viết */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung bài viết{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        textArea
                        rows={10}
                        {...register('content')}
                        placeholder="Viết nội dung chi tiết bài viết tại đây..."
                        disabled={isSubmitting}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.content.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                        variant="default"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        color="blue-600"
                        loading={isSubmitting}
                    >
                        Tạo bài viết
                    </Button>
                </div>
            </form>
        </Dialog>
    )
}

export default NewsCreateModal
