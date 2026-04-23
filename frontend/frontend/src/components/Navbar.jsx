import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>SmartCampus</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        {!user && (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {user.role === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                Dashboard
              </Link>
            )}

            <Link to="/resources" style={{ color: "white", textDecoration: "none" }}>
              Resources
            </Link>

            <Link to="/bookings" style={{ color: "white", textDecoration: "none" }}>
              Bookings
            </Link>

            <Link to="/tickets" style={{ color: "white", textDecoration: "none" }}>
              Tickets
            </Link>

            <Link
              to="/user-dashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              My Page
            </Link>

            <span>
              {user.name} ({user.role})
            </span>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}