import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

const sanitizeColorKey = (color) => color.trim().toLowerCase().replace(/\s+/g, "_");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "" });
  const [colorsInput, setColorsInput] = useState("");
  const [colorFiles, setColorFiles] = useState({});
  const [colorStockData, setColorStockData] = useState({});
  const [existingVariants, setExistingVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colorsList = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);

  const fetchProducts = () => {
    api.get("/products").then((res) => setProducts(res.data.products));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", price: "" });
    setColorsInput("");
    setColorFiles({});
    setColorStockData({});
    setExistingVariants([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    const variants = product.variants || [];
    const stockMap = {};
    variants.forEach(v => {
      stockMap[sanitizeColorKey(v.color)] = v.stock || 0;
    });
    
    setForm({
      name: product.name,
      price: product.price,
    });
    setColorsInput((product.colors || []).join(", "));
    setColorFiles({});
    setColorStockData(stockMap);
    setExistingVariants(variants);
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

    if (colorsList.length > 0) {
      formData.append("colors", JSON.stringify(colorsList));
      
      colorsList.forEach((color) => {
        const key = sanitizeColorKey(color);
        const file = colorFiles[color];
        if (file) {
          formData.append(`variant_${key}`, file);
        }
        const stockValue = colorStockData[key] || 0;
        formData.append(`stock_${key}`, stockValue);
      });
    } else {
      formData.append("colors", JSON.stringify([]));
      formData.append("stock", form.stock || 0);
      if (colorFiles.default) {
        formData.append("variant_default", colorFiles.default);
      }
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

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="admin-products" style={{ padding: "0 0 20px 0" }}>
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isMobile ? "stretch" : "center", 
        gap: isMobile ? 12 : 0,
        marginBottom: 24 
      }}>
        <h1 style={{ 
          fontFamily: "Fraunces, serif", 
          fontSize: isMobile ? 20 : 24, 
          fontWeight: 700 
        }}>
          Products
        </h1>
        <button 
          className="btn btn-primary" 
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ width: isMobile ? "100%" : "auto" }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div style={{ 
          background: "#fff", 
          border: "1px solid var(--line)", 
          borderRadius: 12, 
          padding: isMobile ? 16 : 22, 
          marginBottom: 26 
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ 
              fontFamily: "Fraunces, serif", 
              fontSize: isMobile ? 16 : 17, 
              fontWeight: 700 
            }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <X size={18} style={{ cursor: "pointer" }} onClick={resetForm} />
          </div>

          <form onSubmit={handleSubmit} style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
            gap: 14 
          }}>
            <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <label style={labelStyle}>Product Name *</label>
              <input 
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                style={inputStyle} 
                placeholder="Enter product name"
              />
            </div>
            <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <label style={labelStyle}>Price (₹) *</label>
              <input 
                required 
                type="number" 
                min="0"
                step="0.01"
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
                style={inputStyle} 
                placeholder="0.00"
              />
            </div>
            
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Colors (comma separated)</label>
              <input 
                placeholder="e.g., red, blue, black" 
                value={colorsInput} 
                onChange={(e) => setColorsInput(e.target.value)} 
                style={inputStyle} 
              />
              <small style={{ color: "#666", fontSize: 12 }}>Leave empty for single variant product</small>
            </div>

            {colorsList.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Stock Quantity *</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  value={form.stock || ""} 
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                  style={inputStyle} 
                  placeholder="0"
                />
              </div>
            )}

            {colorsList.length > 0 && (
              <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <label style={{ ...labelStyle, fontSize: 14, marginBottom: 12 }}>Color Variants Details</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {colorsList.map((color) => {
                    const key = sanitizeColorKey(color);
                    const existing = existingVariants.find(
                      (v) => sanitizeColorKey(v.color) === key
                    );
                    const previewUrl = colorFiles[color]
                      ? URL.createObjectURL(colorFiles[color])
                      : existing?.imageUrl;
                    
                    const stockValue = colorStockData[key] !== undefined ? colorStockData[key] : (existing?.stock || 0);

                    return (
                      <div key={color} style={{ 
                        display: "grid", 
                        gridTemplateColumns: isMobile ? "1fr" : "60px 100px 1fr 120px",
                        alignItems: "center", 
                        gap: isMobile ? 10 : 12,
                        padding: isMobile ? 14 : 12,
                        background: "var(--sandalwood)",
                        borderRadius: 8
                      }}>
                        <div style={{ 
                          width: isMobile ? 60 : 48, 
                          height: isMobile ? 60 : 48, 
                          borderRadius: 6, 
                          overflow: "hidden", 
                          background: "#fff",
                          border: "1px solid var(--line)",
                          justifySelf: isMobile ? "center" : "start"
                        }}>
                          {previewUrl && <img src={previewUrl} alt={color} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        
                        <span style={{ 
                          fontSize: isMobile ? 15 : 14, 
                          fontWeight: 600, 
                          textTransform: "capitalize",
                          textAlign: isMobile ? "center" : "left"
                        }}>
                          {color}
                        </span>
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setColorFiles((prev) => ({ ...prev, [color]: file }));
                            }
                          }}
                          style={{ 
                            fontSize: isMobile ? 12 : 12.5,
                            width: "100%"
                          }}
                        />
                        
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 6,
                          justifyContent: isMobile ? "center" : "flex-start"
                        }}>
                          <label style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>Stock:</label>
                          <input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setColorStockData(prev => ({ ...prev, [key]: val }));
                            }}
                            style={{ 
                              width: isMobile ? 80 : 70, 
                              padding: "6px 10px", 
                              border: "1px solid var(--line)", 
                              borderRadius: 4, 
                              fontSize: 13,
                              background: "#fff"
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ 
                  marginTop: 12, 
                  padding: 10, 
                  background: "#f0f0f0", 
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center"
                }}>
                  Total Stock: {colorsList.reduce((sum, color) => sum + (colorStockData[sanitizeColorKey(color)] || 0), 0)}
                </div>
              </div>
            )}

            {colorsList.length === 0 && (
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

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ gridColumn: "1 / -1", padding: "14px", fontSize: isMobile ? 15 : 14 }} 
              disabled={loading}
            >
              {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* Products Table - Mobile Optimized */}
      <div style={{ 
        background: "#fff", 
        border: "1px solid var(--line)", 
        borderRadius: 12, 
        overflow: "hidden",
        width: "100%"
      }}>
        {isMobile ? (
          // Mobile Card View
          <div style={{ padding: "12px" }}>
            {products.map((p) => {
              const isExpanded = expandedRows[p.id] || false;
              return (
                <div key={p.id} style={{
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  marginBottom: 12,
                  padding: 14,
                  background: "#fff"
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: 6, 
                      overflow: "hidden", 
                      background: "var(--sandalwood)",
                      flexShrink: 0
                    }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ color: "var(--maroon)", fontWeight: 700, fontSize: 15 }}>₹{p.price}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 600,
                          color: p.stock <= 5 ? "#b5555c" : "var(--sage)"
                        }}>
                          Stock: {p.stock}
                        </span>
                        {p.variants && p.variants.length > 0 && (
                          <button
                            onClick={() => toggleRowExpand(p.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              fontSize: 11,
                              color: "var(--muted)"
                            }}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {p.variants.length} colors
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <Pencil size={16} style={{ cursor: "pointer" }} onClick={() => handleEdit(p)} />
                      <Trash2 size={16} style={{ cursor: "pointer", color: "#b5555c" }} onClick={() => handleDelete(p.id)} />
                    </div>
                  </div>
                  
                  {isExpanded && p.variants && p.variants.length > 0 && (
                    <div style={{ 
                      marginTop: 12, 
                      paddingTop: 12, 
                      borderTop: "1px solid var(--line)",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8
                    }}>
                      {p.variants.map((v, idx) => (
                        <div key={idx} style={{
                          background: "var(--sandalwood)",
                          padding: "8px 10px",
                          borderRadius: 6,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span style={{ 
                            textTransform: "capitalize", 
                            fontSize: 12,
                            fontWeight: 500
                          }}>
                            {v.color}
                          </span>
                          <span style={{ 
                            fontWeight: 700, 
                            fontSize: 13,
                            color: v.stock <= 5 ? "#b5555c" : "var(--sage)"
                          }}>
                            {v.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop Table View
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 600 }}>
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
                      {p.variants && p.variants.length > 0 && (
                        <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                          {p.variants.map(v => `${v.color}: ${v.stock}`).join(" | ")}
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {(p.colors || []).length > 0 ? (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {(p.colors || []).map(c => (
                            <span key={c} style={{ 
                              background: "var(--sandalwood)", 
                              padding: "2px 8px", 
                              borderRadius: 4, 
                              fontSize: 11,
                              textTransform: "capitalize"
                            }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
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
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-products {
            padding: 0 0 10px 0 !important;
          }
        }

        @media (max-width: 480px) {
          .admin-products {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

const labelStyle = { 
  display: "block", 
  fontSize: 12.5, 
  fontWeight: 600, 
  marginBottom: 5 
};

const inputStyle = { 
  width: "100%", 
  padding: "9px 12px", 
  border: "1px solid var(--line)", 
  borderRadius: 6, 
  fontSize: 13.5, 
  fontFamily: "inherit", 
  boxSizing: "border-box" 
};

const thStyle = { 
  padding: "12px 14px", 
  fontWeight: 700, 
  fontSize: 12,
  whiteSpace: "nowrap"
};

const tdStyle = { 
  padding: "12px 14px",
  verticalAlign: "middle"
};