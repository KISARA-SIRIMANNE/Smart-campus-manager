import { useEffect, useState, useRef } from "react";
import {
  approveBooking,
  createBooking,
  getBookings,
  rejectBooking,
} from "../api/bookingApi";
import { getResources } from "../api/resourceApi";
import "./BookingsPage.css";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const resourceSearchRef = useRef(null);
  const [attendeeInput, setAttendeeInput] = useState("");

  const [form, setForm] = useState({
    userId: user?.userId || "",
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: [],
  });

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data || []);
      setFilteredResources(res.data || []);
    } catch (err) {
      console.error("Error loading resources:", err);
    }
  };

  useEffect(() => {
    loadBookings();
    loadResources();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourceSearchRef.current && !resourceSearchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResourceSearch = (value) => {
    setSearchTerm(value);
    setShowDropdown(true);

    if (!value.trim()) {
      setFilteredResources(resources);
    } else {
      const searchLower = value.toLowerCase();
      const filtered = resources.filter((resource) => {
        const nameMatch = resource.name?.toLowerCase().includes(searchLower);
        const idMatch = resource.id?.toString().toLowerCase().includes(searchLower);
        return nameMatch || idMatch;
      });
      setFilteredResources(filtered);
    }
  };

  const handleResourceSelect = (resource) => {
    setForm({ ...form, resourceId: resource.id });
    setSearchTerm(resource.name || resource.id);
    setShowDropdown(false);
  };

  const handleAddAttendee = () => {
    const email = attendeeInput.trim();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Check if attendee already added
    if (form.attendees.includes(email)) {
      alert("This attendee is already added");
      return;
    }

    setForm({
      ...form,
      attendees: [...form.attendees, email],
    });
    setAttendeeInput("");
  };

  const handleRemoveAttendee = (index) => {
    setForm({
      ...form,
      attendees: form.attendees.filter((_, i) => i !== index),
    });
  };

  const handleAttendeeKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createBooking(form);
      setMessage("✓ Booking created successfully!");
      setMessageType("success");
      setForm({
        userId: user?.userId || "",
        resourceId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        attendees: [],
      });
      setSearchTerm("");
      setAttendeeInput("");
      loadBookings();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Booking creation failed";
      setMessage("✗ " + errorMsg);
      setMessageType("error");
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

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "booking-status-badge approved";
      case "rejected":
        return "booking-status-badge rejected";
      case "pending":
      default:
        return "booking-status-badge pending";
    }
  };

  return (
    <div className="bookings-container">
      <div className="bookings-wrapper">
        {/* Header */}
        <div className="bookings-header">
          <h1>Resource Bookings</h1>
          <p>Book and manage campus resources</p>
        </div>

        {/* Create Booking Form */}
        <div className="bookings-form-section">
          <div className="form-title">
            <span>📅</span> Create New Booking
          </div>

          <form onSubmit={handleCreate}>
            {message && (
              <div className={`message-alert message-${messageType}`}>
                <span>{message}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="resourceSearch">Select Resource</label>
                <div className="resource-search-container" ref={resourceSearchRef}>
                  <input
                    id="resourceSearch"
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => handleResourceSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    required={!form.resourceId}
                  />
                  {showDropdown && filteredResources.length > 0 && (
                    <div className="resource-dropdown">
                      {filteredResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="resource-option"
                          onClick={() => handleResourceSelect(resource)}
                        >
                          <div className="resource-name">
                            {resource.name || `Unnamed Resource`}
                          </div>
                          <div className="resource-id-small">ID: {resource.id}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showDropdown && filteredResources.length === 0 && searchTerm && (
                    <div className="resource-dropdown">
                      <div className="resource-option-empty">
                        No resources found for "{searchTerm}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="date">Booking Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="purpose">Purpose</label>
                <input
                  id="purpose"
                  name="purpose"
                  placeholder="What will you be using this for?"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="attendeeInput">Add Attendees</label>
                <div className="attendee-input-container">
                  <div className="attendee-input-row">
                    <input
                      id="attendeeInput"
                      type="email"
                      placeholder="Enter attendee email..."
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      onKeyPress={handleAttendeeKeyPress}
                    />
                    <button
                      type="button"
                      className="btn-add-attendee"
                      onClick={handleAddAttendee}
                      title="Add attendee"
                    >
                      + Add
                    </button>
                  </div>

                  {form.attendees.length > 0 && (
                    <div className="attendees-list">
                      {form.attendees.map((attendee, index) => (
                        <div key={index} className="attendee-tag">
                          <span className="attendee-email">{attendee}</span>
                          <button
                            type="button"
                            className="attendee-remove"
                            onClick={() => handleRemoveAttendee(index)}
                            title="Remove attendee"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Create Booking
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bookings List */}
        <div className="bookings-list-header">
          <h2>Your Bookings</h2>
          <div className="bookings-count">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</div>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No bookings yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">Booking #{booking.id}</div>
                  <span className={`booking-status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-content">
                  <div className="booking-field">
                    <div className="booking-field-label">Resource</div>
                    <div className="booking-field-value highlight">
                      Resource ID: {booking.resourceId}
                    </div>
                  </div>

                  <div className="booking-datetime">
                    <div className="booking-datetime-item">
                      <span className="booking-datetime-label">📅 Date</span>
                      <span className="booking-datetime-value">{booking.date}</span>
                    </div>
                    <div className="booking-datetime-item">
                      <span className="booking-datetime-label">⏱️ Time</span>
                      <span className="booking-datetime-value">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="booking-field">
                    <div className="booking-field-label">Purpose</div>
                    <div className="booking-field-value">{booking.purpose}</div>
                  </div>

                  {booking.attendees && booking.attendees.length > 0 && (
                    <div className="booking-field">
                      <div className="booking-field-label">👥 Attendees ({booking.attendees.length})</div>
                      <div className="booking-attendees-list">
                        {booking.attendees.map((attendee, idx) => (
                          <div key={idx} className="booking-attendee-item">
                            {attendee}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {user?.role === "ADMIN" && booking.status === "PENDING" && (
                  <div className="booking-actions">
                    <button
                      className="btn-action approve"
                      onClick={() => handleApprove(booking.id)}
                      title="Approve booking"
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn-action reject"
                      onClick={() => handleReject(booking.id)}
                      title="Reject booking"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}