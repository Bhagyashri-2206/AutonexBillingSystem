import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import API from "../services/api";
import "../styles/Auth.css";
import logo from "../assets/autonex-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return false;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      // Save JWT
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error("Login Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Invalid email or password."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        {/* Logo */}
        <div className="logo-circle">
          <img
            src={logo}
            alt="AutoNex Technology Logo"
          />
        </div>

        {/* Company Name */}
        <h1>AutoNex Technology</h1>

        <h2>Welcome Back 👋</h2>

        <p className="subtitle">
          Sign in to manage your invoices and quotations
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <label>Email Address</label>

          <div className="input-wrapper">

            <Mail className="input-icon" size={19} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>

          {/* Password */}
          <label>Password</label>

          <div className="input-wrapper">

            <Lock className="input-icon" size={19} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* Message */}
        {message && (
          <div
            className={`auth-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* Register */}
        <p className="switch-text">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;