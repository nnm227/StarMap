/* AI Disclosure: 
 NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
 Prompt: Modify my markers list component to add professional styling
 Response: See below. Also see ../../styles/MarkerList.css
 Note: AI is good at making css and classNames match with less mistakes than humans
 */

import { Link } from 'react-router-dom'
import '../../styles/MarkerList.css'

// Side bar that shows a list view of all markers as an alternative to just seeing them on the map
export default function MarkerList({ markers, onMarkerSelect, user }) {
    return (
        <div className="marker-list-container">
            {/* Header Section */}
            <div className="marker-list-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 className="marker-list-title">Campus Events</h2>
                    {/* Provide a link to get back to the home page of the app since layout bar is not showing */}
                    <Link to="/" className="home-link">
                        Home
                    </Link>
                </div>
                {user && (
                    <p className="marker-list-user-info">👤 {user.username}</p>
                )}
                {/* Show how many events are currently listed */}
                <p className="marker-list-count">
                    {markers.length} {markers.length === 1 ? 'event' : 'events'} available
                </p>
            </div>

            {/* Markers List */}
            <div className="marker-list-content">
                {markers.length === 0 ? (
                    <div className="marker-list-empty">
                        <p>No events yet</p>
                        <p className="marker-list-empty-hint">
                            {/* Tell user to sign in to add events if logged out */}
                            {user ? 'Click "Add Event" to create one!' : 'Log in to add events'}
                        </p>
                    </div>
                ) : ( 
                    // Show a list of all events as cards 
                    markers.map(marker => (
                        <div
                            key={marker.id}
                            onClick={() => onMarkerSelect(marker)}
                            className="marker-card"
                        >
                            {/* Let's user know if event is theirs */}
                            {user && marker.user_id === user.id && (
                                <div className="marker-card-user-indicator" />
                            )}

                            <h3 className="marker-card-title">📍 {marker.title}</h3>

                            <p className="marker-card-description">{marker.description}</p>

                            <div className="marker-card-footer">
                                <span className="marker-card-author">
                                    By {marker.username}
                                </span>

                                {user && marker.user_id === user.id && (
                                    <span className="marker-card-badge">YOUR EVENT</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}