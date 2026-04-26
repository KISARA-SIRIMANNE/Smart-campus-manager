import { useEffect, useMemo, useState } from "react";
import {
  createResource,
  deleteResource,
  updateResource,
  getResources,
} from "../api/resourceApi";
import "./ResourcesPage.css";

const RESOURCE_CATEGORIES = [
  "Lecture Hall",
  "Laboratory",
  "Meeting Room",
  "Library",
  "Study Space",
  "Sports Facility",
  "Equipment",
  "Other"
];

const CAPACITY_CATEGORIES = ["Lecture Hall", "Laboratory", "Meeting Room", "Study Space"];

const initialForm = {
  name: "",
  category: "",
  capacity: "",
  location: "",
  description: "",
  availabilityStatus: "AVAILABLE",
};

// Avatar color map based on first letter
const avatarColors = {
  A: { bg: "#fce7f3", color: "#db2777" },
  B: { bg: "#fef3c7", color: "#d97706" },
  C: { bg: "#ede9fe", color: "#7c3aed" },
  D: { bg: "#dbeafe", color: "#2563eb" },
  E: { bg: "#dcfce7", color: "#16a34a" },
  F: { bg: "#fee2e2", color: "#dc2626" },
  G: { bg: "#fef9c3", color: "#ca8a04" },
  H: { bg: "#e0f2fe", color: "#0284c7" },
  I: { bg: "#f0fdf4", color: "#15803d" },
  J: { bg: "#fdf4ff", color: "#a21caf" },
  K: { bg: "#fff7ed", color: "#c2410c" },
  L: { bg: "#ede9fe", color: "#6d28d9" },
  M: { bg: "#fce7f3", color: "#be185d" },
  N: { bg: "#ecfdf5", color: "#059669" },
  O: { bg: "#fef3c7", color: "#b45309" },
  P: { bg: "#dcfce7", color: "#15803d" },
  Q: { bg: "#dbeafe", color: "#1d4ed8" },
  R: { bg: "#fef9c3", color: "#a16207" },
  S: { bg: "#fce7f3", color: "#db2777" },
  T: { bg: "#e0f2fe", color: "#0369a1" },
  U: { bg: "#ede9fe", color: "#7c3aed" },
  V: { bg: "#dcfce7", color: "#16a34a" },
  W: { bg: "#fee2e2", color: "#b91c1c" },
  X: { bg: "#fef3c7", color: "#92400e" },
  Y: { bg: "#fdf4ff", color: "#86198f" },
  Z: { bg: "#e0f2fe", color: "#075985" },
};

function getAvatarStyle(letter) {
  const key = letter?.toUpperCase();
  return avatarColors[key] || { bg: "#e2e8f0", color: "#475569" };
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState(initialForm);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await getResources();
      setResources(res.data || []);
    } catch (err) {
      console.error("Resource fetch error:", err);
      setMessage("Failed to load resources");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (user?.role !== "ADMIN") {
      setMessage("Only admin can add resources");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);
      await createResource(form);
      setMessage("Resource created successfully!");
      setMessageType("success");
      setForm(initialForm);
      loadResources();
    } catch (err) {
      console.error("Create resource error:", err);
      setMessage("Failed to create resource");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (user?.role !== "ADMIN") {
      setMessage("Only admin can delete resources");
      setMessageType("error");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );
    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      setMessage("Resource deleted successfully!");
      setMessageType("success");
      loadResources();
    } catch (err) {
      console.error("Delete resource error:", err);
      setMessage("Failed to delete resource");
      setMessageType("error");
    }
  };

  const handleEditStart = (resource) => {
    setEditingId(resource.id);
    setEditForm(resource);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    if (user?.role !== "ADMIN") {
      setMessage("Only admin can update resources");
      setMessageType("error");
      return;
    }

    if (!editForm.category) {
      setMessage("Category is required");
      setMessageType("error");
      return;
    }

    if (!editForm.location) {
      setMessage("Location is required");
      setMessageType("error");
      return;
    }

    try {
      await updateResource(id, editForm);
      setMessage("Resource updated successfully!");
      setMessageType("success");
      setEditingId(null);
      setEditForm({});
      loadResources();
    } catch (err) {
      console.error("Update resource error:", err);
      setMessage("Failed to update resource");
      setMessageType("error");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const searchText = `${resource.name} ${resource.capacity || ""} ${resource.category} ${resource.location} ${resource.description}`
        .toLowerCase();

  const resourceTypes = useMemo(() => {
    const types = resources.map((r) => r.type).filter(Boolean);
    return ["ALL", ...new Set(types)];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const searchText =
        `${resource.name} ${resource.type} ${resource.location} ${resource.description}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        resource.availabilityStatus === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || resource.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
        statusFilter === "ALL" || resource.availabilityStatus === statusFilter;
      const matchesType = typeFilter === "ALL" || resource.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [resources, searchTerm, statusFilter, categoryFilter]);

  const availableCount = resources.filter(
    (r) => r.availabilityStatus === "AVAILABLE"
  ).length;

  const unavailableCount = resources.filter(
    (r) => r.availabilityStatus === "UNAVAILABLE"
  ).length;

  return (
    <div className="rp-page">
      <div className="rp-container">

        {/* Header */}
        <div className="rp-header">
          <div className="rp-header-left">
            <div className="rp-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              Smart Campus
            </div>
            <h1 className="rp-title">Resource Management</h1>
            <p className="rp-subtitle">
              View, search, filter, and manage campus resources such as labs,
              rooms, projectors, and equipment.
            </p>
          </div>
          <div className="rp-role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {user?.role === "ADMIN" ? "Admin Panel" : "User View"}
          </div>
        </div>

        {/* Stats */}
        <div className="rp-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-icon rp-stat-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="rp-stat-info">
              <span className="rp-stat-label">Total Resources</span>
              <span className="rp-stat-value">{resources.length}</span>
            </div>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-icon rp-stat-icon--green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="rp-stat-info">
              <span className="rp-stat-label">Available</span>
              <span className="rp-stat-value">{availableCount}</span>
            </div>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-icon rp-stat-icon--orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
            </div>
            <div className="rp-stat-info">
              <span className="rp-stat-label">Unavailable</span>
              <span className="rp-stat-value">{unavailableCount}</span>
            </div>
          </div>
        </div>

        {/* Info / Message */}
        {user?.role !== "ADMIN" && (
          <div className="rp-info-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            You are currently in User View. You can search and filter resources.
            Adding and deleting resources requires Admin privileges.
          </div>
        )}

        {message && (
          <div className={`rp-message rp-message--${messageType}`}>{message}</div>
        )}

        {/* Admin Form */}
        {user?.role === "ADMIN" && (
          <div className="rp-form-card">
            <div className="rp-form-header">
              <h2>Add New Resource</h2>
              <p>Add campus resources with location and availability status.</p>
            </div>
            <form onSubmit={handleCreate} className="rp-form">
              <div className="rp-form-grid">
                <input
                  name="name"
                  placeholder="Resource Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {RESOURCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {CAPACITY_CATEGORIES.includes(form.category) && (
                  <input
                    name="capacity"
                    placeholder="Capacity (e.g., 50, 100)"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                  />
                )}

                <input
                  name="type"
                  placeholder="Type e.g. Room, Lab, Equipment"
                  value={form.type}
                  onChange={handleChange}
                  required
                />
                <input
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                </select>
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
              <button type="submit" className="rp-btn-primary" disabled={submitting}>
                {submitting ? "Adding..." : "+ Add Resource"}
              </button>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="rp-toolbar">
          <h2 className="rp-toolbar-title">Available Resources</h2>
          <span className="rp-toolbar-count">
            Showing {filteredResources.length} of {resources.length}
          </span>
        </div>

        {/* Filters */}
        <div className="rp-filter-bar">
          <div className="rp-search-wrap">
            <svg className="rp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search resources by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rp-search-input"
            />
          </div>

          <div className="rp-select-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rp-filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

        <div className="filter-card">
          <input
            type="text"
            placeholder="Search by name, type, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Types</option>
            {RESOURCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="rp-select-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rp-filter-select"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <p className="rp-empty">Loading resources...</p>
        ) : filteredResources.length === 0 ? (
          <p className="rp-empty">No matching resources found.</p>
        ) : (
          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <div className="resource-card" key={resource.id}>
                {editingId === resource.id ? (
                  // Edit Mode
                  <div className="edit-mode">
                    <div className="edit-form-compact">
                      <input
                        name="name"
                        placeholder="Resource Name"
                        value={editForm.name || ""}
                        onChange={handleEditChange}
                        className="edit-input"
                      />

                      <select
                        name="category"
                        value={editForm.category || ""}
                        onChange={handleEditChange}
                        className="edit-select"
                      >
                        <option value="">Select Category</option>
                        {RESOURCE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      {CAPACITY_CATEGORIES.includes(editForm.category) && (
                        <input
                          name="capacity"
                          placeholder="Capacity"
                          type="number"
                          value={editForm.capacity || ""}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      )}

                      <input
                        name="location"
                        placeholder="Location"
                        value={editForm.location || ""}
                        onChange={handleEditChange}
                        className="edit-input"
                      />

                      <select
                        name="availabilityStatus"
                        value={editForm.availabilityStatus || "AVAILABLE"}
                        onChange={handleEditChange}
                        className="edit-select"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="UNAVAILABLE">UNAVAILABLE</option>
                      </select>

                      <textarea
                        name="description"
                        placeholder="Description"
                        value={editForm.description || ""}
                        onChange={handleEditChange}
                        className="edit-textarea"
                        rows="2"
                      />

                      <div className="edit-buttons">
                        <button
                          className="save-btn"
                          onClick={() => handleEditSave(resource.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="card-top">
                      <div className="resource-icon">
                        {resource.name?.charAt(0)?.toUpperCase() || "R"}
                      </div>

                      <span
                        className={
                          resource.availabilityStatus === "AVAILABLE"
                            ? "status available"
                            : "status unavailable"
                        }
                      >
                        {resource.availabilityStatus}
                      </span>
                    </div>

                    <h3>{resource.name}</h3>

                    <div className="resource-details">
                      <p>
                        <strong>Category:</strong> {resource.category || "Not specified"}
                      </p>
                      {resource.capacity && (
                        <p>
                          <strong>Capacity:</strong> {resource.capacity}
                        </p>
                      )}
                      <p>
                        <strong>Location:</strong> {resource.location}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {resource.description || "No description added"}
                      </p>
                    </div>

                    {user?.role === "ADMIN" && (
                      <div className="admin-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditStart(resource)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(resource.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          <div className="rp-grid">
            {filteredResources.map((resource) => {
              const letter = resource.name?.charAt(0)?.toUpperCase() || "R";
              const avatarStyle = getAvatarStyle(letter);
              return (
                <div className="rp-card" key={resource.id}>
                  <div className="rp-card-top">
                    <div
                      className="rp-avatar"
                      style={{ background: avatarStyle.bg, color: avatarStyle.color }}
                    >
                      {letter}
                    </div>
                    <span
                      className={`rp-status ${
                        resource.availabilityStatus === "AVAILABLE"
                          ? "rp-status--available"
                          : "rp-status--unavailable"
                      }`}
                    >
                      {resource.availabilityStatus}
                    </span>
                  </div>

                  <h3 className="rp-card-name">{resource.name}</h3>

                  <div className="rp-card-meta">
                    <span className="rp-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                      {resource.type}
                    </span>
                    <span className="rp-meta-dot">·</span>
                    <span className="rp-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {resource.location}
                    </span>
                  </div>

                  {resource.description && (
                    <p className="rp-card-desc">{resource.description}</p>
                  )}

                  {user?.role === "ADMIN" && (
                    <button
                      className="rp-btn-delete"
                      onClick={() => handleDelete(resource.id)}
                    >
                      Delete Resource
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
