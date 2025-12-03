import { useState } from 'react'
import '../../styles/Register.css'


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

/* AI Disclosure: 
 NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
 Prompt: Please add professinal styling to the register page and keep the same theme formatting as the login page.
 Response: See below. See also ../../styles/Register.css
*/
return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="register-subtitle">Join StarMap today</p>

        {error && <div className="register-alert register-alert-error">{error}</div>}
        {success && <div className="register-alert register-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="register-form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="register-form-group">
            <label>Display Name (optional)</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Enter display name"
            />
          </div>

          <div className="register-form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" className="register-submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}