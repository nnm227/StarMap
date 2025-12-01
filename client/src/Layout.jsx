import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './styles/Layout.css'

export default function Layout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    // Fetch current user so we know if we're logged in
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/current', {
                    credentials: 'include'
                })

                if (!response.ok) {
                    setUser(null)
                    return
                }

                const data = await response.json()
                if (data && data.id) {
                    setUser(data)
                } else {
                    setUser(null)
                }
            } catch (err) {
                console.error('Error fetching current user:', err)
                setUser(null)
            }
        }

        fetchUser()
    }, [location.pathname])

    const isMapPage = location.pathname === '/map'

    const handleLogout = async () => {
        const confirmed = window.confirm('Are you sure you want to log out?')
        if (!confirmed) return

        try {
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
        } catch (err) {
            console.error('Error logging out:', err)
        } finally {
            setUser(null)
            navigate('/')
        }
    }

    if (isMapPage) {
        return <Outlet />
    }

    return (
        <div className="layout-container">
            <nav className="navbar">
                <ul className="navbar-list">
                    <li className="navbar-brand">StarMap</li>
                    <li>
                        <Link to="/" className="navbar-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/map" className="navbar-link">Map</Link>
                    </li>
                    <li>
                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="navbar-link"
                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="navbar-link">Login</Link>
                        )}
                    </li>
                </ul>
            </nav>

            <div className="content-container">
                <Outlet />
            </div>
        </div>
    )
}
