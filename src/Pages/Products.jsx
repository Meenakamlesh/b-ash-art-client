import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Search, Filter, X, ChevronDown, Grid, List } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
  });

  const categories = [...new Set(products.map(p => p.category || "Uncategorized"))];

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [search, products, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
    });
    setSearch("");
    setSortBy("default");
    setSearchParams({});
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Get product stock info
  const getProductStock = (product) => {
    if (product.colors?.length > 0 && product.variants) {
      const totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
      return totalStock;
    }
    return product.stock || 0;
  };

  // Get product stock status with simple labels
  const getStockStatus = (product) => {
    const stock = getProductStock(product);
    if (stock <= 0) return { 
      label: "Out of Stock", 
      color: "#b5555c",
      icon: "❌"
    };
    if (stock <= 5) return { 
      label: `${stock} left`, 
      color: "#e67e22",
      icon: "⚠️"
    };
    if (stock <= 20) return { 
      label: `${stock} in stock`, 
      color: "#2e7d32",
      icon: "📦"
    };
    return { 
      label: "In Stock", 
      color: "#2e7d32",
      icon: "✅"
    };
  };

  return (
    <div style={{ 
      padding: "20px 16px 60px",
      maxWidth: 1200,
      margin: "0 auto",
      width: "100%"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 8
      }}>
        <div>
          <h1 style={{ 
            fontFamily: "Fraunces, serif", 
            fontSize: "clamp(24px, 4vw, 30px)", 
            fontWeight: 700,
            marginBottom: 2
          }}>
            All Products
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "clamp(13px, 2vw, 14px)" }}>
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap"
        }}>
          {/* Search Input */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "8px 12px",
            flex: 1,
            minWidth: "150px",
            background: "#fff",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--maroon)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "var(--line)"}
          >
            <Search size={16} color="var(--muted)" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "clamp(13px, 2vw, 14px)",
                flex: 1,
                fontFamily: "inherit",
                background: "transparent",
                minWidth: "80px"
              }}
            />
            {search && (
              <X
                size={14}
                style={{ cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}
                onClick={() => setSearch("")}
              />
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${showFilters ? "var(--maroon)" : "var(--line)"}`,
              background: showFilters ? "var(--sandalwood)" : "#fff",
              cursor: "pointer",
              fontSize: "clamp(12px, 1.8vw, 14px)",
              fontWeight: 500,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            <Filter size={16} />
            <span className="filter-text">Filters</span>
            <ChevronDown size={14} style={{
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s"
            }} />
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: "clamp(12px, 1.8vw, 14px)",
              background: "#fff",
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
              flex: "0 1 auto",
              minWidth: "120px",
              maxWidth: "160px"
            }}
          >
            <option value="default">Sort</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
            <option value="newest">Newest First</option>
          </select>

          {/* View Toggle */}
          <div className="view-toggle" style={{
            display: "flex",
            border: "1px solid var(--line)",
            borderRadius: 8,
            overflow: "hidden",
            flexShrink: 0
          }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "6px 10px",
                border: "none",
                background: viewMode === "grid" ? "var(--sandalwood)" : "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "background 0.2s"
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 10px",
                border: "none",
                borderLeft: "1px solid var(--line)",
                background: viewMode === "list" ? "var(--sandalwood)" : "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "background 0.2s"
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            padding: "16px",
            border: "1px solid var(--line)",
            borderRadius: 8,
            background: "#fff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            animation: "slideDown 0.3s ease"
          }}>
            <div>
              <label style={{ fontSize: "clamp(12px, 1.6vw, 13px)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  fontSize: "clamp(12px, 1.6vw, 14px)",
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "clamp(12px, 1.6vw, 13px)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  fontSize: "clamp(12px, 1.6vw, 14px)",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "clamp(12px, 1.6vw, 13px)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  fontSize: "clamp(12px, 1.6vw, 14px)",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "clamp(11px, 1.5vw, 13px)",
                  color: "var(--muted)",
                  transition: "all 0.2s",
                  width: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fbeaec";
                  e.currentTarget.style.color = "#b5555c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 12,
              padding: 14,
              border: "1px solid var(--line)",
              animation: "pulse 1.5s ease-in-out infinite"
            }}>
              <div style={{
                width: "100%",
                aspectRatio: "1/1",
                background: "var(--sandalwood)",
                borderRadius: 8,
                marginBottom: 10
              }} />
              <div style={{
                height: 16,
                width: "70%",
                background: "var(--sandalwood)",
                borderRadius: 4,
                marginBottom: 6
              }} />
              <div style={{
                height: 12,
                width: "40%",
                background: "var(--sandalwood)",
                borderRadius: 4
              }} />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 16px",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid var(--line)"
        }}>
          <Search size={40} color="var(--line)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(20px, 3vw, 24px)", marginBottom: 6 }}>
            No products found
          </h3>
          <p style={{ color: "var(--muted)", marginBottom: 16, fontSize: "clamp(13px, 2vw, 14px)" }}>
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-outline"
            style={{ padding: "8px 20px", fontSize: "clamp(13px, 2vw, 14px)" }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{
          display: viewMode === "grid" 
            ? "grid" 
            : "flex",
          gridTemplateColumns: viewMode === "grid" 
            ? "repeat(auto-fill, minmax(165px, 1fr))" 
            : "none",
          flexDirection: viewMode === "list" ? "column" : "none",
          gap: viewMode === "list" ? 12 : 16,
        }}>
          {filteredProducts.map((p) => {
            const stock = getProductStock(p);
            const status = getStockStatus(p);
            
            return (
              <div key={p.id} style={{ position: "relative" }}>
                <ProductCard product={p} />
                
                {/* Stock Badge - Responsive positioning */}
                <div className="stock-badge" style={{
                  position: "absolute",
                  top: "63%",
                  right: "10px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  background: status.color === "#b5555c" ? "#fbeaec" :
                             status.color === "#e67e22" ? "#fff3cd" : "#d4edda",
                  color: status.color,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  border: `1px solid ${status.color}30`,
                  whiteSpace: "nowrap"
                }}>
                  <span style={{ fontSize: "10px" }}>{status.icon}</span>
                  <span>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Responsive Styles */}
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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .view-toggle {
            display: none !important;
          }
          
          .filter-text {
            display: inline;
          }
        }

        @media (max-width: 480px) {
          .filter-text {
            display: none;
          }
          
          .view-toggle {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .view-toggle {
            display: flex !important;
          }
        }

        /* Grid responsive for product cards */
        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }

        @media (max-width: 400px) {
          .products-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }

        /* Fix stock badge position on mobile - make it visible */
        @media (max-width: 768px) {
          .stock-badge {
            top: 60% !important;
            right: 8px !important;
            padding: 4px 10px !important;
            font-size: 11px !important;
            border-width: 2px !important;
          }
          .stock-badge span {
            font-size: 11px !important;
          }
          .stock-badge span:first-child {
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .stock-badge {
            top: 65% !important;
            right: 5px !important;
            padding: 3px 8px !important;
            font-size: 10px !important;
            border-width: 2px !important;
          }
          .stock-badge span {
            font-size: 10px !important;
          }
          .stock-badge span:first-child {
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}