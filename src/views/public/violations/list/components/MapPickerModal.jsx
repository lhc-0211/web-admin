import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MapClickHandler = ({ onClick }) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

const MapPickerModal = ({
    isOpen,
    onClose,
    onSelect,
    initialLat,
    initialLng,
}) => {
    const [position, setPosition] = useState([initialLat, initialLng])
    const [address, setAddress] = useState('')

    const fetchAddress = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`,
            )
            const data = await res.json()
            setAddress(data.display_name || '')
        } catch (err) {
            setAddress('')
        }
    }

    useEffect(() => {
        if (position) fetchAddress(position[0], position[1])
    }, [position])

    const handleConfirm = () => {
        onSelect(position[0], position[1], address)
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={900} height={650}>
            <div className="flex flex-col h-full">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold">
                        Chọn vị trí vi phạm trên bản đồ
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <HiX className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1">
                    <MapContainer
                        center={position}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <MapClickHandler
                            onClick={(lat, lng) => setPosition([lat, lng])}
                        />
                        <Marker position={position} />
                    </MapContainer>
                </div>

                {address && (
                    <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-700">
                        Địa chỉ: {address}
                    </div>
                )}

                <div className="border-t px-6 py-4 flex justify-end gap-3">
                    <Button variant="default" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="solid" onClick={handleConfirm}>
                        Xác nhận vị trí
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default MapPickerModal
