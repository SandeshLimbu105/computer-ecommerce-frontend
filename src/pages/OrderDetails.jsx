import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, cancelOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await getOrder(orderId);
      setOrder(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load order.");
    }
  };

  useEffect(() => { load(); }, [orderId]);

  const cancel = async () => {
    try {
      const { data } = await cancelOrder(orderId);
      setOrder(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not cancel order.");
    }
  };

  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!order) return <Loading text="Loading order..." />;

  return (
    <div className="container py-5">
      <Link to="/orders" className="text-decoration-none">← My orders</Link>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <div><h1 className="h2">Order #{order.orderId}</h1><div className="text-secondary">{new Date(order.orderDate).toLocaleString()}</div></div>
        <StatusBadge status={order.status} />
      </div>

      {error && <ErrorMessage message={error} />}
      <div className="row g-4">
        <div className="col-lg-8">
          {order.orderItems?.map((item) => (
            <div className="card border-0 shadow-sm mb-3" key={item.orderItemId}>
              <div className="card-body d-flex justify-content-between">
                <div><strong>{item.product?.name}</strong><div className="text-secondary">Qty: {item.quantity}</div></div>
                <strong>Rs. {(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between"><span>Total</span><strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong></div>
              {order.status === "PENDING_PAYMENT" && (
                <>
                  <Link to={`/payment/${order.orderId}`} className="btn btn-primary w-100 mt-3">Pay now</Link>
                  <button className="btn btn-outline-danger w-100 mt-2" onClick={cancel}>Cancel order</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
