import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const variantImage = product.variants?.find(
    (v) => v.color === selectedColor,
  )?.imageUrl;
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

  const handleQtyChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.value === "") {
      setQty("");
      return;
    }
    if (!isNaN(value) && value >= 1) {
      setQty(value);
    }
  };

  const handleQtyBlur = () => {
    if (qty === "" || qty < 1) {
      setQty(1);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Image Section */}
      <div
        style={{
          aspectRatio: "1/1",
          background: "var(--sandalwood)",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            No image
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#b5555c",
              color: "white",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Product Name */}
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 600,
            fontSize: 15.5,
            marginBottom: 4,
            lineHeight: 1.3,
            minHeight: "42px",
          }}
        >
          {product.name}
        </div>

        {/* Price */}
        <div
          style={{
            fontWeight: 700,
            color: "var(--maroon)",
            fontSize: 17,
            marginBottom: 10,
          }}
        >
          ₹{product.price}
        </div>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 23,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {product.colors.map((color) => (
              <span
                key={color}
                title={color}
                onClick={() => setSelectedColor(color)}
                // className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
                style={{
                  padding: "4px 12px",
                  borderRadius: 16,
                  fontSize: 12,
                  textTransform: "capitalize",
                  fontWeight: selectedColor === color ? 600 : 400,
                  color:
                    selectedColor === color ? "var(--maroon)" : "var(--text)",
                  border:
                    selectedColor === color
                      ? "2px solid var(--maroon)"
                      : "1px solid var(--line)",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {isOutOfStock ? (
          <div
            style={{
              fontSize: 13,
              color: "#b5555c",
              fontWeight: 600,
              textAlign: "center",
              padding: "10px 0",
              background: "#fbeaec",
              borderRadius: 6,
              marginTop: "auto",
            }}
          >
            Currently Unavailable
          </div>
        ) : (
          <>
            {/* Quantity Selector - No stock display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
                padding: "6px 10px",
                background: "#f8f9fa",
                borderRadius: 8,
                border: "1px solid #e9ecef",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--muted)",
                  minWidth: "32px",
                }}
              >
                Qty:
              </span>
              <div
                className="qty-stepper"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--sandalwood)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={handleQtyChange}
                  onBlur={handleQtyBlur}
                  style={{
                    width: "50px",
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    padding: "4px 0",
                    background: "transparent",
                    color: "var(--text)",
                  }}
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--sandalwood)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: 14,
                fontWeight: 600,
                marginTop: "auto",
                transition: "all 0.2s ease",
              }}
              onClick={handleAddToCart}
            >
              {added ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span>✓</span> Added to Cart
                </span>
              ) : (
                `Add to Cart`
              )}
            </button>
          </>
        )}
      </div>

      {/* CSS for removing number input arrows */}
      <style>{`
        .qty-stepper input[type="number"]::-webkit-inner-spin-button,
        .qty-stepper input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .qty-stepper input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
