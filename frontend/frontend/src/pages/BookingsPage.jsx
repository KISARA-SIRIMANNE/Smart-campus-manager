import { useEffect, useState, useRef } from "react";
import {
  approveBooking,
  cancelBooking,
  createBooking,
  deleteBooking,
  getBookings,
  rejectBooking,
  updateBooking,
} from "../api/bookingApi";
import { getResources } from "../api/resourceApi";
import RejectionModal from "../components/RejectionModal";
import "./BookingsPage.css";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingSearchTerm, setBookingSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const resourceSearchRef = useRef(null);

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

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data || []);
      setFilteredResources(res.data || []);
    } catch (err) {
      console.error("Error loading resources:", err);
    }
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    return resource?.name || "Unknown Resource";
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
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // If start time changes and it's after end time, clear end time
    if (name === "startTime" && updatedForm.endTime && value > updatedForm.endTime) {
      updatedForm.endTime = "";
    }

    setForm(updatedForm);
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await createBooking(form);
      setMessage("✓ Booking created successfully!");
      setMessageType("success");
      setForm({
        userId: user?.userId || "",
        resourceId: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });
      setSearchTerm("");
      loadBookings();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking creation failed";
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

  const getFilteredBookings = () => {
    if (!bookingSearchTerm.trim()) {
      return bookings;
    }

    const searchLower = bookingSearchTerm.toLowerCase();
    return bookings.filter((booking) => {
      const resourceName = getResourceName(booking.resourceId).toLowerCase();
      const purpose = booking.purpose?.toLowerCase() || "";
      const date = booking.date?.toLowerCase() || "";
      const status = booking.status?.toLowerCase() || "";

      return (
        resourceName.includes(searchLower) ||
        purpose.includes(searchLower) ||
        date.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  };

  const handleReject = async (id) => {
    setRejectingBookingId(id);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    try {
      setMessage("");
      await rejectBooking(rejectingBookingId, reason);
      setMessage("✓ Booking rejected successfully!");
      setMessageType("success");
      setShowRejectionModal(false);
      setRejectingBookingId(null);
      loadBookings();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking rejection failed";
      setMessage("✗ " + errorMsg);
      setMessageType("error");
      setShowRejectionModal(false);
      setRejectingBookingId(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectionModal(false);
    setRejectingBookingId(null);
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: booking.purpose,
      resourceId: booking.resourceId,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveEdit = async (id) => {
    try {
      setMessage("");
      await updateBooking(id, editForm);
      setMessage("✓ Booking updated successfully!");
      setMessageType("success");
      setEditingId(null);
      loadBookings();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking update failed";
      setMessage("✗ " + errorMsg);
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        setMessage("");
        await deleteBooking(id);
        setMessage("✓ Booking deleted successfully!");
        setMessageType("success");
        loadBookings();
        setTimeout(() => setMessage(""), 4000);
      } catch (err) {
        console.error(err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking deletion failed";
        setMessage("✗ " + errorMsg);
        setMessageType("error");
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this approved booking?")) {
      try {
        setMessage("");
        await cancelBooking(id);
        setMessage("✓ Booking cancelled successfully!");
        setMessageType("success");
        loadBookings();
        setTimeout(() => setMessage(""), 4000);
      } catch (err) {
        console.error(err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking cancellation failed";
        setMessage("✗ " + errorMsg);
        setMessageType("error");
      }
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
                  min={form.startTime}
                  disabled={!form.startTime}
                  required
                  title={!form.startTime ? "Please select start time first" : ""}
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
          <div className="bookings-count">{getFilteredBookings().length} booking{getFilteredBookings().length !== 1 ? "s" : ""}</div>
        </div>

        {/* Search Filter for Bookings */}
        <div className="booking-search-card">
          <input
            type="text"
            placeholder="Search bookings by resource, purpose, or date..."
            value={bookingSearchTerm}
            onChange={(e) => setBookingSearchTerm(e.target.value)}
            className="booking-search-input"
          />
        </div>

        {getFilteredBookings().length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>{bookingSearchTerm ? "No bookings match your search." : "No bookings yet. Create one to get started!"}</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {getFilteredBookings().map((booking) => (
              <div key={booking.id} className="booking-card">
                {editingId === booking.id ? (
                  // Edit Mode
                  <div className="booking-edit-form">
                    <h3>Edit Booking</h3>
                    <div className="edit-form-group">
                      <label>Resource</label>
                      <select
                        name="resourceId"
                        value={editForm.resourceId}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Resource</option>
                        {resources.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={editForm.startTime}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={editForm.endTime}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Purpose</label>
                      <input
                        type="text"
                        name="purpose"
                        value={editForm.purpose}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-form-actions">
                      <button
                        className="btn-action save"
                        onClick={() => handleSaveEdit(booking.id)}
                      >
                        💾 Save
                      </button>
                      <button
                        className="btn-action cancel"
                        onClick={() => setEditingId(null)}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
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
                          {getResourceName(booking.resourceId)}
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

                      {booking.rejectionReason && booking.status === "REJECTED" && (
                        <div className="booking-field rejection-reason">
                          <div className="booking-field-label">⛔ Rejection Reason</div>
                          <div className="booking-field-value">{booking.rejectionReason}</div>
                        </div>
                      )}

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

                    {user?.userId === booking.userId && booking.status === "PENDING" && (
                      <div className="booking-user-actions">
                        <button
                          className="btn-action edit"
                          onClick={() => handleEdit(booking)}
                          title="Edit booking"
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDelete(booking.id)}
                          title="Delete booking"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}

                    {user?.userId === booking.userId && booking.status === "APPROVED" && (
                      <div className="booking-user-actions">
                        <button
                          className="btn-action cancel-booking"
                          onClick={() => handleCancel(booking.id)}
                          title="Cancel approved booking"
                        >
                          ⊗ Cancel Booking
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

      <RejectionModal
        isOpen={showRejectionModal}
        itemType="Booking"
        onConfirm={handleRejectConfirm}
        onCancel={handleRejectCancel}
      />
    </div>
  );
}
