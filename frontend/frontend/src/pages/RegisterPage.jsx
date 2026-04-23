import { useState } from "react";
import { registerUser } from "../api/authApi";

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
    <div style={{ padding: "30px", color: "white" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <br /><br />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  );
}