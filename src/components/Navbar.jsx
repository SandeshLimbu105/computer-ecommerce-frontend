import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const close = () => setOpen(false);

  return (
    <>
      <div className="topbar d-none d-lg-block">
        <div className="container topbar-inner">
          <span><i className="bi bi-shield-check me-1" /> Genuine hardware marketplace</span>
          <span><i className="bi bi-lightning-charge me-1" /> Fast checkout · Secure eSewa Sandbox</span>
        </div>
      </div>
      <nav className="site-nav">
        <div className="container nav-inner">
          <Link className="brand" to="/" onClick={close}>
            <span className="brand-mark"><i className="bi bi-cpu" /></span>
            <span><strong>CORE</strong><small>PARTS</small></span>
          </Link>

          <button className="mobile-nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            <i className={`bi ${open ? "bi-x-lg" : "bi-list"}`} />
          </button>

          <div className={`nav-menu ${open ? "nav-menu-open" : ""}`}>
            <div className="nav-links">
              <NavLink to="/" end className="nav-link-custom" onClick={close}>Home</NavLink>
              <NavLink to="/products" className="nav-link-custom" onClick={close}>Shop</NavLink>
              {isAuthenticated && <NavLink to="/orders" className="nav-link-custom" onClick={close}>Orders</NavLink>}
              {isAdmin && <NavLink to="/admin" className="nav-link-custom" onClick={close}>Admin</NavLink>}
            </div>
            <div className="nav-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="cart-nav" onClick={close}><i className="bi bi-bag" /><span>Cart</span></Link>
                  <div className="account-chip"><span className="account-avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</span><span>{user?.name}</span></div>
                  <button className="nav-logout" onClick={signOut}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-login" onClick={close}>Sign in</Link>
                  <Link to="/register" className="nav-register" onClick={close}>Create account <i className="bi bi-arrow-up-right" /></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
