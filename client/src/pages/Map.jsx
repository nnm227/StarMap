import { useState, useEffect } from 'react'
import MapContainer from '../components/map/MapContainer'
import MarkerList from '../components/map/MarkerList'
import '../styles/Map.css'

// import ModeratorPanel from '../components/moderation/ModeratorPanel'


export default function Map() {
    // State variables for map functions
    const [markers, setMarkers] = useState([])
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [user, setUser] = useState(null) // Currently logged-in user
    const [isAddingMarker, setIsAddingMarker] = useState(false)
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    // Fetch markers from API
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/markers')
                const data = await response.json()
                setMarkers(data)
            } catch (error) {
                console.error('Error fetching markers:', error)
            }
        }
        fetchMarkers()
    }, [])

    // Fetch current user (for authentication)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/current')
                const data = await response.json()
                setUser(data)
            } catch (error) {
                console.error('Not logged in')
            }
        }
        fetchUser()
    }, [])

    return (
        <div className="map-page-container">

            {/* Toggle sidebar button */}
            <button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="map-toggle-sidebar-button"
                title={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            >
                {isSidebarVisible ? '◀' : '▶'}
            </button>

            {/* Sidebar with marker list - conditionally rendered */}
            {isSidebarVisible && (
                <MarkerList
                    markers={markers}
                    onMarkerSelect={setSelectedMarker}
                    user={user}
                />
            )}



            {/* Main map area */}
            <MapContainer
                markers={markers}
                selectedMarker={selectedMarker}
                onMarkerSelect={setSelectedMarker}
                isAddingMarker={isAddingMarker}
                setIsAddingMarker={setIsAddingMarker}
                user={user}
                onMarkerAdded={() => {
                    // Refresh markers after adding new one
                    fetchMarkers()
                }}
                isSidebarVisible={isSidebarVisible}
            />

            {/* Admin/Moderator panel (only show for authorized users) */}
            {user && (user.role === 'admin' || user.role === 'moderator') && (
                <ModeratorPanel user={user} markers={markers} />
            )}
        </div>
    )
} 