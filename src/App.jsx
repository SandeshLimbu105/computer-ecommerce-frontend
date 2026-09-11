import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AnalyticsTracker from "./components/AnalyticsTracker";  // ✅ ADDED

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import PaymentResult from "./pages/PaymentResult";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />  {/* ✅ ADDED - Tracks page views on route changes */}
      <Navbar />

      <main className="min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/payment-result" element={<PaymentResult />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional Footer */}
      <footer className="site-footer">
        <div className="container footer-grid footer-grid-expanded">

          {/* About */}
          <div className="footer-about">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">
                <i className="bi bi-cpu" />
              </span>

              <span>
                <strong>CORE</strong>
                <small>PARTS</small>
              </span>
            </Link>

            <p>
              Reliable PC components and accessories for gaming,
              productivity and custom builds. Compare products,
              check stock and order securely.
            </p>

            <div className="footer-socials">
              <span>
                <i className="bi bi-shield-check" /> Secure shopping
              </span>

              <span>
                <i className="bi bi-truck" /> Fast delivery
              </span>
            </div>
          </div>

          {/* About / Store */}
          <div>
            <strong>About</strong>

            <Link to="/">
              Our store
            </Link>

            <Link to="/products">
              Browse components
            </Link>

            <span>
              Quality-focused PC parts
            </span>
          </div>

          {/* Customer Care */}
          <div>
            <strong>Customer care</strong>

            <Link to="/orders">
              Order tracking
            </Link>

            <span>
              Secure checkout
            </span>

            <span>
              eSewa Sandbox payments
            </span>
          </div>

          {/* Contact */}
          <div>
            <strong>Contact</strong>

            <span>
              <i className="bi bi-envelope me-2" />
              support via store account
            </span>

            <span>
              <i className="bi bi-chat-dots me-2" />
              Customer support
            </span>

            <span>
              <i className="bi bi-clock me-2" />
              Mon–Sat · 9:00–18:00
            </span>
          </div>

        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Core Parts
          </span>

          <span>
            Built for PC builders.
          </span>
        </div>
      </footer>
    </BrowserRouter>
  );
}