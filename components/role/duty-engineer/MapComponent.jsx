'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Leaflet iconlari uchun fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Xaritada bosilganda markerni qo'yadigan komponent
function LocationMarker({ position, onPositionChange, isEditable }) {
    const map = useMapEvents({
        click(e) {
            if (isEditable) {
                onPositionChange(e.latlng)
            }
        },
    })

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom())
        }
    }, [position, map])

    return position === null ? null : (
        <Marker position={position} draggable={isEditable}>
            <Popup>
                <div className="p-2">
                    <p className="text-sm font-semibold">Выбранная локация</p>
                    <p className="text-xs text-gray-600 mt-1">
                        Широта: {position.lat.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-600">
                        Долгота: {position.lng.toFixed(6)}
                    </p>
                    {isEditable && (
                        <p className="text-xs text-blue-600 mt-2">
                            Нажмите на карту или перетащите маркер
                        </p>
                    )}
                </div>
            </Popup>
        </Marker>
    )
}

const MapComponent = ({
    customLocations = null,
    center = null,
    isEditable = false,
    selectedPosition = null,
    onPositionSelect = null
}) => {
    const [locations, setLocations] = useState([])
    const [isClient, setIsClient] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(selectedPosition)

    useEffect(() => {
        setIsClient(true)

        if (customLocations) {
            setLocations(customLocations)
        } else {
            const mockLocations = [
                {
                    id: 1,
                    name: 'ТЦ "Мега"',
                    lat: 55.7633,
                    lng: 37.5656,
                    address: 'Москва, ул. Примерная, 1'
                }
            ]
            setLocations(mockLocations)
        }
    }, [customLocations])

    useEffect(() => {
        if (selectedPosition) {
            setMarkerPosition(selectedPosition)
        }
    }, [selectedPosition])

    const handlePositionChange = (latlng) => {
        setMarkerPosition(latlng)
        if (onPositionSelect) {
            onPositionSelect(latlng)
        }
    }

    const centerPosition = center || [55.7558, 37.6173]

    if (!isClient) {
        return (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <p>Карта загружается...</p>
            </div>
        )
    }

    return (
        <MapContainer
            center={markerPosition || centerPosition}
            zoom={customLocations ? 15 : 11}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!isEditable && locations.map((location) => (
                <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold text-[16px] text-[#2C5AA0]">{location.name}</h3>
                            <p className="text-[14px] mt-1">{location.address}</p>
                            <p className="text-[12px] text-gray-500 mt-1">
                                Координаты: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {isEditable && (
                <LocationMarker
                    position={markerPosition}
                    onPositionChange={handlePositionChange}
                    isEditable={isEditable}
                />
            )}
        </MapContainer>
    )
}

export default MapComponent