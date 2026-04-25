import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update user from localStorage when navigating between pages
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
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
        <Link to="/" className={isActive("/")}>Home</Link>

        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin-dashboard" className={isActive("/admin-dashboard")}>
              Dashboard
            </Link>
            <Link to="/users" className={isActive("/users")}>
              Users
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/resources" className={isActive("/resources")}>Resources</Link>
            <Link to="/bookings" className={isActive("/bookings")}>Bookings</Link>
            <Link to="/tickets" className={isActive("/tickets")}>Tickets</Link>
            <Link to="/user-dashboard" className={isActive("/user-dashboard")}>My Profile</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className={isActive("/login")}>Login</Link>
            <Link to="/register" className={isActive("/register")}>Register</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <div className="user-pill">
              <span className="user-avatar">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="avatar-image"
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "U"
                )}
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