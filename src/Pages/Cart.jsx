import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Shield, Truck, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useState, useEffect } from "react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle quantity input change
  const handleQtyChange = (item, value) => {
    const newQty = parseInt(value);
    if (value === "") {
      // Don't update if empty, but we'll handle blur
      return;
    }
    if (!isNaN(newQty) && newQty >= 1) {
      // Calculate difference
      const diff = newQty - item.quantity;
      updateQuantity(item.productId, item.color, diff);
    }
  };

  // Handle blur to set minimum quantity
  const handleQtyBlur = (item, value) => {
    if (value === "" || parseInt(value) < 1) {
      const diff = 1 - item.quantity;
      updateQuantity(item.productId, item.color, diff);
    }
  };

  // EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "80px 24px",
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "var(--sandalwood)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px"
        }}>
          <ShoppingBag size={48} color="var(--text)" />
        </div>
        <h2 style={{ 
          fontFamily: "Fraunces, serif", 
          fontSize: 26, 
          fontWeight: 700, 
          marginBottom: 10 
        }}>
          Your cart is empty
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
          Looks like you haven't added any items yet.
          <br />
          Start shopping to fill your cart!
        </p>
        <Link to="/products" className="btn btn-primary" style={{ padding: "12px 40px" }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      for (const item of cart) {
        await api.post("/orders", {
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
        });
      }
      clearCart();
      navigate("/order-confirmed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while placing order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ 
      padding: "30px 24px 80px",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    }}>
      {/* Header with Back Button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ 
            fontFamily: "Fraunces, serif", 
            fontSize: "clamp(24px, 4vw, 28px)", 
            fontWeight: 700,
            margin: 0
          }}>
            Your Cart
          </h1>
        </div>
        <span style={{ 
          fontSize: 14, 
          color: "var(--muted)",
          background: "#f8f9fa",
          padding: "6px 16px",
          borderRadius: "20px",
          fontWeight: 500
        }}>
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {error && (
        <div style={{ 
          background: "#fbeaec", 
          color: "#b5555c", 
          padding: "14px 18px", 
          borderRadius: 8, 
          fontSize: 14, 
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", 
        gap: 32,
        alignItems: "start"
      }}>
        
        {/* Cart Items */}
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.color || 'default'}`}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "90px 1fr",
                gap: isMobile ? 14 : 18,
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: isMobile ? 14 : 18,
                transition: "box-shadow 0.3s ease, transform 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Product Image */}
              <div style={{ 
                width: "100%",
                aspectRatio: "1/1",
                maxWidth: isMobile ? "120px" : "90px",
                margin: isMobile ? "0 auto" : "0",
                background: "var(--sandalwood)", 
                borderRadius: 8, 
                overflow: "hidden"
              }}>
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
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
                    fontSize: 12,
                    color: "var(--muted)"
                  }}>
                    No image
                  </div>
                )}
              </div>

              {/* Product Info & Controls */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%"
              }}>
                {/* Product Name & Price Row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  flexWrap: "wrap"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontFamily: "Fraunces, serif", 
                      fontWeight: 600, 
                      fontSize: isMobile ? 15 : 16,
                      lineHeight: 1.3
                    }}>
                      {item.name}
                    </div>
                    {item.color && (
                      <div style={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 4
                      }}>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>Color:</span>
                        <span style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: item.color.toLowerCase(),
                          border: "1px solid rgba(0,0,0,0.1)"
                        }} />
                        <span style={{ fontSize: 13, color: "var(--text)" }}>{item.color}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    color: "var(--maroon)",
                    fontSize: isMobile ? 17 : 18,
                    whiteSpace: "nowrap"
                  }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>

                {/* Quantity & Remove Row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 4,
                  flexWrap: "wrap"
                }}>
                  {/* Quantity Controls with Manual Input */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#f8f9fa"
                  }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.color, -1)}
                      style={{
                        width: isMobile ? 36 : 32,
                        height: isMobile ? 36 : 32,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                        color: "var(--text)",
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Minus size={16} />
                    </button>
                    
                    {/* Manual Quantity Input */}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQtyChange(item, e.target.value)}
                      onBlur={(e) => handleQtyBlur(item, e.target.value)}
                      style={{
                        width: isMobile ? "40px" : "36px",
                        textAlign: "center",
                        border: "none",
                        outline: "none",
                        fontSize: isMobile ? 15 : 14,
                        fontWeight: 600,
                        padding: "4px 0",
                        background: "transparent",
                        color: "var(--text)",
                        fontFamily: "inherit"
                      }}
                    />
                    
                    <button 
                      onClick={() => updateQuantity(item.productId, item.color, 1)}
                      style={{
                        width: isMobile ? 36 : 32,
                        height: isMobile ? 36 : 32,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                        color: "var(--text)",
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Quick Quantity Buttons */}
                  <div style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap"
                  }}>
                    {[2, 5, 10, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const diff = num - item.quantity;
                          updateQuantity(item.productId, item.color, diff);
                        }}
                        style={{
                          padding: "4px 8px",
                          fontSize: isMobile ? 11 : 12,
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          background: item.quantity === num ? "var(--sandalwood)" : "transparent",
                          color: item.quantity === num ? "var(--maroon)" : "var(--muted)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontWeight: item.quantity === num ? 600 : 400
                        }}
                        onMouseEnter={(e) => {
                          if (item.quantity !== num) {
                            e.currentTarget.style.background = "var(--sandalwood)";
                            e.currentTarget.style.color = "var(--text)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (item.quantity !== num) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--muted)";
                          }
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.color)}
                    style={{
                      fontSize: 12,
                      color: "#b5555c",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: 6,
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontWeight: 500,
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fbeaec";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Trash2 size={14} />
                    <span className="remove-text">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Sticky */}
        <div style={{ 
          position: "sticky",
          top: 24,
          alignSelf: "start"
        }}>
          <div style={{ 
            background: "#fff", 
            border: "1px solid var(--line)", 
            borderRadius: 12, 
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ 
              fontFamily: "Fraunces, serif", 
              fontSize: 20, 
              fontWeight: 700, 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid var(--line)"
            }}>
              Order Summary
            </h3>
            
            {/* Summary Details */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: 12,
              marginBottom: 20
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: 14, 
                color: "var(--muted)"
              }}>
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: 14, 
                color: "var(--sage)",
                fontWeight: 500
              }}>
                <span>Shipping</span>
                <span style={{ color: "var(--sage)" }}>Free</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: 13,
                color: "var(--muted)",
                paddingTop: 4
              }}>
                <span>Estimated delivery</span>
                <span>3-5 business days</span>
              </div>
            </div>
            
            {/* Total */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: 20, 
              fontWeight: 700, 
              borderTop: "2px solid var(--line)", 
              paddingTop: 16, 
              marginBottom: 20,
              paddingBottom: 4
            }}>
              <span>Total</span>
              <span style={{ color: "var(--maroon)" }}>₹{cartTotal}</span>
            </div>
            
            {/* Place Order Button */}
            <button 
              className="btn btn-primary" 
              style={{ 
                width: "100%",
                padding: "14px",
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8
              }} 
              onClick={handlePlaceOrder} 
              disabled={placing}
            >
              {placing ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }} />
                  Placing Order...
                </span>
              ) : (
                `Proceed to Checkout`
              )}
            </button>
            
            {/* Login Prompt */}
            {!user && (
              <p style={{ 
                fontSize: 13, 
                color: "var(--muted)", 
                textAlign: "center", 
                marginTop: 14,
                padding: "10px",
                background: "#f8f9fa",
                borderRadius: 6
              }}>
                Please <Link to="/login" style={{ color: "var(--maroon)", fontWeight: 600 }}>login</Link> to place your order
              </p>
            )}

            {/* Trust Badges */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--line)",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                <Shield size={16} />
                <span className="badge-text">Secure Checkout</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                <Truck size={16} />
                <span className="badge-text">Free Shipping</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                <CreditCard size={16} />
                <span className="badge-text">Safe Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 600px) {
          .remove-text {
            display: none;
          }
          .badge-text {
            display: none;
          }
        }

        @media (min-width: 601px) {
          .remove-text {
            display: inline;
          }
          .badge-text {
            display: inline;
          }
        }

        /* Remove number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}