import { useEffect, useState } from "react";
import {
  assignTechnician,
  createTicket,
  getTickets,
  updateTicketStatus,
} from "../api/ticketApi";
import "./TicketsPage.css";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    userId: user?.userId || "",
    resourceId: "",
    category: "",
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

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <p className="page-label">Smart Campus</p>
          <h1>Incident Ticket Management</h1>
          <p>
            Create, track and manage maintenance tickets for campus resources.
          </p>
        </div>

        <div className="role-badge">
          {user?.role === "ADMIN" ? "Admin Panel" : "User Panel"}
        </div>
      </div>

      {message && <div className="message-box">{message}</div>}

      {user?.role !== "ADMIN" && (
        <div className="form-card">
          <h2>Create New Ticket</h2>

          <form onSubmit={handleCreate} className="ticket-form">
            <div className="form-grid">
              <input
                name="resourceId"
                placeholder="Resource ID"
                value={form.resourceId}
                onChange={handleChange}
                required
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
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
          Admin can view tickets, update status and assign technicians.
        </div>
      )}

      <div className="section-title">
        <h2>Tickets List</h2>
        <span>{tickets.length} Tickets</span>
      </div>

      {loading ? (
        <p className="empty-text">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="empty-text">No tickets found.</p>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div className="card-top">
                <span className={`priority ${ticket.priority?.toLowerCase()}`}>
                  {ticket.priority}
                </span>

                <span className={`status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>

              <h3>{ticket.category}</h3>

              <div className="ticket-details">
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React from 'react';

const TicketsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tickets</h1>
      <p className="text-lg">View and manage support tickets.</p>
    </div>
  );
};

export default TicketsPage;
