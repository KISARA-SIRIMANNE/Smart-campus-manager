import { useEffect, useState } from "react";
import {
  assignTechnician,
  createTicket,
  getTickets,
  rejectTicket,
  updateTicketStatus,
} from "../api/ticketApi";
import RejectionModal from "../components/RejectionModal";
import "./TicketsPage.css";

const INCIDENT_TYPES = [
  "Technical Issue",
  "Maintenance Request",
  "Safety Concern",
  "Facility Damage",
  "Equipment Problem",
  "Network Issue",
  "Cleanliness Issue",
  "Other"
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectingTicketId, setRejectingTicketId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    userId: user?.userId || "",
    incidentType: "",
    location: "",
    description: "",
    priority: "HIGH",
    preferredContact: "",
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error("Ticket fetch error:", err);
      setMessage("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createTicket(form);
      setMessage("Ticket created successfully!");

      setForm({
        userId: user?.userId || "",
        resourceId: "",
        category: "",
        description: "",
        priority: "HIGH",
        preferredContact: "",
      });

      loadTickets();
    } catch (err) {
      console.error("Create ticket error:", err);
      setMessage(err.response?.data?.error || "Ticket creation failed");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      setMessage("Ticket status updated successfully!");
      loadTickets();
    } catch (err) {
      console.error("Status update error:", err);
      setMessage("Failed to update ticket status");
    }
  };

  const handleAssign = async (id) => {
    const technicianId = prompt("Enter Technician ID:");
    const resolutionNotes = prompt("Enter Resolution Notes:");

    if (!technicianId || !resolutionNotes) return;

    try {
      await assignTechnician(id, technicianId, resolutionNotes);
      setMessage("Technician assigned successfully!");
      loadTickets();
    } catch (err) {
      console.error("Assign technician error:", err);
      setMessage("Failed to assign technician");
    }
  };

  const handleReject = async (id) => {
    setRejectingTicketId(id);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    try {
      setMessage("");
      await rejectTicket(rejectingTicketId, reason);
      setMessage("Ticket rejected successfully!");
      setShowRejectionModal(false);
      setRejectingTicketId(null);
      loadTickets();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Reject ticket error:", err);
      setMessage("Failed to reject ticket");
      setShowRejectionModal(false);
      setRejectingTicketId(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectionModal(false);
    setRejectingTicketId(null);
  };

  const getFilteredTickets = () => {
    let filtered = tickets;

    // Filter by search term
    if (ticketSearchTerm.trim()) {
      const searchLower = ticketSearchTerm.toLowerCase();
      filtered = filtered.filter((ticket) => {
        const incidentType = ticket.incidentType?.toLowerCase() || "";
        const description = ticket.description?.toLowerCase() || "";
        const priority = ticket.priority?.toLowerCase() || "";
        const status = ticket.status?.toLowerCase() || "";

        return (
          incidentType.includes(searchLower) ||
          description.includes(searchLower) ||
          priority.includes(searchLower) ||
          status.includes(searchLower)
        );
      });
    }

    // Filter by priority
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    return filtered;
  };

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <p className="page-label">Smart Campus</p>
          <h1>Incident Report System</h1>
          <p>
            Report and track incidents, maintenance requests, and issues across campus.
          </p>
        </div>

        <div className="role-badge">
          {user?.role === "ADMIN" ? "Admin Panel" : "User Panel"}
        </div>
      </div>

      {message && <div className="message-box">{message}</div>}

      {user?.role !== "ADMIN" && (
        <div className="form-card">
          <h2>Report an Incident</h2>

          <form onSubmit={handleCreate} className="ticket-form">
            <div className="form-grid">
              <select
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                required
              >
                <option value="">Select Incident Type</option>
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                name="location"
                placeholder="Location (e.g., Building A, Room 101)"
                value={form.location}
                onChange={handleChange}
              />

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              <input
                name="preferredContact"
                placeholder="Preferred Contact"
                value={form.preferredContact}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Describe the issue"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />

            <button type="submit" className="primary-btn">
              + Create Ticket
            </button>
          </form>
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="info-box">
          Admin can view incidents, update status and assign technicians.
        </div>
      )}

      <div className="section-title">
        <h2>Incidents List</h2>
        <span>{getFilteredTickets().length} Incidents</span>
      </div>

      {/* Search Filter for Incidents */}
      <div className="ticket-search-card">
        <input
          type="text"
          placeholder="Search incidents by type, description, priority, or status..."
          value={ticketSearchTerm}
          onChange={(e) => setTicketSearchTerm(e.target.value)}
          className="ticket-search-input"
        />
      </div>

      {/* Priority & Status Filters */}
      {user?.role === "ADMIN" && (
        <div className="ticket-filters">
          <div className="filter-group">
            <label>Priority:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${priorityFilter === "ALL" ? "active" : ""}`}
                onClick={() => setPriorityFilter("ALL")}
              >
                All
              </button>
              <button
                className={`filter-btn priority-high ${priorityFilter === "HIGH" ? "active" : ""}`}
                onClick={() => setPriorityFilter("HIGH")}
              >
                High
              </button>
              <button
                className={`filter-btn priority-medium ${priorityFilter === "MEDIUM" ? "active" : ""}`}
                onClick={() => setPriorityFilter("MEDIUM")}
              >
                Medium
              </button>
              <button
                className={`filter-btn priority-low ${priorityFilter === "LOW" ? "active" : ""}`}
                onClick={() => setPriorityFilter("LOW")}
              >
                Low
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                All
              </button>
              <button
                className={`filter-btn status-open ${statusFilter === "OPEN" ? "active" : ""}`}
                onClick={() => setStatusFilter("OPEN")}
              >
                Open
              </button>
              <button
                className={`filter-btn status-progress ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
                onClick={() => setStatusFilter("IN_PROGRESS")}
              >
                In Progress
              </button>
              <button
                className={`filter-btn status-resolved ${statusFilter === "RESOLVED" ? "active" : ""}`}
                onClick={() => setStatusFilter("RESOLVED")}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="empty-text">Loading incidents...</p>
      ) : getFilteredTickets().length === 0 ? (
        <p className="empty-text">{ticketSearchTerm ? "No incidents match your search." : "No incidents found."}</p>
      ) : (
        <div className="tickets-grid">
          {getFilteredTickets().map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div className="card-top">
                <span className={`priority ${ticket.priority?.toLowerCase()}`}>
                  {ticket.priority}
                </span>

                <span className={`status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>

              <h3>{ticket.incidentType}</h3>

              <div className="ticket-details">
                {ticket.location && (
                  <p>
                    <strong>Location:</strong> {ticket.location}
                  </p>
                )}
                <p>
                  <strong>Description:</strong> {ticket.description}
                </p>
                <p>
                  <strong>Technician:</strong>{" "}
                  {ticket.assignedTechnicianId || "Not assigned"}
                </p>
                <p>
                  <strong>Resolution:</strong>{" "}
                  {ticket.resolutionNotes || "N/A"}
                </p>
                {ticket.rejectionReason && ticket.status === "REJECTED" && (
                  <p style={{ color: "#991b1b", backgroundColor: "#fee2e2", padding: "8px", borderRadius: "4px" }}>
                    <strong>⛔ Rejection Reason:</strong> {ticket.rejectionReason}
                  </p>
                )}
              </div>

              {user?.role === "ADMIN" && (
                <div className="action-buttons">
                  <button onClick={() => handleStatus(ticket.id, "OPEN")}>
                    Open
                  </button>
                  <button onClick={() => handleStatus(ticket.id, "IN_PROGRESS")}>
                    In Progress
                  </button>
                  <button onClick={() => handleStatus(ticket.id, "RESOLVED")}>
                    Resolved
                  </button>
                  <button
                    className="assign-btn"
                    onClick={() => handleAssign(ticket.id)}
                  >
                    Assign Technician
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(ticket.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <RejectionModal
        isOpen={showRejectionModal}
        itemType="Ticket"
        onConfirm={handleRejectConfirm}
        onCancel={handleRejectCancel}
      />
    </div>
  );
}