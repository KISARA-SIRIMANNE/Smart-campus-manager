import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getNavClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  // Mock notification count — replace with real data
  const notificationCount = 3;

  return (
    <nav className="navbar">
      {/* Logo */}
      <NavLink to="/" className="navbar-logo">
        <span className="logo-badge">
          {/* Shield + graduation cap SVG */}
          <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L4 8v10c0 9.5 6 18 14 20C26 36 32 27.5 32 18V8L18 2z" fill="#1d4ed8"/>
            <path d="M18 2L4 8v10c0 9.5 6 18 14 20C26 36 32 27.5 32 18V8L18 2z" fill="url(#shield-grad)"/>
            {/* Laurel hints */}
            <path d="M8 22c0 0-1.5-3 0-5" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M28 22c0 0 1.5-3 0-5" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Graduation cap */}
            <polygon points="18,10 24,13.5 18,17 12,13.5" fill="white"/>
            <rect x="21.5" y="13.5" width="1.2" height="4" rx="0.6" fill="white"/>
            <ellipse cx="22.1" cy="18" rx="1.5" ry="1" fill="white"/>
            <line x1="12" y1="13.5" x2="12" y2="17.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="18" y1="17" x2="18" y2="20" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="shield-grad" x1="4" y1="2" x2="32" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1d4ed8"/>
                <stop offset="1" stopColor="#38bdf8"/>
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="logo-text">
          SMART CAMPUS
          <small>SYSTEM</small>
        </span>
      </NavLink>

      {/* Nav Links */}
      <div className="navbar-links">
        <NavLink to="/" end className={getNavClass}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          Home
        </NavLink>

        {user && user.role === "ADMIN" && (
          <NavLink to="/admin-dashboard" className={getNavClass}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </NavLink>
        )}

        {user && (
          <>
            <NavLink to="/resources" className={getNavClass}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
              Resources
            </NavLink>
            <NavLink to="/bookings" className={getNavClass}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Bookings
            </NavLink>
            <NavLink to="/tickets" className={getNavClass}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a2 2 0 012-2h16a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 000-4V9z"/>
                <line x1="9" y1="7" x2="9" y2="17" strokeDasharray="2 2"/>
              </svg>
              Tickets
            </NavLink>
          </>
        )}

        {!user && (
          <>
            <NavLink to="/login" className={getNavClass}>Login</NavLink>
            <NavLink to="/register" className={getNavClass}>Register</NavLink>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {user ? (
          <>
            {/* Bell */}
            <button className="bell-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {notificationCount > 0 && (
                <span className="bell-badge">{notificationCount}</span>
              )}
            </button>

            {/* User pill */}
            <div className="user-pill">
              <span className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="user-info">
                <span className="user-welcome">Welcome back,</span>
                <span className="user-name">
                  {user.name}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
                <span className="user-role">
                  <span className="role-dot" />
                  {user.role}
                </span>
              </span>
            </div>

            {/* Logout */}
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="login-pill">Login</NavLink>
        )}
      </div>
    </nav>
  );
}
