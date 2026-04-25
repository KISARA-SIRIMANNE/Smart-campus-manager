import { useState } from "react";
import { registerUser } from "../api/authApi";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await registerUser(form);
      console.log("Register success:", res.data);
      setMessage("Registration successful!");
    } catch (err) {
      console.log("Register error:", err);

      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-input-row" htmlFor="name">
            <input
              id="name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="register-input-row" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="register-input-row" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="register-select-wrap" htmlFor="role">
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <button className="register-button" type="submit">
            REGISTER
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
}