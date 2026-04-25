import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-badge">🎓</span>
        <span>
          SMART CAMPUS
          <small>SYSTEM</small>
        </span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="nav-link active">Home</Link>

        {user && user.role === "ADMIN" && (
          <Link to="/admin-dashboard" className="nav-link">
            Dashboard
          </Link>
        )}

        {user && (
          <>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/bookings" className="nav-link">Bookings</Link>
            <Link to="/tickets" className="nav-link">Tickets</Link>
            <Link to="/user-dashboard" className="nav-link">My Page</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        <button className="circle-btn">⌕</button>

        {user ? (
          <>
            <div className="user-pill">
              <span className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span>
                Welcome, {user.name}
                <small>{user.role}</small>
              </span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-pill">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}