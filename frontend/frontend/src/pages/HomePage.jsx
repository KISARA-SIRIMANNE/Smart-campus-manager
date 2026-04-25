import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Smart Campus System</h1>
            <p>
              Manage campus resources, bookings, and maintenance tickets in one
              smart platform.
            </p>

            <div className="hero-buttons">
              <Link to="/login">
                <button className="primary-btn">Login</button>
              </Link>

              <Link to="/register">
                <button className="secondary-btn">Register</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h2>100+</h2>
          <p>Resources Managed</p>
        </div>
        <div className="stat-card">
          <h2>250+</h2>
          <p>Bookings Processed</p>
        </div>
        <div className="stat-card">
          <h2>90+</h2>
          <p>Tickets Resolved</p>
        </div>
        <div className="stat-card">
          <h2>24/7</h2>
          <p>System Availability</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Resource Management</h3>
            <p>
              Add, view, and manage campus resources like halls, labs, and study
              rooms with availability status.
            </p>
          </div>

          <div className="feature-card">
            <h3>Booking Management</h3>
            <p>
              Students and staff can create bookings while the system prevents
              overlapping time conflicts.
            </p>
          </div>

          <div className="feature-card">
            <h3>Maintenance Tickets</h3>
            <p>
              Report issues quickly, assign technicians, track progress, and
              update ticket resolution in real time.
            </p>
          </div>

          <div className="feature-card">
            <h3>Admin Dashboard</h3>
            <p>
              Get a complete overview of tickets, bookings, and resource usage
              from one centralized dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="workflow-section">
        <h2 className="section-title">How It Works</h2>
        <div className="workflow-grid">
          <div className="workflow-step">
            <span>1</span>
            <h3>Create Account</h3>
            <p>Register as a user or admin and access the platform securely.</p>
          </div>

          <div className="workflow-step">
            <span>2</span>
            <h3>Use Services</h3>
            <p>Create bookings, manage resources, or submit maintenance tickets.</p>
          </div>

          <div className="workflow-step">
            <span>3</span>
            <h3>Track Progress</h3>
            <p>Monitor booking status, issue resolution, and admin approvals.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Start Managing Your Campus Smarter Today</h2>
        <p>
          Join the Smart Campus platform and simplify resource bookings and
          maintenance workflows.
        </p>

        <div className="cta-buttons">
          <Link to="/register">
            <button className="primary-btn">Get Started</button>
          </Link>

          <Link to="/login">
            <button className="secondary-btn">Already have an account?</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Smart Campus System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
