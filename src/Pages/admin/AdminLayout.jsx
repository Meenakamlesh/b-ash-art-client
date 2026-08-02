import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, ClipboardList, LayoutGrid } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "11px 16px", borderRadius: 8,
    fontSize: 14, fontWeight: 500,
    color: isActive(path) ? "#fff" : "var(--ink)",
    background: isActive(path) ? "var(--maroon)" : "transparent",
    marginBottom: 4,
  });

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
      <aside style={{ width: 220, borderRight: "1px solid var(--line)", padding: 20, flexShrink: 0 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 17, marginBottom: 20, color: "var(--maroon)" }}>
          Admin Panel
        </div>
        <Link to="/admin/products" style={linkStyle("/admin/products")}>
          <Package size={17} /> Products
        </Link>
        <Link to="/admin/inventory" style={linkStyle("/admin/inventory")}>
          <LayoutGrid size={17} /> Inventory
        </Link>
        <Link to="/admin/orders" style={linkStyle("/admin/orders")}>
          <ClipboardList size={17} /> Orders
        </Link>
      </aside>
      <main style={{ flex: 1, padding: 28, overflowX: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}