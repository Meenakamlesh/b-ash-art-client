import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 Add this
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ maxWidth: 400, margin: "70px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
        Welcome back
      </h1>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
        Log in to your B Ash Art account
      </p>

      {error && (
        <div style={{ background: "#fbeaec", color: "#b5555c", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, margin: "16px 0 6px" }}>Password</label>
        <div style={passwordWrapperStyle}>
          <input
            type={showPassword ? "text" : "password"} // 👈 Toggle type
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={passwordInputStyle}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={toggleButtonStyle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye closed icon (hide password)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye open icon (show password)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 26 }} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--muted)", marginTop: 22 }}>
        Don't have an account? <Link to="/register" style={{ color: "var(--maroon)", fontWeight: 600 }}>Register</Link>
      </p>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const passwordWrapperStyle = {
  position: "relative",
  width: "100%",
};

const passwordInputStyle = {
  width: "100%",
  padding: "10px 40px 10px 12px", // 👈 Extra padding on right for the button
  border: "1px solid #ced4da",
  borderRadius: "4px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const toggleButtonStyle = {
  position: "absolute",
  right: "10px",
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