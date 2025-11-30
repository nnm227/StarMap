import express from 'express'
import bcrypt from 'bcrypt'
import { query } from '../db/postgres.js'
import { requireAuth, requireRole } from '../auth.js'

const router = express.Router()

// GET /api/users  (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, username, role, created_at, updated_at
       FROM users
       ORDER BY id ASC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch users' })
  }
})

// GET /api/users/:id  (self or admin)
router.get('/:id', requireAuth, async (req, res) => {
  const targetId = Number(req.params.id)
  if (Number.isNaN(targetId)) {
    return res.status(400).json({ error: 'Invalid user id' })
  }
  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  try {
    const result = await query(
      `SELECT id, email, username, role, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [targetId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not fetch user' })
  }
})

// POST /api/users  (admin only, create user)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, username, password, role } = req.body
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const validRoles = ['user', 'moderator', 'admin', 'banned']
  const roleToUse = validRoles.includes(role) ? role : 'user'
  try {
    const password_hash = await bcrypt.hash(password, 10)
    const result = await query(
      `INSERT INTO users (email, username, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role, created_at, updated_at`,
      [email, username, password_hash, roleToUse]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'Email or username already exists' })
    }
    res.status(500).json({ error: 'Could not create user' })
  }
})

// PUT /api/users/:id
router.put('/:id', requireAuth, async (req, res) => {
  const targetId = Number(req.params.id)
  if (Number.isNaN(targetId)) {
    return res.status(400).json({ error: 'Invalid user id' })
  }
  const isAdmin = req.user.role === 'admin'
  const isSelf = req.user.id === targetId
  if (!isAdmin && !isSelf) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const { email, username, role } = req.body
  const updates = []
  const params = []
  let idx = 1
  if (email !== undefined) {
    updates.push(`email = $${idx++}`)
    params.push(email)
  }
  if (username !== undefined) {
    updates.push(`username = $${idx++}`)
    params.push(username)
  }
  if (isAdmin && role !== undefined) {
    updates.push(`role = $${idx++}`)
    params.push(role)
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' })
  }
  updates.push(`updated_at = NOW()`)
  params.push(targetId)
  try {
    const result = await query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${idx}
       RETURNING id, email, username, role, created_at, updated_at`,
      params
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'Email or username already exists' })
    }
    res.status(500).json({ error: 'Could not update user' })
  }
})

// DELETE /api/users/:id (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const targetId = Number(req.params.id)
  if (Number.isNaN(targetId)) {
    return res.status(400).json({ error: 'Invalid user id' })
  }
  try {
    const result = await query(
      `UPDATE users
       SET role = 'banned', updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, username, role, created_at, updated_at`,
      [targetId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not ban/delete user' })
  }
})

export default router