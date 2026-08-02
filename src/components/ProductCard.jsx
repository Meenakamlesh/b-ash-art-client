import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const variantImage = product.variants?.find((v) => v.color === selectedColor)?.imageUrl;
  const displayImage = variantImage || product.imageUrl;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }
    addToCart({ ...product, imageUrl: displayImage }, qty, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
      <div
        style={{ aspectRatio: "1/1", background: "var(--sandalwood)", overflow: "hidden", cursor: "pointer" }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {displayImage ? (
          <img src={displayImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>
            No image
          </div>
        )}
      </div>

      <div style={{ padding: 14 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>
          {product.name}
        </div>
        <div style={{ fontWeight: 700, color: "var(--maroon)", fontSize: 15, marginBottom: 10 }}>
          ₹{product.price}
        </div>

        {product.colors?.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {product.colors.map((color) => (
              <span
                key={color}
                title={color}
                onClick={() => setSelectedColor(color)}
                className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
                style={{ background: color.toLowerCase() }}
              />
            ))}
          </div>
        )}

        {isOutOfStock ? (
          <div style={{ fontSize: 12.5, color: "#b5555c", fontWeight: 600, marginBottom: 6 }}>
            Out of Stock
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div className="qty-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="val">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: "9px", fontSize: 13.5 }} onClick={handleAddToCart}>
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}