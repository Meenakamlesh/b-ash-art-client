
import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUS_OPTIONS = ["pending", "confirm", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.get("/orders").then((res) => setOrders(res.data.orders));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Orders <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 500 }}>({orders.length} total)</span>
      </h1>

      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--sandalwood)", textAlign: "left" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Product ID</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Color</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={tdStyle}>#{o.id}</td>
                <td style={tdStyle}>{o.productId}</td>
                <td style={tdStyle}>{o.quantity}</td>
                <td style={tdStyle}>{o.color || "—"}</td>
                <td style={tdStyle}>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--line)", fontSize: 12.5 }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { padding: "12px 14px", fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: "12px 14px" };