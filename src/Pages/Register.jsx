import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      // Store user data and token in auth context
      login(res.data.user, res.data.token);
      
      // Redirect to home page
      navigate("/");
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        // Server responded with error
        const message = err.response.data?.message || "Registration failed";
        setError(message);
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ maxWidth: 400, margin: "70px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
        Create an account
      </h1>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
        Join B Ash Art to start shopping
      </p>

      {error && (
        <div style={{ background: "#fbeaec", color: "#b5555c", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          style={inputStyle}
          disabled={loading}
          placeholder="Enter your full name"
        />

        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, margin: "16px 0 6px" }}>Email</label>
        <input 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          style={inputStyle}
          disabled={loading}
          placeholder="Enter your email"
        />

        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, margin: "16px 0 6px" }}>Password</label>
        <div style={passwordWrapperStyle}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={passwordInputStyle}
            disabled={loading}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={toggleButtonStyle}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={loading}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Minimum 6 characters</div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ 
            width: "100%", 
            marginTop: 22,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }} 
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--muted)", marginTop: 22 }}>
        Already have an account? <Link to="/login" style={{ color: "var(--maroon)", fontWeight: 600 }}>Log In</Link>
      </p>
    </div>
  );
}

// Styles (unchanged)
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const passwordWrapperStyle = {
  position: "relative",
  width: "100%",
};

const passwordInputStyle = {
  width: "100%",
  padding: "11px 44px 11px 14px",
  border: "1px solid var(--line)",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const toggleButtonStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  color: "#6c757d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  transition: "color 0.2s",
};