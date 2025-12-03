import '../../styles/Login.css'

// client/src/components/auth/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

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
    // After a short moment, redirect somewhere (home or map)
    setTimeout(() => {
      navigate('/map')
    }, 500)
  }

/* AI Disclosure: 
 NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
 Prompt: Please add professional styling to the login page.
 Response: See below. See also ../../styles/Login.css
*/
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Log in to continue to StarMap</p>

        {error && <div className="login-alert login-alert-error">{error}</div>}
        {success && <div className="login-alert login-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Log In
          </button>
        </form>

        <p className="login-footer">
          New to StarMap?{' '}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}