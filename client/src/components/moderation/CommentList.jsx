import { useState, useEffect } from 'react'
import '../../styles/CommentList.css'

// CommentList function accepts a curreny list of comments, a markerid, a user, and a variable to update parent if new comment added
export default function CommentList({ comments, markerId, user, onCommentAdded }) {
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [localComments, setLocalComments] = useState(comments)

    // Reset the local comments variable when new comments are selected 
    useEffect(() => {
        setLocalComments(comments || [])
    }, [comments, markerId])


    // Function to send create a new comment
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`http://localhost:3000/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    marker_id: markerId,
                    content: newComment
                })
            })
            if (response.ok) {
                const newCommentData = await response.json()
                setLocalComments([...localComments, newCommentData])
                setNewComment('')
                if (onCommentAdded) {
                    onCommentAdded(newCommentData)
                }
            } else {
                alert('Failed to add comment')
            }
        } catch (error) {
            console.error('Error adding comment:', error)
            alert('Error adding comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete a comment you own
    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return

        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                setLocalComments(localComments.filter(c => c.id !== commentId))
            } else {
                alert('Failed to delete comment')
            }
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('Error deleting comment')
        }
    }

    // Flag a comment if you are an admin or moderator
    const handleFlag = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}/flag`, {
                method: 'PUT',
                credentials: 'include'
            })

            if (response.ok) {
                setLocalComments(localComments.map(c =>
                    c.id === commentId ? { ...c, is_flagged: true } : c
                ))
                alert('Comment flagged for moderation')
            } else {
                alert('Failed to flag comment')
            }
        } catch (error) {
            console.error('Error flagging comment:', error)
            alert('Error flagging comment')
        }
    }

    return (
        // AI Disclosure: 
        // NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
        // Prompt: Please add class names and general formatting to external CSS file to professinally style the comment section 
        // Response: See below. Also see ../styles/comment.css.


        <div className="comment-list-container">
            <h3 className="comment-list-header">
                Comments ({localComments.length})
            </h3>

            {/* Show a form to submit a comment if logged in */}
            {user && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        disabled={isSubmitting}
                        className="comment-textarea"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="comment-submit-button"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            {/* Display all comments */}
            <div className="comments-container">
                {localComments.length === 0 ? (
                    <p className="no-comments-message">
                        No comments yet.
                    </p>
                ) : (
                    localComments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`comment-card ${comment.is_flagged ? 'flagged' : ''}`}
                        >
                            {/* Show a header with username and date */}
                            <div className="comment-header">
                                <div>
                                    <strong className="comment-username">
                                        {comment.username || 'Anonymous'}
                                    </strong>
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                    {comment.is_flagged && (
                                        <span className="flagged-badge">
                                            FLAGGED
                                        </span>
                                    )}
                                </div>

                                {/* Action buttons */}
                                {user && (
                                    <div className="comment-actions">
                                        {/* Delete button - show if user owns comment or is admin/mod */}
                                        {(user.id === comment.user_id ||
                                            user.role === 'admin' ||
                                            user.role === 'moderator') && (
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="comment-delete-button"
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        {/* Flag button - show if user doesn't own the comment and it's not already flagged */}
                                        {user.id !== comment.user_id && !comment.is_flagged && (
                                            <button
                                                onClick={() => handleFlag(comment.id)}
                                                className="comment-flag-button"
                                            >
                                                Flag
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comment content */}
                            <p className="comment-content">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {!user && localComments.length > 0 && (
                <p className="login-prompt">
                    Log in to add a comment
                </p>
            )}
        </div>
    )
}