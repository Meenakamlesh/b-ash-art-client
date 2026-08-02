import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{ maxWidth: 400, margin: "70px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
        Welcome back
      </h1>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
        Log in to your Hastnirmit account
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
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

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

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};