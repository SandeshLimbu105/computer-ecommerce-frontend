import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { trackPurchase, trackBackendActivity } from "../analytics/analytics";
import { getOrder } from "../api/orderApi";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const orderId = params.get("orderId");
  const [message, setMessage] = useState(null);

  // ✅ FIX (bug #10): track the purchase with the REAL order total/items
  // instead of hardcoded placeholder values.
  useEffect(() => {
    if (status !== "success") return;

    if (!orderId) {
      // No orderId available — still record that a purchase event happened
      trackBackendActivity('PURCHASE', {});
      return;
    }

    // Fetch the real order and track it with accurate data
    getOrder(orderId)
      .then((res) => {
        const order = res.data;
        trackPurchase({
          orderId: order.orderId,
          totalAmount: order.totalAmount,
          orderItems: order.orderItems || [],
        });
        trackBackendActivity('PURCHASE', {
          orderId: order.orderId,
          totalAmount: order.totalAmount,
        });
      })
      .catch(() => {
        // Order lookup failed — still record the event without inventing data
        trackBackendActivity('PURCHASE', { orderId });
        setMessage(
          "Payment confirmed, but we couldn't load the order summary just now."
        );
      });
  }, [status, orderId]);

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm mx-auto payment-card">
        <div className="card-body p-5 text-center">
          <i
            className={`bi ${
              status === "success"
                ? "bi-check-circle text-success"
                : "bi-info-circle text-primary"
            } display-3`}
          />
          <h1 className="h3 mt-3">
            {status === "success" ? "Payment successful" : "Payment result"}
          </h1>
          <p className="text-secondary">
            {message ||
              "Payment callbacks are handled by the Spring Boot backend. Check your order status for the final state."}
          </p>
          <Link className="btn btn-primary" to="/orders">
            Go to orders
          </Link>
        </div>
      </div>
    </div>
  );
}