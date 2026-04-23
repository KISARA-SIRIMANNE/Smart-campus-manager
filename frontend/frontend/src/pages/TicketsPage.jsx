import { useEffect, useState } from "react";
import {
  assignTechnician,
  createTicket,
  getTickets,
  updateTicketStatus,
} from "../api/ticketApi";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
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
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      setMessage(err.response?.data?.error || "Ticket creation failed");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (id) => {
    const technicianId = prompt("Enter Technician ID:");
    const resolutionNotes = prompt("Enter Resolution Notes:");

    if (!technicianId || !resolutionNotes) return;

    try {
      await assignTechnician(id, technicianId, resolutionNotes);
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h2>Tickets</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: "30px" }}>
        <input
          name="resourceId"
          placeholder="Resource ID"
          value={form.resourceId}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br /><br />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <br /><br />
        <input
          name="preferredContact"
          placeholder="Preferred Contact"
          value={form.preferredContact}
          onChange={handleChange}
        />
        <br /><br />
        <button type="submit">Create Ticket</button>
      </form>

      <p>{message}</p>

      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Technician:</strong> {ticket.assignedTechnicianId || "Not assigned"}</p>
            <p><strong>Resolution:</strong> {ticket.resolutionNotes || "N/A"}</p>

            {user?.role === "ADMIN" && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => handleStatus(ticket.id, "OPEN")}>Open</button>
                <button onClick={() => handleStatus(ticket.id, "IN_PROGRESS")}>In Progress</button>
                <button onClick={() => handleStatus(ticket.id, "RESOLVED")}>Resolved</button>
                <button onClick={() => handleAssign(ticket.id)}>Assign Technician</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}