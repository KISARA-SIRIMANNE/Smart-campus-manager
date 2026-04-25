import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Login successful!");

      setTimeout(() => {
        if (res.data.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 600);
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to access your Smart Campus dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className={
              message.includes("successful")
                ? "login-message success"
                : "login-message error"
            }
          >
            {message}
          </p>
        )}

        <p className="register-text">
          Don’t have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}