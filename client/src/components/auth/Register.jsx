import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email,
        username,
        password,
        display_name: displayName
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error || 'Registration failed')
      return
    }

    setSuccess('Account created! You are now logged in.')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create Account</h1>
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
          <label>Username</label><br />
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Display name (optional)</label><br />
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
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

        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}