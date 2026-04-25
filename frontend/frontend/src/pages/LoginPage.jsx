import { useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [googleEmail, setGoogleEmail] = useState("");
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await loginUser(form);
      completeAuth(res.data, "Login successful!");
    } catch (err) {
      const apiMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed";
      const shouldAutoRegister =
        typeof apiMessage === "string" &&
        apiMessage.toLowerCase().includes("invalid email or password");

      if (!shouldAutoRegister) {
        setMessage(apiMessage);
        return;
      }

      try {
        await registerUser({
          name: form.email.split("@")[0],
          email: form.email,
          password: form.password,
          role: "USER",
        });

        const loginAfterRegister = await loginUser(form);
        completeAuth(
          loginAfterRegister.data,
          "Account created and login successful!"
        );
      } catch (registerErr) {
        setMessage(
          registerErr.response?.data?.error ||
            registerErr.response?.data?.message ||
            "Auto sign-up failed"
        );
      }
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!googleEmail || !googleEmail.includes("@")) {
      setMessage("Please enter a valid Gmail address");
      return;
    }

    try {
      const response = await API.post("/auth/google/login", {
        email: googleEmail,
        name: googleEmail.split("@")[0],
      });
      completeAuth(response.data, "Google login successful!");
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Google login failed"
      );
    }
  };

  const completeAuth = (authData, successMessage) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData));
    localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
    setMessage(successMessage);

    setTimeout(() => {
      if (authData.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="avatar-circle" aria-hidden="true">
          <div className="avatar-head" />
          <div className="avatar-body" />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-row" htmlFor="email">
            <span className="input-icon" aria-hidden="true">
              ✉
            </span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email ID"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="input-row" htmlFor="password">
            <span className="input-icon" aria-hidden="true">
              🔒
            </span>
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

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button className="forgot-link" type="button">
              Forgot Password?
            </button>
          </div>

          <button className="login-button" type="submit">
            LOGIN
          </button>
        </form>

        <div className="google-section">
          <button
            className="google-toggle-button"
            type="button"
            onClick={() => setShowGoogleForm((prev) => !prev)}
          >
            {showGoogleForm ? "Hide Google Login" : "Continue with Google"}
          </button>

          {showGoogleForm && (
            <form className="google-form" onSubmit={handleGoogleLogin}>
              <input
                type="email"
                placeholder="Enter your Gmail address"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                required
              />
              <button className="google-submit-button" type="submit">
                Sign in with Gmail
              </button>
            </form>
          )}
        </div>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}