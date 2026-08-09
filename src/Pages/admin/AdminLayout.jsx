import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, ClipboardList, LayoutGrid, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: isActive(path) ? "#fff" : "var(--ink)",
    background: isActive(path) ? "var(--maroon)" : "transparent",
    marginBottom: 4,
    textDecoration: "none",
    transition: "all 0.2s ease",
    width: "100%",
    border: "none",
    cursor: "pointer"
  });

  const navItems = [
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/inventory", icon: LayoutGrid, label: "Inventory" },
    { path: "/admin/orders", icon: ClipboardList, label: "Orders" },
  ];

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "calc(100vh - 68px)",
      position: "relative"
    }}>
      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease"
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: isMobile ? 280 : 220,
        borderRight: isMobile ? "none" : "1px solid var(--line)",
        padding: isMobile ? "24px 20px" : "20px",
        flexShrink: 0,
        background: isMobile ? "#fff" : "transparent",
        position: isMobile ? "fixed" : "sticky",
        top: isMobile ? 0 : 0,
        left: isMobile ? (isMobileMenuOpen ? 0 : "-100%") : 0,
        height: isMobile ? "100vh" : "auto",
        zIndex: 1000,
        transition: "left 0.3s ease",
        boxShadow: isMobile ? "2px 0 12px rgba(0,0,0,0.1)" : "none",
        overflowY: "auto"
      }}>
        {/* Mobile Close Button */}
        {isMobile && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24
          }}>
            <div style={{ 
              fontFamily: "Fraunces, serif", 
              fontWeight: 700, 
              fontSize: 17, 
              color: "var(--maroon)" 
            }}>
              Admin Panel
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={24} color="var(--ink)" />
            </button>
          </div>
        )}

        {/* Desktop Title */}
        {!isMobile && (
          <div style={{ 
            fontFamily: "Fraunces, serif", 
            fontWeight: 700, 
            fontSize: 17, 
            marginBottom: 20, 
            color: "var(--maroon)" 
          }}>
            Admin Panel
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={linkStyle(item.path)}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.background = "var(--sandalwood)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.background = "transparent";
                  }
                }}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: isMobile ? "16px" : "28px",
        overflowX: "auto",
        width: "100%",
        minWidth: 0
      }}>
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16
          }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
                borderRadius: 6,
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--sandalwood)"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              <Menu size={24} color="var(--ink)" />
            </button>
            <span style={{ 
              fontFamily: "Fraunces, serif", 
              fontWeight: 700, 
              fontSize: 18,
              color: "var(--maroon)"
            }}>
              Admin Panel
            </span>
          </div>
        )}
        
        <Outlet />
      </main>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          main {
            padding: 20px !important;
          }
        }

        @media (max-width: 768px) {
          main {
            padding: 16px !important;
          }
        }

        @media (max-width: 480px) {
          main {
            padding: 12px !important;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}