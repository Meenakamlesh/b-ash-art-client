import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--line)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--maroon)",
          }}
        >
          B Ash Art
        </Link>

        <nav
          className="nav-links"
          style={{ display: "flex", gap: 28, fontSize: 14.5, fontWeight: 500 }}
        >
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Search size={19} />
          {/* <ShoppingCart size={19} /> */}
          <Link to="/cart" style={{ position: "relative", display: "flex" }}>
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "var(--maroon)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <User size={16} /> {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: 12.5,
                  color: "var(--maroon)",
                  textDecoration: "underline",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline"
              style={{ padding: "8px 18px", fontSize: 13 }}
            >
              Login
            </Link>
          )}

          <span
            className="mobile-menu-btn"
            style={{ display: "none", cursor: "pointer" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </span>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "14px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
        </div>
      )}
    </header>
  );
}
