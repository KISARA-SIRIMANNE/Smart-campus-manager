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

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        resource.availabilityStatus === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || resource.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [resources, searchTerm, statusFilter, categoryFilter]);

  const availableCount = resources.filter(
    (resource) => resource.availabilityStatus === "AVAILABLE"
  ).length;

  const unavailableCount = resources.filter(
    (resource) => resource.availabilityStatus === "UNAVAILABLE"
  ).length;

  return (
    <div className="resources-page">
      <div className="resources-container">
        <div className="resources-header">
          <div>
            <p className="page-label">Smart Campus</p>
            <h1>Resource Management</h1>
            <p className="page-subtitle">
              View, search, filter, and manage campus resources such as labs,
              rooms, projectors, and equipment.
            </p>
          </div>

          <div className="role-badge">
            {user?.role === "ADMIN" ? "Admin Panel" : "User View"}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Resources</span>
            <h2>{resources.length}</h2>
          </div>

          <div className="stat-card">
            <span>Available</span>
            <h2>{availableCount}</h2>
          </div>

          <div className="stat-card">
            <span>Unavailable</span>
            <h2>{unavailableCount}</h2>
          </div>
        </div>

        {user?.role !== "ADMIN" && (
          <div className="info-box">
            You can view and search resources. Adding and deleting resources are
            handled by admin.
          </div>
        )}

        {message && (
          <div className={`message-box ${messageType}`}>{message}</div>
        )}

        {user?.role === "ADMIN" && (
          <div className="form-card">
            <div className="card-heading">
              <h2>Add New Resource</h2>
              <p>Add campus resources with location and availability status.</p>
            </div>

            <form onSubmit={handleCreate} className="resource-form">
              <div className="form-grid">
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

              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "+ Add Resource"}
              </button>
            </form>
          </div>
        )}

        <div className="resource-toolbar">
          <div>
            <h2>Available Resources</h2>
            <p>
              Showing {filteredResources.length} of {resources.length} resources
            </p>
          </div>

          <button className="refresh-btn" onClick={loadResources}>
            Refresh
          </button>
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
        </div>

        {loading ? (
          <p className="empty-text">Loading resources...</p>
        ) : filteredResources.length === 0 ? (
          <p className="empty-text">No matching resources found.</p>
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
          </div>
        )}
      </div>
    </div>
  );
}