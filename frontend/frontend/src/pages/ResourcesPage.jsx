import { useEffect, useMemo, useState } from "react";
import {
  createResource,
  deleteResource,
  getResources,
} from "../api/resourceApi";
import "./ResourcesPage.css";

const initialForm = {
  name: "",
  type: "",
  location: "",
  description: "",
  availabilityStatus: "AVAILABLE",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [form, setForm] = useState(initialForm);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await getResources();
      setResources(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load resources.");
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

  const validateForm = () => {
    if (!form.name.trim() || !form.type.trim() || !form.location.trim() || !form.description.trim()) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await createResource(form);
      setMessage("Resource created successfully!");
      setMessageType("success");
      setForm(initialForm);
      loadResources();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create resource.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      setMessage("Resource deleted successfully!");
      setMessageType("success");
      loadResources();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete resource.");
      setMessageType("error");
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name?.toLowerCase().includes(search.toLowerCase()) ||
        resource.type?.toLowerCase().includes(search.toLowerCase()) ||
        resource.location?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        resource.availabilityStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [resources, search, statusFilter]);

  return (
    <div className="resources-page">
      <div className="resources-overlay"></div>

      <div className="resources-container">
        <div className="resources-header">
          <div>
            <p className="resources-tag">Smart Campus</p>
            <h1>Resource Management</h1>
            <p className="resources-subtitle">
              Add, manage, search, and monitor campus resources in one place.
            </p>
          </div>

          <div className="resources-stats">
            <div className="stat-card">
              <span>Total Resources</span>
              <h2>{resources.length}</h2>
            </div>
            <div className="stat-card">
              <span>Available</span>
              <h2>
                {
                  resources.filter(
                    (item) => item.availabilityStatus === "AVAILABLE"
                  ).length
                }
              </h2>
            </div>
            <div className="stat-card">
              <span>Unavailable</span>
              <h2>
                {
                  resources.filter(
                    (item) => item.availabilityStatus === "UNAVAILABLE"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="resources-grid">
          <div className="resources-form-card">
            <div className="card-top">
              <h2>Add New Resource</h2>
              <p>Enter resource details below.</p>
            </div>

            <form onSubmit={handleCreate} className="resource-form">
              <div className="form-group">
                <label>Resource Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter resource name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  placeholder="Enter resource type"
                  value={form.type}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter resource location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter resource description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                </select>
              </div>

              <button type="submit" className="primary-btn" disabled={submitting}>
                {submitting ? "Adding..." : "Add Resource"}
              </button>
            </form>

            {message && (
              <div className={`form-message ${messageType}`}>{message}</div>
            )}
          </div>

          <div className="resources-list-card">
            <div className="card-top">
              <h2>All Resources</h2>
              <p>Search and manage your existing resources.</p>
            </div>

            <div className="toolbar">
              <input
                type="text"
                placeholder="Search by name, type, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            </div>

            {loading ? (
              <div className="empty-state">
                <p>Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="empty-state">
                <p>No resources found.</p>
              </div>
            ) : (
              <div className="resource-list">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-card-header">
                      <div>
                        <h3>{resource.name}</h3>
                        <p className="resource-type">{resource.type}</p>
                      </div>

                      <span
                        className={`status-badge ${
                          resource.availabilityStatus === "AVAILABLE"
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        {resource.availabilityStatus}
                      </span>
                    </div>

                    <div className="resource-info">
                      <p>
                        <strong>Location:</strong> {resource.location}
                      </p>
                      <p>
                        <strong>Description:</strong> {resource.description}
                      </p>
                    </div>

                    <div className="resource-actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(resource.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}