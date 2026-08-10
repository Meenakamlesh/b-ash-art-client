import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { ShoppingBag, ChevronLeft, Minus, Plus, Check } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setProduct(p);    
        const firstColor = p.colors?.[0] || null;
        setSelectedColor(firstColor);
        const variantImg = p.variants?.find((v) => v.color === firstColor)?.imageUrl;
        setMainImage(variantImg || p.imageUrl);
        setLoading(false);
      })
      .catch((err) => {
        setError("Product not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "60vh",
        padding: "40px 24px"
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
          <p style={{ color: "var(--muted)" }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "60vh",
        padding: "40px 24px",
        textAlign: "center"
      }}>
        <div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, marginBottom: 12 }}>Product Not Found</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.color === selectedColor);
  const currentStock = product.colors?.length > 0 ? (currentVariant?.stock ?? 0) : product.stock;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variantImg = product.variants?.find((v) => v.color === color)?.imageUrl;
    if (variantImg) setMainImage(variantImg);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }
    if (qty > currentStock) {
      alert(`Only ${currentStock} items available in stock`);
      return;
    }
    addToCart({ ...product, imageUrl: mainImage }, qty, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="wrap" style={{ padding: "40px 24px" }}>
      {/* Back Button */}
      <Link 
        to="/products" 
        style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: 6, 
          color: "var(--muted)",
          textDecoration: "none",
          marginBottom: 24,
          fontSize: 14
        }}
      >
        <ChevronLeft size={18} /> Back to Products
      </Link>

      <div className="product-detail-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        {/* Left Column - Images */}
        <div>
          <div style={{ 
            aspectRatio: "1/1", 
            background: "var(--sandalwood)", 
            borderRadius: 12, 
            overflow: "hidden", 
            marginBottom: 14,
            position: "relative"
          }}>
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.name} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover"
                }} 
              />
            ) : (
              <div style={{ 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "var(--muted)",
                fontSize: 14
              }}>
                No image available
              </div>
            )}
            {isOutOfStock && (
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#b5555c",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600
              }}>
                Out of Stock
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", 
              gap: 10 
            }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: mainImage === img ? "2px solid var(--maroon)" : "2px solid var(--line)",
                    background: "var(--sandalwood)"
                  }}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - ${i + 1}`} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ 
            fontFamily: "Fraunces, serif", 
            fontSize: 32, 
            fontWeight: 700, 
            marginBottom: 10,
            lineHeight: 1.2
          }}>
            {product.name}
          </h1>
          
          <div style={{ 
            fontSize: 26, 
            fontWeight: 700, 
            color: "var(--maroon)", 
            marginBottom: 16 
          }}>
            ₹{product.price}
          </div>

          {/* Stock Availability - Simple & Clean */}
          <div style={{ 
            padding: "12px 16px", 
            borderRadius: 8, 
            marginBottom: 20,
            background: isOutOfStock ? "#fbeaec" : isLowStock ? "#fff8e1" : "#e8f5e9",
            border: `1px solid ${isOutOfStock ? "#f5c6cb" : isLowStock ? "#ffe0b2" : "#c8e6c9"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>
                {isOutOfStock ? "❌" : isLowStock ? "⚠️" : "✅"}
              </span>
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 15,
                  color: isOutOfStock ? "#b5555c" : isLowStock ? "#e67e22" : "#2e7d32"
                }}>
                  {isOutOfStock ? "Out of Stock" : isLowStock ? `Only ${currentStock} left!` : "In Stock"}
                </div>
                {currentStock > 0 && (
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    {currentStock} units available {selectedColor && `in ${selectedColor}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span>Color:</span>
                <span style={{ 
                  fontWeight: 500, 
                  textTransform: "capitalize",
                  color: "var(--muted)"
                }}>
                  {selectedColor || "Select a color"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {product.colors.map((color) => {
                  const variant = product.variants?.find((v) => v.color === color);
                  const isAvailable = variant?.stock > 0;
                  const stockCount = variant?.stock || 0;
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      disabled={!isAvailable}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px 6px 6px",
                        borderRadius: 20,
                        border: selectedColor === color ? "2px solid var(--maroon)" : "1px solid var(--line)",
                        background: "#fff",
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        opacity: isAvailable ? 1 : 0.5,
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{
                        display: "inline-block",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.toLowerCase(),
                        border: "1px solid var(--line)"
                      }} />
                      <span style={{ 
                        fontSize: 13, 
                        textTransform: "capitalize",
                        fontWeight: selectedColor === color ? 600 : 400
                      }}>
                        {color}
                      </span>
                      {selectedColor === color && (
                        <Check size={14} color="var(--maroon)" />
                      )}
                      {isAvailable && stockCount <= 5 && (
                        <span style={{
                          fontSize: 10,
                          color: "#e67e22",
                          fontWeight: 600
                        }}>
                          ({stockCount} left)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          {isOutOfStock ? (
            <div style={{ 
              background: "#fbeaec", 
              color: "#b5555c", 
              padding: "14px 20px", 
              borderRadius: 8,
              textAlign: "center",
              fontWeight: 600,
              marginTop: 10
            }}>
              Currently out of stock
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 22 }}>
                <label style={{ 
                  display: "block", 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 8 
                }}>
                  Quantity
                </label>
                <div className="qty-stepper" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "4px",
                  background: "#fff"
                }}>
                  <button 
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "var(--sandalwood)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ 
                    minWidth: 36, 
                    textAlign: "center", 
                    fontWeight: 700,
                    fontSize: 16
                  }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => setQty((q) => Math.min(q + 1, currentStock))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      cursor: qty < currentStock ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: qty < currentStock ? 1 : 0.5,
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (qty < currentStock) e.target.style.background = "var(--sandalwood)";
                    }}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {qty === currentStock && (
                  <div style={{ fontSize: 12, color: "#e67e22", marginTop: 6 }}>
                    Max quantity reached
                  </div>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                style={{ 
                  width: "100%", 
                  padding: 16,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }} 
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? (
                  <>
                    <Check size={20} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add to Cart
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          
          .product-detail-grid h1 {
            font-size: 28px !important;
          }
        }

        @media (max-width: 768px) {
          .wrap {
            padding: 20px 16px !important;
          }
          
          .product-detail-grid h1 {
            font-size: 24px !important;
          }
          
          .product-detail-grid > div:first-child > div:first-child {
            border-radius: 8px !important;
          }
          
          .product-detail-grid > div:last-child > div:first-child {
            font-size: 22px !important;
          }
        }

        @media (max-width: 480px) {
          .wrap {
            padding: 16px 12px !important;
          }
          
          .product-detail-grid {
            gap: 20px !important;
          }
          
          .product-detail-grid h1 {
            font-size: 20px !important;
          }
          
          .product-detail-grid > div:last-child > div:first-child {
            font-size: 20px !important;
          }
          
          .product-detail-grid > div:last-child > button {
            padding: 14px !important;
            font-size: 15px !important;
          }
          
          .qty-stepper {
            padding: 2px !important;
          }
          
          .qty-stepper button {
            width: 32px !important;
            height: 32px !important;
          }
          
          .qty-stepper span {
            min-width: 30px !important;
            font-size: 14px !important;
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