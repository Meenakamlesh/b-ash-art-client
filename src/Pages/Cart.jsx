import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

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
      // Har cart item ke liye alag order create karte hain
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
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 700, marginBottom: 26 }}>
        Your Cart <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 500 }}>({cart.length} items)</span>
      </h1>

      {error && (
        <div style={{ background: "#fbeaec", color: "#b5555c", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 30 }} className="cart-layout">
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: 16,
                borderBottom: i < cart.length - 1 ? "1px solid var(--line)" : "none",
                flexWrap: "wrap",
              }}
            >
              <div style={{ width: 70, height: 70, background: "var(--sandalwood)", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>

              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                {item.color && <div style={{ fontSize: 12, color: "var(--muted)" }}>Color: {item.color}</div>}
              </div>

              <div className="qty-stepper">
                <button onClick={() => updateQuantity(item.productId, item.color, -1)}>−</button>
                <span className="val">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.color, 1)}>+</button>
              </div>

              <div style={{ fontWeight: 700, color: "var(--maroon)", minWidth: 70, textAlign: "right" }}>
                ₹{item.price * item.quantity}
              </div>

              <button
                onClick={() => removeFromCart(item.productId, item.color)}
                style={{ fontSize: 12, color: "var(--muted)", textDecoration: "underline" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 22, height: "fit-content" }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--muted)", marginBottom: 10 }}>
            <span>Subtotal</span><span>₹{cartTotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--sage)", fontWeight: 600, marginBottom: 14 }}>
            <span>Shipping</span><span>Free</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, borderTop: "1px solid var(--line)", paddingTop: 14, marginBottom: 18 }}>
            <span>Total</span><span>₹{cartTotal}</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}