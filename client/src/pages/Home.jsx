// AI Disclosure: 
// NAME OF AI MODEL: Claude Sonnet 4.5 (Github Copilot)
// Prompt: Please create a professional looking home page for my web app using the project document to understand the purpose of the app.
// Response: See below. Also see ../styles/Home.css.
// Note: AI helps to get started and to make design decisions that are visually appealing in less time


import { Link } from 'react-router-dom'
import '../styles/Home.css'

export default function Home() {
    const features = [
        {
            icon: '📍',
            title: 'Pin Events',
            description: 'Drop markers anywhere on campus to share events with the community'
        },
        {
            icon: '🗨️',
            title: 'Join Discussions',
            description: 'Comment on events and connect with other students'
        },
        {
            icon: '🔍',
            title: 'Discover Events',
            description: 'Browse an interactive map of all campus events maintained by the community'
        },
        {
            icon: '👥',
            title: 'Community Driven',
            description: 'Built by students, for students - contribute and collaborate'
        }
    ]

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">Welcome to StarMap! </h1>
                <p className="hero-subtitle">
                    Your interactive campus event discovery platform
                </p>
                <Link to="/map" className="hero-button">
                    🗺️ Explore the Map
                </Link>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Call to Action */}
            <div className="cta-section">
                <h2 className="cta-title">Ready to get started?</h2>
                <p className="cta-subtitle">
                    Join the StarMap community and start discovering events today 
                </p>
                <div className="cta-buttons">
                    <Link to="/map" className="cta-button-primary">
                       🗺️ View Map
                    </Link>
                    {/* <button className="cta-button-secondary">
                        Learn More
                    </button> */}
                </div>
            </div>
        </div>
    )
}