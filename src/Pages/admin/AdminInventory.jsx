import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ChevronDown, ChevronRight, Package, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        setProducts(res.data.products);
        // Auto-expand products with variants
        const expandState = {};
        res.data.products.forEach(p => {
          if (p.variants && p.variants.length > 0) {
            expandState[p.id] = true;
          }
        });
        setExpandedProducts(expandState);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const toggleExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculate statistics
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalProducts = products.length;
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);

  // Get color-wise stock for a product
  const getColorStock = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return [{ color: "Default", stock: product.stock }];
    }
    return product.variants.map(v => ({
      color: v.color,
      stock: v.stock || 0,
      imageUrl: v.imageUrl
    }));
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "#b5555c", bg: "#fbeaec", icon: XCircle };
    if (stock <= 5) return { label: "Low Stock", color: "#b78544", bg: "#fdf3e2", icon: AlertTriangle };
    return { label: "In Stock", color: "var(--sage)", bg: "#eaf0e3", icon: CheckCircle };
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "300px" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: "3px solid var(--line)", 
            borderTop: "3px solid var(--maroon)", 
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ color: "var(--muted)" }}>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container" style={{ padding: "0 0 40px 0" }}>
      <h1 style={{ 
        fontFamily: "Fraunces, serif", 
        fontSize: 24, 
        fontWeight: 700, 
        marginBottom: 24 
      }}>
        Inventory Management
      </h1>

      {/* Stats Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
        gap: 16, 
        marginBottom: 26 
      }}>
        <StatCard 
          label="Total Products" 
          value={totalProducts} 
          color="var(--maroon)" 
          icon={Package}
        />
        <StatCard 
          label="Total Variants" 
          value={totalVariants} 
          color="#4a6fa5" 
          icon={Package}
        />
        <StatCard 
          label="Total Stock Units" 
          value={totalStock} 
          color="var(--sage)" 
          icon={CheckCircle}
        />
        <StatCard 
          label="Low Stock (≤5)" 
          value={lowStock} 
          color="#b78544" 
          icon={AlertTriangle}
        />
        <StatCard 
          label="Out of Stock" 
          value={outOfStock} 
          color="#b5555c" 
          icon={XCircle}
        />
      </div>

      {/* Inventory Table */}
      <div style={{ 
        background: "#fff", 
        border: "1px solid var(--line)", 
        borderRadius: 12, 
        overflow: "hidden",
        width: "100%"
      }}>
        <div style={{ 
          overflowX: "auto",
          width: "100%"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            fontSize: 13.5,
            minWidth: "600px"
          }}>
            <thead>
              <tr style={{ background: "var(--sandalwood)", textAlign: "left" }}>
                <th style={thStyle} width="30"></th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Total Stock</th>
                <th style={thStyle}>Variants</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const colorStocks = getColorStock(p);
                const status = getStockStatus(p.stock);
                const StatusIcon = status.icon;
                const isExpanded = expandedProducts[p.id] || false;
                const hasVariants = p.variants && p.variants.length > 0;

                return (
                  <>
                    <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {hasVariants && (
                          <button
                            onClick={() => toggleExpand(p.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 4,
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {p.imageUrl && (
                            <div style={{ 
                              width: 36, 
                              height: 36, 
                              borderRadius: 6, 
                              overflow: "hidden", 
                              background: "var(--sandalwood)",
                              flexShrink: 0
                            }}>
                              <img 
                                src={p.imageUrl} 
                                alt={p.name} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                              />
                            </div>
                          )}
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        {p.stock}
                      </td>
                      <td style={tdStyle}>
                        {hasVariants ? (
                          <span style={{ 
                            background: "var(--sandalwood)", 
                            padding: "2px 10px", 
                            borderRadius: 12,
                            fontSize: 11.5
                          }}>
                            {p.variants.length} colors
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted)", fontSize: 12 }}>Single</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 12,
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: status.bg,
                          color: status.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap"
                        }}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => toggleExpand(p.id)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 6,
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 12,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "var(--sandalwood)"}
                          onMouseLeave={(e) => e.target.style.background = "#fff"}
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row - Color Details */}
                    {isExpanded && hasVariants && (
                      <tr>
                        <td colSpan="6" style={{ 
                          padding: 0,
                          background: "#faf8f6"
                        }}>
                          <div style={{ 
                            padding: "16px 20px",
                            borderTop: "1px solid var(--line)"
                          }}>
                            <div style={{ 
                              display: "grid", 
                              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                              gap: 12 
                            }}>
                              {colorStocks.map((variant, index) => {
                                const variantStatus = getStockStatus(variant.stock);
                                const VariantIcon = variantStatus.icon;
                                return (
                                  <div key={index} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 14px",
                                    background: "#fff",
                                    borderRadius: 8,
                                    border: "1px solid var(--line)"
                                  }}>
                                    {variant.imageUrl && (
                                      <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        background: "var(--sandalwood)",
                                        flexShrink: 0
                                      }}>
                                        <img 
                                          src={variant.imageUrl} 
                                          alt={variant.color} 
                                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                      </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ 
                                        fontSize: 13, 
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                        marginBottom: 2
                                      }}>
                                        {variant.color}
                                      </div>
                                      <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 8,
                                        flexWrap: "wrap"
                                      }}>
                                        <span style={{ 
                                          fontWeight: 700, 
                                          fontSize: 14,
                                          color: variant.stock === 0 ? "#b5555c" : "var(--text)"
                                        }}>
                                          {variant.stock}
                                        </span>
                                        <span style={{
                                          padding: "1px 8px",
                                          borderRadius: 10,
                                          fontSize: 10,
                                          fontWeight: 600,
                                          background: variantStatus.bg,
                                          color: variantStatus.color,
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 3
                                        }}>
                                          <VariantIcon size={10} />
                                          {variantStatus.label}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .inventory-container > div:first-of-type {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          }
        }

        @media (max-width: 768px) {
          .inventory-container {
            padding: 0 0 30px 0 !important;
          }
          
          .inventory-container h1 {
            font-size: 20px !important;
            margin-bottom: 18px !important;
          }
          
          .inventory-container > div:first-of-type {
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
            gap: 12px !important;
          }
          
          .stat-card {
            padding: 14px !important;
          }
          
          .stat-card .value {
            font-size: 22px !important;
          }
          
          .stat-card .label {
            font-size: 11px !important;
          }
        }

        @media (max-width: 480px) {
          .inventory-container {
            padding: 0 0 20px 0 !important;
          }
          
          .inventory-container h1 {
            font-size: 18px !important;
            margin-bottom: 14px !important;
          }
          
          .inventory-container > div:first-of-type {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          
          .stat-card {
            padding: 12px !important;
          }
          
          .stat-card .value {
            font-size: 20px !important;
          }
          
          .stat-card .label {
            font-size: 10px !important;
          }
          
          table {
            font-size: 12px !important;
            min-width: 500px !important;
          }
          
          th, td {
            padding: 8px 10px !important;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="stat-card" style={{ 
      background: "#fff", 
      border: "1px solid var(--line)", 
      borderRadius: 12, 
      padding: 20,
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "none";
    }}
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 4
      }}>
        <div className="value" style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color, 
          fontFamily: "Fraunces, serif" 
        }}>
          {value}
        </div>
        {Icon && <Icon size={20} color={color} opacity={0.5} />}
      </div>
      <div className="label" style={{ 
        fontSize: 12.5, 
        color: "var(--muted)", 
        marginTop: 4 
      }}>
        {label}
      </div>
    </div>
  );
}

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