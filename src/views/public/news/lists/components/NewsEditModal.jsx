import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiUpdateNewPublic } from '@/services/NewsService' // API update
import useAllTags from '@/views/admin/news/tags/hooks/useAllTags'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiUploadCloud } from 'react-icons/fi'
import { z } from 'zod'
import useAllCategories from '../hooks/useAllCategories'

const editNewsSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề bài viết'),
    summary: z.string().optional(),
    content: z.string().min(1, 'Vui lòng nhập nội dung bài viết'),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
    featuredImageId: z.string().nullable().optional(),
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    metaKeywords: z.string().nullable().optional(),
    scheduledPublishAt: z.date().nullable().optional(),
    tagIds: z.array(z.string()).default([]),
})

const NewsEditModal = ({ isOpen, onClose, onSuccess, news }) => {
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
        setValue,
    } = useForm({
        resolver: zodResolver(editNewsSchema),
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

    // Load dữ liệu bài viết vào form khi modal mở hoặc news thay đổi
    useEffect(() => {
        if (news && isOpen) {
            reset({
                title: news.title || '',
                summary: news.summary || '',
                content: news.content || '',
                categoryId: news.categoryId || '',
                featuredImageId: news.featuredImageId || '',
                metaTitle: news.metaTitle || '',
                metaDescription: news.metaDescription || '',
                metaKeywords: news.metaKeywords || '',
                scheduledPublishAt: news.scheduledPublishAt
                    ? new Date(news.scheduledPublishAt)
                    : null,
                tagIds: news.tagIds || [],
            })
        }
    }, [news, isOpen, reset])

    const handleClose = useCallback(() => {
        reset()
        onClose()
    }, [reset, onClose])

    const onSubmit = async (data) => {
        if (!news?.id) return

        try {
            const payload = {
                title: data.title.trim(),
                summary: data.summary?.trim() || null,
                content: data.content.trim(),
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

            await apiUpdateNewPublic(news.id, payload)

            toast.push(
                <Notification title="Thành công" type="success">
                    Cập nhật bài viết thành công!
                </Notification>,
            )

            onSuccess?.()
            handleClose()
        } catch (error) {
            console.error('Update news error:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật bài viết thất bại! Vui lòng thử lại.
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
                    <h5 className="text-xl font-bold">Chỉnh sửa bài viết</h5>
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
                                Tóm tắt
                            </label>
                            <Input
                                textArea
                                rows={4}
                                {...register('summary')}
                                placeholder="Tóm tắt ngắn gọn nội dung bài viết"
                                disabled={isSubmitting}
                            />
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
                                Tags
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
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ảnh đại diện (Featured Image)
                            </label>
                            <div className="relative border-2 border-dashed rounded-lg p-8 text-center border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <FiUploadCloud className="w-12 h-12 text-blue-500" />
                                    <p className="text-base font-medium text-gray-700">
                                        Kéo thả file hoặc click để thay đổi ảnh
                                    </p>
                                </div>
                            </div>
                            {/* Nếu đã có ảnh, có thể hiển thị preview ở đây */}
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
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords (SEO)
                            </label>
                            <Input
                                {...register('metaKeywords')}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung bài viết
                    </label>
                    <Input
                        textArea
                        rows={10}
                        {...register('content')}
                        placeholder="Nội dung chi tiết bài viết..."
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
                        Cập nhật bài viết
                    </Button>
                </div>
            </form>
        </Dialog>
    )
}

export default NewsEditModal
