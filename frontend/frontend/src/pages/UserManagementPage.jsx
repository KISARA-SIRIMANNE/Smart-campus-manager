import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "../api/userApi";
import "./UserManagementPage.css";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user"));

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Load users error:", err);
      setMessage("Failed to load users");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getUserStats();
      setStats(res.data);
    } catch (err) {
      console.error("Load stats error:", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const handleEditStart = (userId, currentRole) => {
    setEditingId(userId);
    setEditRole(currentRole);
  };

  const handleEditSave = async (userId) => {
    if (!editRole) {
      setMessage("Please select a role");
      setMessageType("error");
      return;
    }

    try {
      await updateUserRole(userId, editRole);
      setMessage("User role updated successfully!");
      setMessageType("success");
      setEditingId(null);
      loadUsers();
      loadStats();

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update role error:", err);
      setMessage("Failed to update user role");
      setMessageType("error");
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      setMessage("User deleted successfully!");
      setMessageType("success");
      loadUsers();
      loadStats();

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Delete user error:", err);
      setMessage("Failed to delete user");
      setMessageType("error");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditRole("");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="user-management-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Only admins can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="user-management-container">
        <div className="management-header">
          <div>
            <p className="page-label">Smart Campus</p>
            <h1>User Management</h1>
            <p className="page-subtitle">
              Manage system users, view their roles, and update permissions as
              needed.
            </p>
          </div>
        </div>

        {message && (
          <div className={`message-box ${messageType}`}>{message}</div>
        )}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Users</span>
              <h2>{stats.TOTAL}</h2>
            </div>

            <div className="stat-card">
              <span>Admins</span>
              <h2>{stats.ADMIN}</h2>
            </div>

            <div className="stat-card">
              <span>Technicians</span>
              <h2>{stats.TECHNICIAN}</h2>
            </div>

            <div className="stat-card">
              <span>Regular Users</span>
              <h2>{stats.USER}</h2>
            </div>
          </div>
        )}

        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="role-filter">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="TECHNICIAN">Technicians</option>
              <option value="USER">Users</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="empty-text">No users found.</p>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-name-cell">
                        <span className="user-avatar">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {editingId === u.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="role-select"
                        >
                          <option value="USER">USER</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`role-badge role-${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editingId === u.id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleEditSave(u.id)}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditStart(u.id, u.role)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(u.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
