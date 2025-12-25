import { Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
    apiCreateViolationsHistoriesPublic,
    apiDeleteViolatorHistoriesPublic,
    apiGetViolationsHistories,
    apiUpdateViolationHistoriesPublic,
} from '@/services/ViolationsService'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    HiClock,
    HiPaperClip,
    HiPencil,
    HiPlus,
    HiTrash,
    HiUser,
    HiX,
} from 'react-icons/hi'

export default function ViolationHistoryManageDialog({
    isOpen,
    onClose,
    violationId,
    violationNumber,
    onHistoryChanged,
}) {
    const [histories, setHistories] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            description: '',
            notes: '',
        },
    })

    // Load lịch sử
    useEffect(() => {
        if (!isOpen || !violationId) {
            setHistories([])
            reset()
            setEditingId(null)
            setSelectedFiles([])
            return
        }

        const fetchHistories = async () => {
            setLoading(true)
            try {
                const response = await apiGetViolationsHistories(violationId)
                const data = Array.isArray(response)
                    ? response
                    : response.data || []
                setHistories(data)
            } catch (err) {
                toast.push(
                    <Notification title="Lỗi" type="danger">
                        Không tải được lịch sử
                    </Notification>,
                )
            } finally {
                setLoading(false)
            }
        }

        fetchHistories()
    }, [isOpen, violationId])

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    // Thêm hoặc sửa
    const onSubmit = async (data) => {
        if (!violationId) return
        setSubmitting(true)

        try {
            const body = {
                description: data.description.trim(),
                notes: data.notes.trim() || null,
            }

            if (editingId) {
                // Sửa
                await apiUpdateViolationHistoriesPublic(
                    violationId,
                    editingId,
                    body,
                )
                toast.push(
                    <Notification title="Thành công" type="success">
                        Cập nhật lịch sử thành công!
                    </Notification>,
                )
            } else {
                // Thêm mới
                await apiCreateViolationsHistoriesPublic(violationId, body)
                toast.push(
                    <Notification title="Thành công" type="success">
                        Thêm hành động xử lý thành công!
                    </Notification>,
                )
            }

            // Refresh danh sách
            const response = await apiGetViolationsHistories(violationId)
            setHistories(
                Array.isArray(response) ? response : response.data || [],
            )

            reset()
            setEditingId(null)
            setSelectedFiles([])
            onHistoryChanged?.()
        } catch (err) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    {editingId ? 'Cập nhật' : 'Thêm'} thất bại:{' '}
                    {err?.response?.data?.message || 'Lỗi hệ thống'}
                </Notification>,
            )
        } finally {
            setSubmitting(false)
        }
    }

    const startEdit = (item) => {
        setEditingId(item.id)
        setValue('description', item.description)
        setValue('notes', item.notes || '')
    }

    const cancelEdit = () => {
        setEditingId(null)
        reset()
        setSelectedFiles([])
    }

    const handleDelete = async (historyId) => {
        if (
            !violationId ||
            !window.confirm(
                'Xóa hành động xử lý này? Hành động không thể khôi phục.',
            )
        )
            return

        try {
            await apiDeleteViolatorHistoriesPublic(violationId, historyId)
            setHistories((prev) => prev.filter((h) => h.id !== historyId))
            toast.push(
                <Notification title="Thành công" type="success">
                    Đã xóa hành động xử lý
                </Notification>,
            )
            onHistoryChanged?.()
        } catch (err) {
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Xóa thất bại
                </Notification>,
            )
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 KB'
        const kb = bytes / 1024
        if (kb < 1024) return kb.toFixed(1) + ' KB'
        return (kb / 1024).toFixed(1) + ' MB'
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={1000}
            title={`Quản lý lịch sử xử lý - ${violationNumber || 'N/A'}`}
        >
            <div className="flex flex-col h-[80vh]">
                {/* Form thêm/sửa - cố định trên cùng */}
                <div className="border-b px-6 py-5 bg-gray-50">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <HiPlus className="text-lg" />
                        {editingId
                            ? 'Chỉnh sửa hành động'
                            : 'Thêm hành động xử lý mới'}
                    </h4>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <FormItem
                            label="Mô tả hành động *"
                            className="md:col-span-2"
                        >
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập mô tả hành động',
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Ví dụ: Đã kiểm tra hiện trường, lập biên bản..."
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </FormItem>

                        <FormItem label="Ghi chú">
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Ghi chú bổ sung (tùy chọn)"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Upload file bằng chứng */}
                        <FormItem
                            label="File bằng chứng"
                            className="md:col-span-3"
                        >
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                <label className="cursor-pointer">
                                    <span className="text-primary-600 hover:underline">
                                        Chọn file
                                    </span>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {selectedFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {selectedFiles.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center text-sm"
                                        >
                                            <span className="truncate">
                                                {file.name} (
                                                {formatFileSize(file.size)})
                                            </span>
                                            <Button
                                                size="xs"
                                                variant="plain"
                                                icon={<HiX />}
                                                onClick={() => removeFile(i)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-amber-600 mt-2">
                                * Tính năng upload file sẽ được bổ sung sau
                            </p>
                        </FormItem>

                        <div className="md:col-span-3 flex justify-end gap-3">
                            {editingId && (
                                <Button variant="default" onClick={cancelEdit}>
                                    Hủy sửa
                                </Button>
                            )}
                            <Button
                                variant="solid"
                                type="submit"
                                loading={submitting}
                            >
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Danh sách lịch sử */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="loading loading-spinner loading-lg"></div>
                        </div>
                    ) : histories.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Chưa có hành động xử lý nào.
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {histories
                                .sort(
                                    (a, b) =>
                                        new Date(b.performedAt).getTime() -
                                        new Date(a.performedAt).getTime(),
                                )
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative pl-10 pb-8 last:pb-0 border-l-2 border-gray-200"
                                    >
                                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full ring-4 ring-white"></div>

                                        <div className="bg-white rounded-lg shadow-sm border p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <HiUser className="text-base" />
                                                    <span className="font-semibold text-gray-900">
                                                        {item.performedByName}
                                                    </span>
                                                    <span>•</span>
                                                    <HiClock className="text-base" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                item.performedAt,
                                                            ),
                                                            'dd/MM/yyyy HH:mm',
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="xs"
                                                        variant="twoTone"
                                                        icon={<HiPencil />}
                                                        onClick={() =>
                                                            startEdit(item)
                                                        }
                                                        title="Sửa"
                                                    />
                                                    <Button
                                                        size="xs"
                                                        variant="twoTone"
                                                        color="red-600"
                                                        icon={<HiTrash />}
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        title="Xóa"
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-base font-medium text-gray-900 mb-3">
                                                {item.description}
                                            </div>

                                            {item.notes && (
                                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {item.attachments &&
                                                item.attachments.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 font-medium text-gray-700 mb-3">
                                                            <HiPaperClip className="text-lg" />
                                                            <span>
                                                                Bằng chứng (
                                                                {
                                                                    item
                                                                        .attachments
                                                                        .length
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {item.attachments.map(
                                                                (file) => (
                                                                    <a
                                                                        key={
                                                                            file.id
                                                                        }
                                                                        href={
                                                                            file.fileUrl
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                                                                    >
                                                                        <div className="w-12 h-12 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                                                                            {file.contentType.startsWith(
                                                                                'image/',
                                                                            )
                                                                                ? '🖼️'
                                                                                : '📄'}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-primary-600 truncate">
                                                                                {
                                                                                    file.originalFileName
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {formatFileSize(
                                                                                    file.fileSize,
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </a>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
