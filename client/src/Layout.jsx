import { Link, Outlet, useLocation } from 'react-router-dom'
import './styles/Layout.css'

export default function Layout() {
    const location = useLocation()
    const isMapPage = location.pathname === '/map'

    // If on map page, render without layout chrome
    if (isMapPage) {
        return <Outlet />
    }

    // Otherwise show navigation
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
                </ul>
            </nav>

            <div className="content-container">
                <Outlet />
            </div>
        </div>
    )
}