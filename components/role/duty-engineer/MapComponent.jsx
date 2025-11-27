'use client'
import React, { useEffect, useState } from 'react'

// Leaflet komponentlari
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// Leaflet iconlari uchun fix
import L from 'leaflet'

// Marker iconlarini to'g'rilash
delete (L.Icon.Default.prototype)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})



const MapComponent = () => {
    const [locations, setLocations] = useState([])
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)

        // Backenddan ma'lumot olish (hozircha mock data)
        const fetchLocations = async () => {
            try {
                // Haqiqiy loyihada: const response = await fetch('/api/locations')
                const mockLocations = [
                    {
                        id: 1,
                        name: 'ТЦ "Мега"',
                        lat: 55.7633,
                        lng: 37.5656,
                        address: 'Москва, ул. Примерная, 1'
                    },
                    {
                        id: 2,
                        name: 'ТЦ "Галлерея"',
                        lat: 55.7580,
                        lng: 37.6200,
                        address: 'Москва, ул. Тестовая, 15'
                    },
                    {
                        id: 3,
                        name: 'ТЦ "Авиапарк"',
                        lat: 55.7912,
                        lng: 37.5356,
                        address: 'Москва, Ходынский бульвар, 4'
                    }
                ]
                setLocations(mockLocations)
            } catch (error) {
                console.error('Xatolik yuz berdi:', error)
            }
        }

        fetchLocations()
    }, [])

    // Markaziy koordinatalar (Moscow)
    const centerPosition = [55.7558, 37.6173]

    if (!isClient) {
        return (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <p>Karta yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <MapContainer
            center={centerPosition}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            {/* OpenStreetMap tile layer */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Location markerlari */}
            {locations.map((location) => (
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
        </MapContainer>
    )
}

export default MapComponent