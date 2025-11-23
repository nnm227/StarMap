import { useState, useEffect } from 'react'
// import CommentList from '../moderation/CommentList'

// Shows details including comments on a marker when you click on it
export default function MarkerPopup({ marker, user, onClose }) {
  const [comments, setComments] = useState([])

  // Fetch comments for this marker on marker clicked
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/markers/${marker.id}/comments`)
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
      window.location.reload() // Refresh markers
    } catch (error) {
      console.error('Error deleting marker:', error)
    }
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '400px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <button
        onClick={onClose}
        style={{ float: 'right', cursor: 'pointer' }}
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
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete Marker
          </button>
        )}

      <hr />
      {/* Not implemented yet. But will show a list of all comments that are associated with the marker */}
      {/* <CommentList 
        comments={comments}
        markerId={marker.id}
        user={user}
      /> */}
    </div>
  )
}