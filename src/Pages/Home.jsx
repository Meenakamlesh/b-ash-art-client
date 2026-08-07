import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Heart, Clock } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data.products.slice(0, 4)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Features data
  const features = [
    { icon: <Truck size={24} />, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: <Shield size={24} />, title: "Secure Payment", desc: "100% protected checkout" },
    { icon: <Heart size={24} />, title: "Handcrafted", desc: "Made by artisan families" },
    { icon: <Clock size={24} />, title: "Fast Delivery", desc: "3-5 business days" },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{ 
        background: "linear-gradient(135deg, var(--sandalwood) 0%, #f5ede4 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(139, 69, 19, 0.05)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(139, 69, 19, 0.04)",
          pointerEvents: "none"
        }} />
        
        <div className="wrap" style={{ 
          textAlign: "center", 
          maxWidth: 680, 
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{ 
            fontSize: 13, 
            letterSpacing: 3, 
            textTransform: "uppercase", 
            color: "var(--brass)", 
            fontWeight: 700, 
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}>
            <span style={{ width: 30, height: 1, background: "var(--brass)" }} />
            Handmade in India
            <span style={{ width: 30, height: 1, background: "var(--brass)" }} />
          </div>
          
          <h1 style={{ 
            fontFamily: "Fraunces, serif", 
            fontSize: 48, 
            fontWeight: 700, 
            marginBottom: 16, 
            lineHeight: 1.15,
            letterSpacing: "-0.5px"
          }}>
            Idols carved with <br />
            <span style={{ color: "var(--maroon)" }}>devotion</span>, delivered to your home.
          </h1>
          
          <p style={{ 
            color: "var(--muted)", 
            marginBottom: 32,
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto 32px"
          }}>
            Handcrafted religious décor made by artisan families across India.
          </p>
          
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-primary" style={{ 
              padding: "14px 36px",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              Shop the collection
              <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-outline" style={{ 
              padding: "14px 36px",
              fontSize: 16
            }}>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{
        padding: "40px 24px",
        borderBottom: "1px solid var(--line)",
        background: "#fff"
      }}>
        <div className="wrap" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto"
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 8,
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--sandalwood)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--sandalwood)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brass)",
                flexShrink: 0
              }}>
                {feature.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{feature.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "60px 24px 80px", background: "#faf8f6" }}>
        <div className="wrap" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16
          }}>
            <div>
              <h2 style={{ 
                fontFamily: "Fraunces, serif", 
                fontSize: 30, 
                fontWeight: 700,
                marginBottom: 4
              }}>
                Featured Products
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 15 }}>
                Handpicked just for you
              </p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14
            }}>
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 24
            }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 20,
                  border: "1px solid var(--line)",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}>
                  <div style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    background: "var(--sandalwood)",
                    borderRadius: 8,
                    marginBottom: 12
                  }} />
                  <div style={{
                    height: 18,
                    width: "70%",
                    background: "var(--sandalwood)",
                    borderRadius: 4,
                    marginBottom: 8
                  }} />
                  <div style={{
                    height: 14,
                    width: "40%",
                    background: "var(--sandalwood)",
                    borderRadius: 4
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="prod-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24
            }}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER / CTA SECTION */}
      {/* <section style={{
        background: "linear-gradient(135deg, var(--maroon) 0%, #6b2d2d 100%)",
        padding: "60px 24px",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "Fraunces, serif",
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 12
          }}>
            Join the Community
          </h2>
          <p style={{
            opacity: 0.85,
            fontSize: 16,
            marginBottom: 24,
            lineHeight: 1.6
          }}>
            Subscribe to receive updates on new collections and special offers.
          </p>
          <div style={{
            display: "flex",
            gap: 12,
            maxWidth: 480,
            margin: "0 auto",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                minWidth: 200,
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                outline: "none"
              }}
            />
            <button
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: "white",
                color: "var(--maroon)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section> */}

      {/* PULSE ANIMATION FOR LOADING */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}