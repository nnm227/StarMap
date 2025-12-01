import { useState, useEffect } from 'react'
import MapContainer from '../components/map/MapContainer'
import MarkerList from '../components/map/MarkerList'
import '../styles/Map.css'

// import ModeratorPanel from '../components/moderation/ModeratorPanel'
export default function Map() {
    // state variables for map functions
    const [markers, setMarkers] = useState([])
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [user, setUser] = useState(null)
    const [isAddingMarker, setIsAddingMarker] = useState(false)
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    //debug that sets a false user 
    // const setDemoUser = () => {
    //     const demoUser = {
    //         id: 999,
    //         username: 'demo_user',
    //         email: 'demo@lehigh.edu',
    //         role: 'user'
    //     }
    //     setUser(demoUser)
    //     console.log('Demo user set:', demoUser)
    // }

    // fetch markers from API
    const fetchMarkers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/markers')
            const data = await response.json()
            setMarkers(data)
        } catch (error) {
            console.error('Error fetching markers:', error)
        }
    }

    // effect to fetch markers on map load
    useEffect(() => {
        fetchMarkers()
        // setDemoUser() // debug - get rid of when user auth fixed
    }, [])

    // fetch the current user from cookies
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/current', {
                    credentials: 'include'
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data && data.id && data.role !== 'banned') { // user must be valid, not banned and have an id
                        setUser(data)
                    } else {
                        setUser(null)
                    }
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Not logged in')
                setUser(null)
            }
        }
        //debug - uncomment this when user auth exists
        fetchUser()
    }, [])

    // debug to see if log in works
    useEffect(() => {
        console.log('Current user:', user)
        console.log('User logged in?', !!user)
    }, [user])


    return (
        <div className="map-page-container">

            {/* toggle sidebar button */}
            <button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="map-toggle-sidebar-button"
                title={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            >
                {isSidebarVisible ? '◀' : '▶'}
            </button>

            {/* sidebar with marker list that is conditionally rendered */}
            {isSidebarVisible && (
                <MarkerList
                    markers={markers}
                    onMarkerSelect={setSelectedMarker}
                    user={user}
                />
            )}

            {/* main map area */}
            <MapContainer
                markers={markers}
                selectedMarker={selectedMarker}
                onMarkerSelect={setSelectedMarker}
                isAddingMarker={isAddingMarker}
                setIsAddingMarker={setIsAddingMarker}
                user={user}
                onMarkerAdded={() => {
                    // refresh markers after adding new one
                    fetchMarkers()
                }}
                isSidebarVisible={isSidebarVisible}
            />

            {/* admin/moderator panel (only show for authorized users) (need to add) */}

            {/* {user && (user.role === 'admin' || user.role === 'moderator') && (
                <ModeratorPanel user={user} markers={markers} />
            )} */}
        </div>
    )
} 