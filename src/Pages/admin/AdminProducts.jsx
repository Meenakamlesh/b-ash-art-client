import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const sanitizeColorKey = (color) => color.trim().toLowerCase().replace(/\s+/g, "_");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", colors: "" });
  const [colorFiles, setColorFiles] = useState({});
  const [existingVariants, setExistingVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const colorsList = form.colors.split(",").map((c) => c.trim()).filter(Boolean);

  const fetchProducts = () => {
    api.get("/products").then((res) => setProducts(res.data.products));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", stock: "", colors: "" });
    setColorFiles({});
    setExistingVariants([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      colors: (product.colors || []).join(", "),
    });
    setColorFiles({});
    setExistingVariants(product.variants || []);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("colors", JSON.stringify(colorsList));

    if (colorsList.length > 0) {
      colorsList.forEach((color) => {
        const file = colorFiles[color];
        if (file) {
          formData.append(`variant_${sanitizeColorKey(color)}`, file);
        }
      });
    } else if (colorFiles.default) {
      formData.append("variant_default", colorFiles.default);
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post("/products", formData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 22, marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700 }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <X size={18} style={{ cursor: "pointer" }} onClick={resetForm} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Product Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stock Quantity</label>
              <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Colors (comma separated)</label>
              <input placeholder="red, grey" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} style={inputStyle} />
            </div>

            {colorsList.length > 0 ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Image for each color</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                  {colorsList.map((color) => {
                    const existing = existingVariants.find(
                      (v) => sanitizeColorKey(v.color) === sanitizeColorKey(color)
                    );
                    const previewUrl = colorFiles[color]
                      ? URL.createObjectURL(colorFiles[color])
                      : existing?.imageUrl;

                    return (
                      <div key={color} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", background: "var(--sandalwood)", flexShrink: 0 }}>
                          {previewUrl && <img src={previewUrl} alt={color} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, width: 70, textTransform: "capitalize" }}>{color}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setColorFiles((prev) => ({ ...prev, [color]: e.target.files[0] }))
                          }
                          style={{ fontSize: 12.5 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setColorFiles((prev) => ({ ...prev, default: e.target.files[0] }))}
                  style={inputStyle}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ gridColumn: "1 / -1" }} disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--sandalwood)", textAlign: "left" }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Colors</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={tdStyle}>
                  <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", background: "var(--sandalwood)" }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                </td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={tdStyle}>
                  <span style={{ color: p.stock <= 5 ? "#b5555c" : "var(--sage)", fontWeight: 600 }}>{p.stock}</span>
                </td>
                <td style={tdStyle}>{(p.colors || []).join(", ") || "—"}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Pencil size={16} style={{ cursor: "pointer" }} onClick={() => handleEdit(p)} />
                    <Trash2 size={16} style={{ cursor: "pointer", color: "#b5555c" }} onClick={() => handleDelete(p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5 };
const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box" };
const thStyle = { padding: "12px 14px", fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: "12px 14px" };