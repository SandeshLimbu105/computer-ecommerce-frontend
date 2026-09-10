import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // ✅ ADDED useNavigate
import { useAuth } from "../context/AuthContext";
import { getCart, updateCartItem, removeFromCart, clearCart } from "../api/cartApi";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductImage from "../components/ProductImage";
import { trackBeginCheckout, trackBackendActivity } from "../analytics/analytics";  // ✅ ADDED

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();  // ✅ ADDED
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const { data } = await getCart(user.userId);
      setCart(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load cart.");
    }
  };

  useEffect(() => { load(); }, [user.userId]);

  const update = async (id, quantity) => {
    try {
      const { data } = await updateCartItem(id, quantity);
      setCart(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not update cart.");
    }
  };

  const remove = async (id) => {
    try {
      const { data } = await removeFromCart(id);
      setCart(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not remove item.");
    }
  };

  const clear = async () => {
    try {
      await clearCart(user.userId);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not clear cart.");
    }
  };

  // ✅ ADDED: Track begin checkout
  const handleCheckout = () => {
    trackBeginCheckout(cart);
    trackBackendActivity('BEGIN_CHECKOUT', {});
    navigate('/checkout');
  };

  if (error && !cart) return <div className="container py-5"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!cart) return <Loading text="Loading cart..." />;

  const items = cart.cartItems || [];
  const total = items.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h2">Shopping cart</h1><p className="text-secondary">{items.length} item(s)</p></div>
        {items.length > 0 && <button className="btn btn-outline-danger" onClick={clear}>Clear cart</button>}
      </div>
      {error && <ErrorMessage message={error} />}
      {!items.length ? (
        <div className="card border-0 shadow-sm text-center p-5">
          <i className="bi bi-cart-x display-4 text-secondary" />
          <h3 className="mt-3">Your cart is empty</h3>
          <Link to="/products" className="btn btn-primary mt-2">Browse products</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {items.map((item) => (
              <div className="card border-0 shadow-sm mb-3" key={item.cartItemId}>
                <div className="card-body d-flex gap-3 align-items-center">
                  <ProductImage product={item.product} className="cart-thumb" alt={item.product?.name} />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{item.product?.name}</h5>
                    <div className="text-secondary">Rs. {Number(item.product?.price || 0).toLocaleString()}</div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => update(item.cartItemId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => update(item.cartItemId, item.quantity + 1)}>+</button>
                      <button className="btn btn-sm btn-link text-danger ms-2" onClick={() => remove(item.cartItemId)}>Remove</button>
                    </div>
                  </div>
                  <strong>Rs. {(Number(item.product?.price || 0) * item.quantity).toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4>Summary</h4>
                <div className="d-flex justify-content-between my-3"><span>Total</span><strong>Rs. {total.toLocaleString()}</strong></div>
                {/* ✅ CHANGED: Link to button with tracking */}
                <button className="btn btn-primary w-100" onClick={handleCheckout}>Proceed to checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}