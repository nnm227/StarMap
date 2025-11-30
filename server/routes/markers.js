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

// GET /api/markers
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT m.id,
              m.user_id,
              m.title,
              m.description,
              m.latitude,
              m.longitude,
              m.created_at,
              m.updated_at,
              u.username
       FROM markers m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch markers' })
  }
})

// GET /api/markers/:id
router.get('/:id', async (req, res) => {
  const markerId = Number(req.params.id)
  if (Number.isNaN(markerId)) {
    return res.status(400).json({ error: 'Invalid marker id' })
  }
  try {
    const result = await query(
      `SELECT m.id,
              m.user_id,
              m.title,
              m.description,
              m.latitude,
              m.longitude,
              m.created_at,
              m.updated_at,
              u.username
       FROM markers m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [markerId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Marker not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch marker' })
  }
})

// POST /api/markers
router.post('/', requireAuth, async (req, res) => {
  if (isBanned(req.user)) {
    return res.status(403).json({ error: 'Banned users cannot create markers' })
  }
  const { title, description, latitude, longitude } = req.body
  if (!title || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const result = await query(
      `INSERT INTO markers (user_id, title, description, latitude, longitude, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, user_id, title, description, latitude, longitude, created_at, updated_at`,
      [req.user.id, title, description ?? null, latitude, longitude]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create marker' })
  }
})

// PUT /api/markers/:id
router.put('/:id', requireAuth, async (req, res) => {
  const markerId = Number(req.params.id)
  if (Number.isNaN(markerId)) {
    return res.status(400).json({ error: 'Invalid marker id' })
  }
  const { title, description, latitude, longitude } = req.body
  try {
    const existing = await query('SELECT * FROM markers WHERE id = $1', [
      markerId,
    ])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Marker not found' })
    }
    const marker = existing.rows[0]
    if (marker.user_id !== req.user.id && !canModerate(req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const result = await query(
      `UPDATE markers
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           latitude = COALESCE($3, latitude),
           longitude = COALESCE($4, longitude),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, user_id, title, description, latitude, longitude, created_at, updated_at`,
      [title, description, latitude, longitude, markerId]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not update marker' })
  }
})

// DELETE /api/markers/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const markerId = Number(req.params.id)
  if (Number.isNaN(markerId)) {
    return res.status(400).json({ error: 'Invalid marker id' })
  }
  try {
    const existing = await query('SELECT * FROM markers WHERE id = $1', [
      markerId,
    ])
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Marker not found' })
    }
    const marker = existing.rows[0]
    if (marker.user_id !== req.user.id && !canModerate(req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    await query('DELETE FROM markers WHERE id = $1', [markerId])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not delete marker' })
  }
})

export default router