// client/src/components/auth/Login.jsx
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }

    setSuccess(`Welcome, ${data.user.username}!`)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Log In</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label>Password</label><br />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <button type="submit">Log in</button>
      </form>
    </div>
  )
}