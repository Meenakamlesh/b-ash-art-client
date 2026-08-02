import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wrap" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 700, marginBottom: 20 }}>
        All Products
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--line)", borderRadius: 24, padding: "10px 18px", maxWidth: 340, marginBottom: 32 }}>
        <Search size={16} color="var(--muted)" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: "none", outline: "none", fontSize: 14, flex: 1, fontFamily: "inherit" }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No products found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}