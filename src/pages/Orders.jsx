import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../api/orderApi";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await getUserOrders(user.userId);
      setOrders(data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load orders.");
    }
  };

  useEffect(() => { load(); }, [user.userId]);

  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!orders) return <Loading text="Loading orders..." />;

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4">My orders</h1>
      {!orders.length ? <div className="alert alert-light border">You have not placed any orders yet.</div> :
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th /></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>Rs. {Number(o.totalAmount).toLocaleString()}</td>
                  <td><Link className="btn btn-sm btn-outline-primary" to={`/orders/${o.orderId}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}
