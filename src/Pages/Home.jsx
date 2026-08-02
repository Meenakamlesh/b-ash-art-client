import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data.products.slice(0, 4))) // sirf 4 dikhane hain
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{ background: "var(--sandalwood)", padding: "70px 0" }}>
        <div className="wrap" style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 12.5, letterSpacing: 2, textTransform: "uppercase", color: "var(--brass)", fontWeight: 700, marginBottom: 14 }}>
            Handmade in India
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 40, fontWeight: 700, marginBottom: 16, lineHeight: 1.15 }}>
            Idols carved with devotion, delivered to your home.
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>
            Handcrafted religious décor made by artisan families across India.
          </p>
          <Link to="/products" className="btn btn-primary">Shop the collection</Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="wrap" style={{ padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700 }}>Featured Products</h2>
          <Link to="/products" className="btn btn-outline">View all</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="prod-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}