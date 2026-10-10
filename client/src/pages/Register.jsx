import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import API from "../services/api";
import "../styles/Auth.css";
import logo from "../assets/autonex-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!firstName) {
      setMessage("Please enter your first name.");
      setMessageType("error");
      return false;
    }

    if (!lastName) {
      setMessage("Please enter your last name.");
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

    if (password.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );
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
      await API.post("/auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
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

        {/* Company */}
        <h1>AutoNex Technology</h1>

        <h2>Create Your Account ✨</h2>

        <p className="subtitle">
          Create your account to manage invoices and quotations
        </p>

        <form onSubmit={handleSubmit}>

          {/* First Name */}
          <label>First Name</label>

          <div className="input-wrapper">

            <User
              className="input-icon"
              size={19}
            />

            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
            />

          </div>

          {/* Last Name */}
          <label>Last Name</label>

          <div className="input-wrapper">

            <User
              className="input-icon"
              size={19}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />

          </div>

          {/* Email */}
          <label>Email Address</label>

          <div className="input-wrapper">

            <Mail
              className="input-icon"
              size={19}
            />

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

            <Lock
              className="input-icon"
              size={19}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
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

          <p className="password-hint">
            Password must contain at least 6 characters.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
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

        {/* Login */}
        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;