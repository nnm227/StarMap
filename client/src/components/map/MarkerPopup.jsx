import { useState, useEffect } from 'react'
import CommentList from '../moderation/CommentList'
import '../../styles/MarkerPopup.css'


// Shows details including comments on a marker when you click on it
export default function MarkerPopup({ marker, user, onClose, onMarkerDeleted }) {
  const [comments, setComments] = useState([])

  // Fetch comments for this marker on marker clicked
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/comments?markerId=${marker.id}`)
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }
    fetchComments()
  }, [marker.id])

  // Handles user or admin/mod deleting a marker
  const handleDelete = async () => {
    //Popup to user before deleting a marker
    if (!confirm('Delete this marker?')) return

    try {
      await fetch(`http://localhost:3000/api/markers/${marker.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      onClose()

      //update the map container when marker is deleted
      if (onMarkerDeleted) {
        onMarkerDeleted(marker.id)
      }
    } catch (error) {
      console.error('Error deleting marker:', error)
    }
  }


//  NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
//  Prompt: please remove all styling elements into a seperate css file
//  Response: See below. 
  return (
    <div className="marker-popup">
      <button
        onClick={onClose}
        className="marker-popup-close"
      >
        ✕
      </button>
      {/* Marker has a title, username, created_at date, and description */}
      <h2>{marker.title}</h2>
      <p><strong>Posted by:</strong> {marker.username}</p>
      <p><strong>Date:</strong> {new Date(marker.created_at).toLocaleDateString()}</p>
      <p>{marker.description}</p>

      {/* Show delete button if user owns marker or is admin/moderator */}
      {user && (
        user.id === marker.user_id ||
        user.role === 'admin' ||
        user.role === 'moderator'
      ) && (
          <button onClick={handleDelete} className="marker-popup-delete-btn">
            Delete Marker
          </button>
        )}

      <hr />
      {/* a comments section with a way to add comments and moderation features */}
      <CommentList
        comments={comments}
        markerId={marker.id}
        user={user}
      />
    </div>
  )
}