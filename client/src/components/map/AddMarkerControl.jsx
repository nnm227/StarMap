/* AI Disclosure: 
 NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
 Prompt: Modify my add markers component to add professional styling
 Response: See below. It modified class names of each element in the return. Also see ../../styles/addMarkerControl.css
 Note: AI is good at making css and classNames match with less mistakes than humans
 */



import { useState } from 'react'
import '../../styles/AddMarkerControl.css'

export default function AddMarkerControl({
  isAddingMarker,
  setIsAddingMarker,
  newMarkerPosition,
  setNewMarkerPosition,
  onMarkerAdded
}) {

  //State variables for title and description
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Once user has selected a location on map and provided a description, sent post request to API
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default browser settings for DOM events

    if (!newMarkerPosition) {
      alert('Please click on the map to select a location')
      return
    }

    try {
      // Send post response to server/api/markers
      // Server should expect to receive a title, description, latitude, and longitude
      const response = await fetch('http://localhost:3000/api/markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title,
          description: description,
          latitude: newMarkerPosition.lat,
          longitude: newMarkerPosition.lng
        })
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        setNewMarkerPosition(null)
        setIsAddingMarker(false)
        onMarkerAdded()
      }
    } catch (error) {
      console.error('Error adding marker:', error)
    }
  }

  if (!isAddingMarker) {
    return (
      <button
        onClick={() => setIsAddingMarker(true)}
        className="add-marker-button"
      >
        <span className="add-marker-button-icon">📍</span>
        Add Event Marker
      </button>
    )
  }

  return (
    <div className="add-marker-form-container">
      <h3 className="add-marker-form-title">Add New Event</h3>
      <p className={`add-marker-form-hint ${newMarkerPosition ? 'location-selected' : 'location-not-selected'}`}>
        {newMarkerPosition ? 'Location selected on map' : 'Click on map to select location'}
      </p>
      {/*Form to take in user input for new events: title and description  */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="add-marker-input"
        />

        <textarea
          placeholder="Event Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="add-marker-textarea"
        />
        {/* Only enable submit button when new marker position set  */}
        <button
          type="submit"
          disabled={!newMarkerPosition}
          className={`add-marker-submit-button ${newMarkerPosition ? 'enabled' : 'disabled'}`}
        >
          Create Event Marker
        </button>

        {/* Cancel button */}
        <button
          type="button"
          onClick={() => {
            setIsAddingMarker(false)
            setNewMarkerPosition(null)
            setTitle('')
            setDescription('')
          }}
          className="add-marker-cancel-button"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}