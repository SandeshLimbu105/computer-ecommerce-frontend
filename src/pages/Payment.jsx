import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../api/orderApi";
import { initiateEsewa, getPaymentByOrder } from "../api/paymentApi"; // ✅ ADD getPaymentByOrder
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null); // ✅ Track existing payment
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrderAndPayment();
  }, [orderId]);

  const loadOrderAndPayment = async () => {
    try {
      // Load order
      const orderRes = await getOrder(orderId);
      setOrder(orderRes.data);

      // ✅ Check if payment already exists
      try {
        const paymentRes = await getPaymentByOrder(orderId);
        setExistingPayment(paymentRes.data);
        console.log("Existing payment found:", paymentRes.data);
      } catch (e) {
        // No payment exists yet - that's fine
        console.log("No existing payment found");
        setExistingPayment(null);
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not load order.");
    }
  };

  const startPayment = async () => {
    setError("");
    setLoading(true);
    try {
      let fields;

      // ✅ If payment already exists, use it
      if (existingPayment) {
        console.log("Using existing payment:", existingPayment);
        // Get fresh eSewa data with existing payment
        const response = await initiateEsewa(orderId);
        fields = response.data;
      } else {
        // Create new payment
        const response = await initiateEsewa(orderId);
        fields = response.data;
      }

      setPayment(fields);

      // ✅ Extract payment URL and form fields
      const { paymentUrl, ...formFields } = fields;

      // ✅ Create and submit POST form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(formFields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error("Payment error:", e);
      setError(e.response?.data?.message || "Could not initiate payment.");
      setLoading(false);
    }
  };

  if (!order) return <Loading text="Loading payment..." />;

  return (
    <div className="container py-5">
      <div className="payment-card card border-0 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h3">Payment for Order #{order.orderId}</h1>
          <div className="d-flex justify-content-between my-4">
            <span>Amount</span>
            <strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong>
          </div>
          <div className="mb-3">
            Order status: <StatusBadge status={order.status} />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}

          {!payment ? (
            <button
              className="btn btn-primary w-100 py-2"
              onClick={startPayment}
              disabled={loading || order.status !== "PENDING_PAYMENT"}
            >
              {loading ? "Processing..." : "Pay with eSewa 🚀"}
            </button>
          ) : (
            <>
              <div className="alert alert-success">
                Payment initiated. Transaction reference: <strong>{payment.txnRef}</strong>
                <div className="small mt-2 text-muted">
                  You will be redirected to eSewa...
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary flex-fill"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  View order
                </button>
                <Link className="btn btn-primary flex-fill" to="/orders">
                  My orders
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}