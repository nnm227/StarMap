import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerPopup from './MarkerPopup'
import AddMarkerControl from './AddMarkerControl'

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapContainer({
    markers,
    selectedMarker,
    onMarkerSelect,
    isAddingMarker,
    setIsAddingMarker,
    user,
    onMarkerAdded,
    isSidebarVisible
}) {
    // Load map and marker references
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markersLayerRef = useRef(null)
    const [newMarkerPosition, setNewMarkerPosition] = useState(null)

    // Initialize map
    useEffect(() => {
        if (!mapInstanceRef.current) {
            // Initialize Leaflet map centered on Lehigh campus
            const map = L.map(mapRef.current).setView([40.6076, -75.3784], 16)

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            mapInstanceRef.current = map
            markersLayerRef.current = L.layerGroup().addTo(map)
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // effect to handle sidebar visibility changes (otherwise right 1 inch doesnt load when sidebar is retracted)
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map) return

        // Delay to let CSS transition complete before invalidating map size (.2 seconds)
        const timeoutId = setTimeout(() => {
            map.invalidateSize()
        }, 200) 

        return () => clearTimeout(timeoutId)
    }, [isSidebarVisible])


    // Handle adding markers by clicking on map
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map) return

        const handleMapClick = (e) => {
            if (isAddingMarker && user) {
                setNewMarkerPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
            }
        }

        if (isAddingMarker) {
            map.on('click', handleMapClick)
        }

        return () => {
            map.off('click', handleMapClick)
        }
    }, [isAddingMarker, user])

    // Update markers on map
    useEffect(() => {
        const map = mapInstanceRef.current
        const markersLayer = markersLayerRef.current

        if (!map || !markersLayer) return

        // Clear existing markers
        markersLayer.clearLayers()

        // Add markers to map
        markers.forEach(marker => {
            const leafletMarker = L.marker([marker.latitude, marker.longitude])
                .bindPopup(`
          <div>
            <h3>${marker.title}</h3>
            <p>${marker.description}</p>
            <button onclick="window.viewMarker(${marker.id})">View Details</button>
          </div>
        `)
                .addTo(markersLayer)

            leafletMarker.on('click', () => {
                onMarkerSelect(marker)
            })
        })

        // Global function to handle popup button clicks when a marker is clicked
        window.viewMarker = (id) => {
            const marker = markers.find(m => m.id === id)
            onMarkerSelect(marker)
        }
    }, [markers, onMarkerSelect])

    // Pan to selected marker
    useEffect(() => {
        if (selectedMarker && mapInstanceRef.current) {
            mapInstanceRef.current.setView(
                [selectedMarker.latitude, selectedMarker.longitude],
                18
            )
        }
    }, [selectedMarker])

    return (
        <div style={{ position: 'relative', flex: 1 }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            {/* Control panel for adding markers */}
            {/* replace true with user when authentication is added */}
            {user && (
                <AddMarkerControl
                    isAddingMarker={isAddingMarker}
                    setIsAddingMarker={setIsAddingMarker}
                    newMarkerPosition={newMarkerPosition}
                    setNewMarkerPosition={setNewMarkerPosition}
                    onMarkerAdded={onMarkerAdded}
                />
            )}

            {/* Marker details popup */}
            {selectedMarker && (
                <MarkerPopup
                    marker={selectedMarker}
                    user={user}
                    onClose={() => onMarkerSelect(null)}
                />
            )}
        </div>
    )
}