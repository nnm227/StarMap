import express from 'express'
import { query } from '../db/postgres.js'
import { requireAuth } from '../auth.js'

const router = express.Router()

function canModerate(user) {
  return user.role === 'moderator' || user.role === 'admin'
}

function isBanned(user) {
  return user.role === 'banned'
}

// GET /api/comments?markerId=123
router.get('/', async (req, res) => {
  const { markerId } = req.query
  try {
    let result
    if (markerId) {
      result = await query(
        `SELECT c.id,
                c.marker_id,
                c.user_id,
                c.content,
                c.created_at,
                c.updated_at,
                c.is_flagged,
                u.username
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.marker_id = $1
         ORDER BY c.created_at ASC`,
        [markerId]
      )
    } else {
      result = await query(
        `SELECT c.id,
                c.marker_id,
                c.user_id,
                c.content,
                c.created_at,
                c.updated_at,
                c.is_flagged,
                u.username
         FROM comments c
         JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at ASC`
      )
    }
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch comments' })
  }
})

// GET /api/comments/:id
router.get('/:id', async (req, res) => {
  const commentId = Number(req.params.id)
  if (Number.isNaN(commentId)) {
    return res.status(400).json({ error: 'Invalid comment id' })
  }
  try {
    const result = await query(
      `SELECT c.id,
              c.marker_id,
              c.user_id,
              c.content,
              c.created_at,
              c.updated_at,
              c.is_flagged,
              u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [commentId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch comment' })
  }
})

// POST /api/comments
router.post('/', requireAuth, async (req, res) => {
  if (isBanned(req.user)) {
    return res
      .status(403)
      .json({ error: 'Banned users cannot create comments' })
  }
  const { marker_id, content } = req.body
  if (!marker_id || !content) {
    return res.status(400).json({ error: 'Missing marker_id or content' })
  }
  try {
    const result = await query(
      `INSERT INTO comments (marker_id, user_id, content, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, marker_id, user_id, content, created_at, updated_at, is_flagged`,
      [marker_id, req.user.id, content]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create comment' })
  }
})

// PUT /api/comments/:id
router.put('/:id', requireAuth, async (req, res) => {
  const commentId = Number(req.params.id)
  if (Number.isNaN(commentId)) {
    return res.status(400).json({ error: 'Invalid comment id' })
  }
  const { content } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Missing content' })
  }
  try {
    const existing = await query('SELECT * FROM comments WHERE id = $1', [
      commentId,
    ])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    const comment = existing.rows[0]
    if (comment.user_id !== req.user.id && !canModerate(req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const result = await query(
      `UPDATE comments
       SET content = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, marker_id, user_id, content, created_at, updated_at, is_flagged`,
      [content, commentId]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not update comment' })
  }
})

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const commentId = Number(req.params.id)
  if (Number.isNaN(commentId)) {
    return res.status(400).json({ error: 'Invalid comment id' })
  }
  try {
    const existing = await query('SELECT * FROM comments WHERE id = $1', [
      commentId,
    ])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    const comment = existing.rows[0]
    if (comment.user_id !== req.user.id && !canModerate(req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    await query('DELETE FROM comments WHERE id = $1', [commentId])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not delete comment' })
  }
})

export default router