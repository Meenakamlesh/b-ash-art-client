import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Heart, LogOut, Home, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/products", label: "Shop", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <>
      <header
        style={{
          background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "#fff",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${isScrolled ? "rgba(0,0,0,0.08)" : "var(--line)"}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          boxShadow: isScrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
            padding: "0 24px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--maroon)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span style={{ 
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--brass)",
              marginRight: 4
            }} />
            B Ash Art
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="nav-links"
            style={{
              display: "flex",
              gap: 32,
              fontSize: 14.5,
              fontWeight: 500,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: location.pathname === link.to ? "var(--maroon)" : "var(--text)",
                  textDecoration: "none",
                  position: "relative",
                  padding: "4px 0",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--maroon)"}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.to) {
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--maroon)",
                    borderRadius: 2,
                  }} />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12,
            flexShrink: 0
          }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              style={{
                position: "relative",
                display: "flex",
                padding: "6px",
                borderRadius: "50%",
                transition: "background 0.2s",
                color: "var(--text)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    background: "var(--maroon)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    animation: "bounceIn 0.3s ease",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Section - Desktop */}
            {user ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                padding: "4px 12px 4px 8px",
                borderRadius: "20px",
                background: "var(--sandalwood)",
                border: "1px solid var(--line)"
              }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--maroon)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)"
                }}>
                  {user.name?.split(" ")[0] || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "var(--muted)",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--maroon)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                transition: "background 0.2s",
                color: "var(--text)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Expanded */}
        {searchOpen && (
          <div style={{
            padding: "12px 24px",
            borderTop: "1px solid var(--line)",
            background: "#fff",
          }}>
            <form onSubmit={handleSearch} style={{
              display: "flex",
              gap: 12,
              maxWidth: 600,
              margin: "0 auto"
            }}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--line)",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--maroon)"}
                onBlur={(e) => e.target.style.borderColor = "var(--line)"}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--maroon)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--line)",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              background: "#fff",
              animation: "slideDown 0.3s ease",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 8,
                  color: location.pathname === link.to ? "var(--maroon)" : "var(--text)",
                  textDecoration: "none",
                  fontWeight: location.pathname === link.to ? 600 : 500,
                  transition: "background 0.2s",
                  fontSize: 15
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {link.icon}
                {link.label}
                {location.pathname === link.to && (
                  <span style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--maroon)"
                  }} />
                )}
              </Link>
            ))}

            {user ? (
              <>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "var(--sandalwood)",
                  marginTop: 4
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--maroon)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#b5555c",
                    fontSize: 15,
                    fontWeight: 500,
                    transition: "background 0.2s",
                    width: "100%",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fbeaec"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "var(--maroon)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 600,
                  justifyContent: "center",
                  marginTop: 4
                }}
              >
                <User size={18} />
                Login / Register
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          header .wrap {
            height: 60px !important;
            padding: 0 16px !important;
          }
          header .wrap > a {
            font-size: 18px !important;
          }
          .btn-primary {
            padding: 6px 14px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          header .wrap {
            height: 56px !important;
            padding: 0 12px !important;
          }
          header .wrap > a {
            font-size: 16px !important;
          }
          header .wrap > div > button,
          header .wrap > div > a {
            padding: 4px !important;
          }
          .btn-primary {
            padding: 4px 12px !important;
            font-size: 11px !important;
          }
          .cart-badge {
            min-width: 16px !important;
            height: 16px !important;
            font-size: 9px !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}