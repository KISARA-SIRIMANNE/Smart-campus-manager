import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, googleLogin } from "../api/authApi";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectByRole = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await registerUser(form);
      console.log("Register success:", res.data);

      setMessage("Registration successful!");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    } catch (err) {
      console.log("Register error:", err);

      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage("");

    try {
      const res = await googleLogin(credentialResponse.credential);
      console.log("Google login success:", res.data);

      redirectByRole(res.data);
    } catch (err) {
      console.log("Google login error:", err);
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Google register/login failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join Smart Campus and start managing campus services easily</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">USER</option>
            </select>
          </div>

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="google-section">
          <div className="divider">or continue with</div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google login failed")}
          />
        </div>

        {message && (
          <p
            className={
              message.includes("successful")
                ? "register-message success"
                : "register-message error"
            }
          >
            {message}
          </p>
        )}

        <p className="login-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}