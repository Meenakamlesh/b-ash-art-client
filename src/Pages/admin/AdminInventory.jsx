import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.products));
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Inventory</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 26 }}>
        <StatCard label="Total Stock Units" value={totalStock} color="var(--maroon)" />
        <StatCard label="Low Stock Items (≤5)" value={lowStock} color="#b78544" />
        <StatCard label="Out of Stock" value={outOfStock} color="#b5555c" />
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--sandalwood)", textAlign: "left" }}>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Current Stock</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.stock}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: 11.5, fontWeight: 700,
                    background: p.stock === 0 ? "#fbeaec" : p.stock <= 5 ? "#fdf3e2" : "#eaf0e3",
                    color: p.stock === 0 ? "#b5555c" : p.stock <= 5 ? "#b78544" : "var(--sage)",
                  }}>
                    {p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "Fraunces, serif" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

const thStyle = { padding: "12px 14px", fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: "12px 14px" };