import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "../api/authApi";
import { getBookings } from "../api/bookingApi";
import { getResources } from "../api/resourceApi";
import CircularProgress from "../components/CircularProgress";
import "./UserDashboard.css";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [pictureName, setPictureName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserBookings();
    loadResources();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserProfile(user?.userId);
      const userData = response.data;
      
      // Convert base64 string to data URL format if needed
      if (userData.profilePicture && !userData.profilePicture.startsWith("data:")) {
        userData.profilePicture = `data:image/png;base64,${userData.profilePicture}`;
      }
      
      setUserData(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await getBookings();
      const now = new Date();
      
      // Filter bookings for current user and approved status, excluding expired ones
      const userBookings = response.data.filter((booking) => {
        if (booking.userId !== user?.userId || booking.status !== "APPROVED") {
          return false;
        }
        
        // Check if booking has expired
        const endDateTime = new Date(`${booking.date}T${booking.endTime}`);
        return now <= endDateTime; // Only include non-expired bookings
      });
      
      setBookings(userBookings);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const loadResources = async () => {
    try {
      const response = await getResources();
      setResources(response.data || []);
    } catch (err) {
      console.error("Error loading resources:", err);
    }
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    return resource?.name || "Unknown Resource";
  };

  const calculateRemainingTime = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`);
    const endDateTime = new Date(`${booking.date}T${booking.endTime}`);
    const now = new Date();

    if (now > endDateTime) return { percentage: 100, remaining: "Expired" };
    if (now < bookingDateTime)
      return { percentage: 0, remaining: "Not started" };

    const totalDuration = endDateTime - bookingDateTime;
    const elapsed = now - bookingDateTime;
    const percentage = (elapsed / totalDuration) * 100;

    const remainingMs = endDateTime - now;
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      percentage: Math.min(percentage, 100),
      remaining: `${hours}h ${minutes}m`,
    };
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return "#16a34a"; // Green
    if (percentage < 80) return "#eab308"; // Yellow
    return "#dc2626"; // Red
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reduced max size to 300KB to account for base64 encoding overhead
    if (file.size > 300 * 1024) {
      setError("Image size must be less than 300KB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      e.target.value = "";
      return;
    }

    setSelectedPicture(file);
    setPictureName(file.name);
    setError("");
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setUploading(true);

      // Update profile data
      await updateUserProfile(user?.userId, formData);

      // Upload picture if a new one was selected
      if (selectedPicture) {
        // Convert file to base64 using Promise
        const fileToBase64 = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedPicture);
        });

        const dataUrl = await fileToBase64;
        const base64Image = dataUrl.split(",")[1];
        
        // Upload to backend
        await uploadProfilePicture(user?.userId, base64Image);

        // Update state and localStorage with new picture
        setUserData((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          profilePicture: dataUrl,
        }));

        const updatedUser = { 
          ...user, 
          ...formData,
          profilePicture: dataUrl 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setUserData((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
        }));

        // Update localStorage without picture change
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      setSelectedPicture(null);
      setPictureName("");
      setSuccess("Profile updated successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">Smart Campus</p>
          <h1>User Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your profile and bookings
          </p>
        </div>
        <div className="profile-badge">
          {userData?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Profile Section */}
      <div className="profile-section">
        <h2>Profile Information</h2>

        {!isEditing ? (
          <div className="profile-card">
            {/* Profile Picture */}
            <div className="profile-picture-section">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">👤</div>
              )}
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <div className="profile-item">
                <label>Name</label>
                <p>{userData?.name}</p>
              </div>
              <div className="profile-item">
                <label>Email</label>
                <p>{userData?.email}</p>
              </div>
              <div className="profile-item">
                <label>Role</label>
                <p className="role-tag">{userData?.role}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveChanges} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                disabled={uploading}
              />
              {pictureName && (
                <p style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px" }}>
                  ✓ Selected: {pictureName}
                </p>
              )}
              {uploading && <p style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>Uploading...</p>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={uploading}>
                {uploading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedPicture(null);
                  setPictureName("");
                  setFormData({
                    name: userData.name,
                    email: userData.email,
                  });
                  setError("");
                }}
                className="btn-cancel"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bookings Section */}
      <div className="bookings-section">
        <h2>Active Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>📅 No active bookings yet</p>
            <p className="empty-subtitle">Create a booking to use campus resources</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              const timeData = calculateRemainingTime(booking);
              const progressColor = getProgressColor(timeData.percentage);

              return (
                <div key={booking.id} className="booking-card-dashboard">
                  <div className="booking-header-dash">
                    <h3>Resource Booking</h3>
                    <span className="booking-id-badge">#{booking.id.slice(0, 8)}</span>
                  </div>

                  <div className="booking-progress">
                    <CircularProgress
                      percentage={timeData.percentage}
                      label={timeData.remaining}
                      color={progressColor}
                    />
                  </div>

                  <div className="booking-details-dash">
                    <div className="booking-detail">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{booking.date}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">Purpose:</span>
                      <span className="detail-value">{booking.purpose}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">Resource:</span>
                      <span className="detail-value">
                        {getResourceName(booking.resourceId)}
                      </span>
                    </div>
                  </div>

                  <div className="booking-status-dash">
                    <span className="status-badge approved">✓ Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}