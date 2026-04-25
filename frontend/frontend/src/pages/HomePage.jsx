import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>

        <div className="hero-content">
          <p className="hero-label">Smart Campus System</p>

          <h1>
            Smarter Campus <br />
            <span>Better Tomorrow</span>
          </h1>

          <p className="hero-description">
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

        <div className="floating-card energy">
          <span>🌿</span>
          <div>
            <h4>Smart Energy</h4>
            <p>Optimized campus usage</p>
          </div>
        </div>

        <div className="floating-card security">
          <span>🛡️</span>
          <div>
            <h4>Smart Security</h4>
            <p>All systems secure</p>
          </div>
        </div>

        <div className="floating-card classes">
          <span>👥</span>
          <div>
            <h4>Live Resources</h4>
            <p>Resources available now</p>
          </div>
        </div>

        <div className="floating-card news">
          <span>🧾</span>
          <div>
            <h4>Campus Tickets</h4>
            <p>Issues tracked live</p>
          </div>
        </div>

        <div className="hero-feature-box">
          <div>
            <span>🎓</span>
            <h4>Smart Learning</h4>
            <p>Digital resources</p>
          </div>

          <div>
            <span>👥</span>
            <h4>Connected Campus</h4>
            <p>Easy communication</p>
          </div>

          <div>
            <span>🛡️</span>
            <h4>Maintenance</h4>
            <p>Ticket handling</p>
          </div>

          <div>
            <span>📊</span>
            <h4>Data Insights</h4>
            <p>Better decisions</p>
          </div>
        </div>

        <div className="hero-stats-box">
          <div>
            <strong>100+</strong>
            <p>Resources</p>
          </div>
          <div>
            <strong>250+</strong>
            <p>Bookings</p>
          </div>
          <div>
            <strong>90+</strong>
            <p>Tickets</p>
          </div>
          <div>
            <strong>24/7</strong>
            <p>Availability</p>
          </div>
        </div>
      </section>

 <section className="features-section">
  <div className="features-container">
    <div className="features-header">
      <p className="features-label">System Modules</p>
      <h2 className="section-title">Core Features</h2>
      <p className="features-subtitle">
        Manage campus resources, bookings, incidents, and admin activities from
        one smart platform.
      </p>
    </div>

    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">🏫</div>
        <h3>Resource Management</h3>
        <p>
          Add, view, search, and manage campus resources like halls, labs,
          projectors, and rooms.
        </p>
        <span>Manage Assets</span>
      </div>

      <div className="feature-card">
        <div className="feature-icon">📅</div>
        <h3>Booking Management</h3>
        <p>
          Create resource bookings, check availability, and prevent overlapping
          booking conflicts.
        </p>
        <span>Smart Scheduling</span>
      </div>

      <div className="feature-card">
        <div className="feature-icon">🛠️</div>
        <h3>Maintenance Tickets</h3>
        <p>
          Report issues, assign technicians, update status, and track progress
          until completion.
        </p>
        <span>Issue Tracking</span>
      </div>

      <div className="feature-card">
        <div className="feature-icon">📊</div>
        <h3>Admin Dashboard</h3>
        <p>
          Monitor users, resources, bookings, and tickets with clear dashboard
          summaries.
        </p>
        <span>Admin Control</span>
      </div>
    </div>
  </div>
</section>

      <section className="workflow-section">
  <div className="workflow-container">
    <div className="workflow-header">
      <p className="workflow-label">Process</p>
      <h2 className="section-title dark">How It Works</h2>
      <p className="workflow-subtitle">
        Follow these simple steps to manage resources, bookings, and tickets
        efficiently within the Smart Campus system.
      </p>
    </div>

    <div className="workflow-grid">
      <div className="workflow-step">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>Create Account</h3>
          <p>Register securely and access the Smart Campus system.</p>
        </div>
      </div>

      <div className="workflow-step">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>Use Services</h3>
          <p>Book resources or submit maintenance tickets easily.</p>
        </div>
      </div>

      <div className="workflow-step">
        <div className="step-number">3</div>
        <div className="step-content">
          <h3>Track Progress</h3>
          <p>Monitor booking approvals and ticket updates in real time.</p>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="cta-section">
  <div className="cta-container">
    <p className="cta-label">Smart Campus Platform</p>

    <h2>Start Managing Your Campus Smarter Today</h2>

    <p className="cta-text">
      Simplify resource bookings, maintenance tickets, and campus operations
      with one easy-to-use system.
    </p>

    <div className="cta-buttons">
      <Link to="/register">
        <button className="cta-primary-btn">Get Started</button>
      </Link>

      <Link to="/login">
        <button className="cta-secondary-btn">Already have an account?</button>
      </Link>
    </div>
  </div>
</section>

<footer className="footer">
  <div className="footer-container">
    <div>
      <h3>Smart Campus</h3>
      <p>Campus resource and maintenance management system.</p>
    </div>

    <p className="footer-copy">
      © 2026 Smart Campus System. All Rights Reserved.
    </p>
  </div>
</footer>
    </div>
  );
}