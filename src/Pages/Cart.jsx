import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
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

  // EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <ShoppingBag size={56} color="var(--line)" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
          Your cart is empty
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 26 }}>
          Looks like you haven't added anything yet.
        </p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
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
    <div className="wrap" style={{ padding: "40px 24px 80px" }}>
      <h1 style={{ 
        fontFamily: "Fraunces, serif", 
        fontSize: 28, 
        fontWeight: 700, 
        marginBottom: 26 
      }}>
        Your Cart <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 500 }}>({cart.length} items)</span>
      </h1>

      {error && (
        <div style={{ 
          background: "#fbeaec", 
          color: "#b5555c", 
          padding: "10px 14px", 
          borderRadius: 8, 
          fontSize: 13.5, 
          marginBottom: 18 
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", 
        gap: 30,
        width: "100%"
      }} className="cart-layout">
        
        {/* Cart Items */}
        <div style={{ 
          background: "#fff", 
          border: "1px solid var(--line)", 
          borderRadius: 12, 
          overflow: "hidden",
          width: "100%"
        }}>
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "70px 1fr auto 70px auto",
                alignItems: "center",
                gap: isMobile ? 12 : 16,
                padding: isMobile ? 16 : 16,
                borderBottom: i < cart.length - 1 ? "1px solid var(--line)" : "none",
                width: "100%"
              }}
            >
              {/* Image - Fixed size */}
              <div style={{ 
                width: isMobile ? 80 : 70, 
                height: isMobile ? 80 : 70, 
                background: "var(--sandalwood)", 
                borderRadius: 8, 
                overflow: "hidden", 
                flexShrink: 0,
                justifySelf: isMobile ? "center" : "start"
              }}>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }} 
                  />
                )}
              </div>

              {/* Product Info */}
              <div style={{ 
                flex: 1, 
                minWidth: 0,
                textAlign: isMobile ? "center" : "left",
                width: "100%"
              }}>
                <div style={{ 
                  fontFamily: "Fraunces, serif", 
                  fontWeight: 600, 
                  fontSize: isMobile ? 16 : 15,
                  wordBreak: "break-word"
                }}>
                  {item.name}
                </div>
                {item.color && (
                  <div style={{ 
                    fontSize: 12, 
                    color: "var(--muted)",
                    marginTop: 2 
                  }}>
                    Color: {item.color}
                  </div>
                )}
                {isMobile && (
                  <div style={{ 
                    fontWeight: 700, 
                    color: "var(--maroon)",
                    marginTop: 4,
                    fontSize: 16
                  }}>
                    ₹{item.price * item.quantity}
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="qty-stepper" style={{ 
                justifySelf: isMobile ? "center" : "start",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <button 
                  onClick={() => updateQuantity(item.productId, item.color, -1)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid var(--line)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16
                  }}
                >
                  −
                </button>
                <span className="val" style={{ 
                  minWidth: 24, 
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.productId, item.color, 1)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid var(--line)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16
                  }}
                >
                  +
                </button>
              </div>

              {/* Price - Desktop */}
              {!isMobile && (
                <div style={{ 
                  fontWeight: 700, 
                  color: "var(--maroon)", 
                  minWidth: 70, 
                  textAlign: "right" 
                }}>
                  ₹{item.price * item.quantity}
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.productId, item.color)}
                style={{ 
                  fontSize: 12, 
                  color: "var(--muted)", 
                  textDecoration: "underline",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  justifySelf: isMobile ? "center" : "start"
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ 
          background: "#fff", 
          border: "1px solid var(--line)", 
          borderRadius: 12, 
          padding: 22, 
          height: "fit-content",
          width: "100%"
        }}>
          <h3 style={{ 
            fontFamily: "Fraunces, serif", 
            fontSize: 18, 
            fontWeight: 700, 
            marginBottom: 16 
          }}>
            Order Summary
          </h3>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 14, 
            color: "var(--muted)", 
            marginBottom: 10 
          }}>
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 14, 
            color: "var(--sage)", 
            fontWeight: 600, 
            marginBottom: 14 
          }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 16, 
            fontWeight: 700, 
            borderTop: "1px solid var(--line)", 
            paddingTop: 14, 
            marginBottom: 18 
          }}>
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: "100%" }} 
            onClick={handlePlaceOrder} 
            disabled={placing}
          >
            {placing ? "Placing order..." : "Place Order"}
          </button>
          
          {!user && (
            <p style={{ 
              fontSize: 12, 
              color: "var(--muted)", 
              textAlign: "center", 
              marginTop: 12 
            }}>
              Please <Link to="/login" style={{ color: "var(--maroon)" }}>login</Link> to place order
            </p>
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .wrap {
            padding: 20px 16px 60px !important;
          }
          
          .wrap h1 {
            font-size: 22px !important;
          }
          
          .qty-stepper button {
            width: 32px !important;
            height: 32px !important;
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .wrap {
            padding: 16px 12px 50px !important;
          }
          
          .wrap h1 {
            font-size: 20px !important;
            margin-bottom: 18px !important;
          }
          
          .wrap h1 span {
            font-size: 14px !important;
          }
          
          .cart-layout > div:first-child {
            border-radius: 8px !important;
          }
          
          .cart-layout > div:first-child > div {
            padding: 14px !important;
            gap: 10px !important;
          }
          
          .qty-stepper button {
            width: 36px !important;
            height: 36px !important;
            font-size: 20px !important;
          }
          
          .qty-stepper span {
            font-size: 16px !important;
            min-width: 28px !important;
          }
        }

        @media (max-width: 360px) {
          .wrap {
            padding: 12px 8px 40px !important;
          }
          
          .wrap h1 {
            font-size: 18px !important;
          }
          
          .cart-layout > div:first-child > div {
            padding: 12px !important;
          }
          
          .qty-stepper button {
            width: 30px !important;
            height: 30px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}