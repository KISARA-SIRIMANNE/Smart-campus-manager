import { useEffect, useState } from "react";
import {
  approveBooking,
  createBooking,
  getBookings,
  rejectBooking,
} from "../api/bookingApi";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    userId: user?.userId || "",
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createBooking(form);
      setMessage("Booking created successfully!");
      setForm({
        userId: user?.userId || "",
        resourceId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });
      loadBookings();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Booking creation failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h2>Bookings</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: "30px" }}>
        <input
          name="resourceId"
          placeholder="Resource ID"
          value={form.resourceId}
          onChange={handleChange}
        />
        <br /><br />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <br /><br />
        <input
          name="startTime"
          type="time"
          value={form.startTime}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="endTime"
          type="time"
          value={form.endTime}
          onChange={handleChange}
        />
        <br /><br />
        <input
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
        />
        <br /><br />
        <button type="submit">Create Booking</button>
      </form>

      <p>{message}</p>

      <div>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <p><strong>Resource:</strong> {booking.resourceId}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
            <p><strong>Purpose:</strong> {booking.purpose}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            {user?.role === "ADMIN" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleApprove(booking.id)}>Approve</button>
                <button onClick={() => handleReject(booking.id)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}