import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../db/postgres.js'

const router = express.Router()

// helper to sign JWT
function makeToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      is_banned: user.is_banned
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, username, password, display_name } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const password_hash = await bcrypt.hash(password, 10)

    const result = await query(
      `INSERT INTO users (email, username, password_hash, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role, is_banned`,
      [email, username, password_hash, display_name ?? null]
    )

    const user = result.rows[0]
    const token = makeToken(user)

    res
      .cookie('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
      })
      .json({ user })
  } catch (err) {
    console.error(err)
    // simple duplicate handling
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email or username already exists' })
    }
    res.status(500).json({ error: 'Could not register user' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  try {
    const result = await query(
      `SELECT id, email, username, password_hash, role, is_banned
       FROM users
       WHERE email = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (user.is_banned) {
      return res.status(403).json({ error: 'This account has been banned.' })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = makeToken(user)

    res
      .cookie('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
      })
      .json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          is_banned: user.is_banned
        }
      })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not log in' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth').json({ success: true })
})

// GET /api/auth/current
router.get('/current', (req, res) => {
  const token = req.cookies?.auth
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.json(payload)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
})

export default router