import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await placeOrder(user.userId, shippingAddress);
      navigate(`/payment/${data.orderId}`);
    } catch (e) {
      setError(e.response?.data?.message || "Could not place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3">Checkout</h1>
          <p className="text-secondary">Enter the shipping address for this order.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <label className="form-label">Shipping address</label>
            <textarea className="form-control mb-4" rows="5" required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
