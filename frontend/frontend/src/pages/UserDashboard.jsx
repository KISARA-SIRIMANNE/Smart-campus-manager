import "./UserDashboard.css";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">Smart Campus</p>
          <h1>User Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your profile and access system features easily
          </p>
        </div>

        <div className="profile-badge">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <h2>Profile Information</h2>

        <div className="profile-grid">
          <div className="profile-item">
            <label>Name</label>
            <p>{user?.name}</p>
          </div>

          <div className="profile-item">
            <label>Email</label>
            <p>{user?.email}</p>
          </div>

          <div className="profile-item">
            <label>Role</label>
            <p className="role-tag">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="actions-grid">
          <div className="action-card">
            <h3>View Resources</h3>
            <p>Browse available campus resources</p>
          </div>

          <div className="action-card">
            <h3>Create Ticket</h3>
            <p>Report issues or maintenance requests</p>
          </div>

          <div className="action-card">
            <h3>My Bookings</h3>
            <p>Manage your reservations</p>
          </div>
        </div>
      </div>
    </div>
  );
}