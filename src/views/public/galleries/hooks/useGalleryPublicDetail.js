import {
    apiGetGalleryItemsPublic,
    apiGetGalleryPublic,
} from '@/services/GalleyService'
import { useEffect, useState } from 'react'

const useGalleryPublicDetail = (slug) => {
    const [gallery, setGallery] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) {
            setGallery(null)
            setItems([])
            return
        }

        const fetchDetail = async () => {
            try {
                setLoading(true)
                setError(null)

                // Lấy chi tiết gallery theo slug (hoặc id nếu API dùng id)
                const galleryRes = await apiGetGalleryPublic(slug)
                const galleryData = galleryRes.data
                setGallery(galleryData)

                // Lấy danh sách items (ảnh/tài liệu) trong gallery
                const itemsRes = await apiGetGalleryItemsPublic(slug)
                setItems(itemsRes.data?.items || itemsRes.data || [])
            } catch (err) {
                console.error(err)
                setError('Không thể tải chi tiết bộ sưu tập')
                setGallery(null)
                setItems([])
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [slug])

    return { gallery, items, loading, error }
}

export default useGalleryPublicDetail
