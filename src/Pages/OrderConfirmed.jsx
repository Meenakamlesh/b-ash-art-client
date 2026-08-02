import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmed() {
  return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <CheckCircle size={64} color="var(--sage)" style={{ margin: "0 auto 20px" }} />
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, marginBottom: 10 }}>
        Order Confirmed!
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 26, maxWidth: 400, margin: "0 auto 26px" }}>
        Thank you for shopping with us. Your handcrafted pieces are being prepared with care.
      </p>
      <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
}