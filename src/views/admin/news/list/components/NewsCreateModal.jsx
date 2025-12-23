import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiCreateNewPublic } from '@/services/NewsService' // API tạo bài viết
import { useSessionUser } from '@/store/authStore'
import { useCallback, useState } from 'react'
import useAllCategories from '../../categories/hooks/useAllCategories'
import useAllTags from '../../tags/hooks/useAllTags'
import useNews from '../hooks/useNews'

const NewsCreateModal = ({ isOpen, onClose }) => {
    const { mutate } = useNews()

    const { categories } = useAllCategories()
    const { tags } = useAllTags()
    const user = useSessionUser((state) => state.user)

    const categoryOptions = categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }))

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }))

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [featuredImageId, setFeaturedImageId] = useState('')
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')
    const [metaKeywords, setMetaKeywords] = useState('')
    const [scheduledPublishAt, setScheduledPublishAt] = useState(null)
    const [tagIds, setTagIds] = useState([])

    const resetForm = useCallback(() => {
        setTitle('')
        setSummary('')
        setContent('')
        setCategoryId('')
        setFeaturedImageId('')
        setMetaTitle('')
        setMetaDescription('')
        setMetaKeywords('')
        setScheduledPublishAt(null)
        setTagIds([])
    }, [])

    const handleClose = useCallback(() => {
        resetForm()
        onClose()
    }, [resetForm, onClose])

    const handleCreate = async () => {
        if (!title.trim()) {
            toast.push(
                <Notification title="Cảnh báo" type="warning">
                    Vui lòng nhập tiêu đề bài viết!
                </Notification>,
            )
            return
        }

        if (!categoryId) {
            toast.push(
                <Notification title="Cảnh báo" type="warning">
                    Vui lòng chọn danh mục!
                </Notification>,
            )
            return
        }

        setLoading(true)

        try {
            const payload = {
                authorId: user.id,
                title: title.trim(),
                summary: summary.trim(),
                content: content.trim(),
                categoryId,
                featuredImageId: featuredImageId || null,
                metaTitle: metaTitle.trim() || null,
                metaDescription: metaDescription.trim() || null,
                metaKeywords: metaKeywords.trim() || null,
                scheduledPublishAt: scheduledPublishAt
                    ? scheduledPublishAt.toISOString()
                    : null,
                tagIds,
            }

            await apiCreateNewPublic(payload)

            toast.push(
                <Notification title="Thành công" type="success">
                    Tạo bài viết thành công!
                </Notification>,
            )
            mutate()
            handleClose()
        } catch (error) {
            console.error('Create news error:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Tạo bài viết thất bại! Vui lòng thử lại.
                </Notification>,
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[78vh]">
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nhập tiêu đề bài viết"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tóm tắt
                            </label>
                            <Input
                                textArea
                                rows={4}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Tóm tắt ngắn gọn nội dung bài viết"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(
                                    (opt) => opt.value === categoryId,
                                )}
                                onChange={(option) =>
                                    setCategoryId(option?.value || '')
                                }
                                placeholder="Chọn danh mục"
                                isDisabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <Select
                                options={tagOptions}
                                isMulti
                                value={tagOptions.filter((opt) =>
                                    tagIds.includes(opt.value),
                                )}
                                onChange={(options) => {
                                    setTagIds(
                                        options
                                            ? options.map((opt) => opt.value)
                                            : [],
                                    )
                                }}
                                placeholder="Chọn các tag liên quan"
                                isDisabled={loading}
                            />
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ảnh đại diện (Featured Image)
                            </label>
                            {/* Ở đây bạn có thể tích hợp MediaPicker hoặc FilePicker */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">
                                    {featuredImageId
                                        ? 'Đã chọn ảnh (ID: ' +
                                          featuredImageId +
                                          ')'
                                        : 'Chưa chọn ảnh đại diện'}
                                </p>
                                {/* Nút mở media library sẽ được thêm sau */}
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="mt-3"
                                >
                                    Chọn từ thư viện
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian đăng lịch
                            </label>
                            <DatePicker
                                showTimeSelect
                                value={scheduledPublishAt}
                                onChange={setScheduledPublishAt}
                                placeholder="Chọn ngày giờ đăng (tùy chọn)"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (SEO)
                            </label>
                            <Input
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                placeholder="Tiêu đề SEO (tùy chọn)"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (SEO)
                            </label>
                            <Input
                                textArea
                                rows={3}
                                value={metaDescription}
                                onChange={(e) =>
                                    setMetaDescription(e.target.value)
                                }
                                placeholder="Mô tả SEO (tùy chọn)"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords (SEO)
                            </label>
                            <Input
                                value={metaKeywords}
                                onChange={(e) =>
                                    setMetaKeywords(e.target.value)
                                }
                                placeholder="Từ khóa cách nhau bằng dấu phẩy"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Nội dung bài viết */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung bài viết
                    </label>
                    <Input
                        textArea
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Viết nội dung chi tiết bài viết tại đây..."
                        disabled={loading}
                    />
                    {/* Nếu bạn dùng rich text editor (như TipTap, Quill, etc.), thay thế Input này */}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                        variant="default"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        color="blue-600"
                        onClick={handleCreate}
                        loading={loading}
                    >
                        Tạo bài viết
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default NewsCreateModal
