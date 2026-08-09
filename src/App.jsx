import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import OrderConfirmed from "./Pages/OrderConfirmed";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminInventory from "./Pages/admin/AdminInventory";
import AdminOrders from "./Pages/admin/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<div style={{ padding: 60, textAlign: "center" }}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;