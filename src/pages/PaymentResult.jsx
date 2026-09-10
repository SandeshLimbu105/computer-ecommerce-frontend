import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";  // ✅ ADDED
import { trackPurchase, trackBackendActivity } from "../analytics/analytics";  // ✅ ADDED

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get("status");

  // ✅ ADDED: Track purchase on success
  useEffect(() => {
    if (status === "success") {
      trackPurchase({ orderId: "current", totalAmount: 0, orderItems: [] });
      trackBackendActivity('PURCHASE', {});
    }
  }, [status]);

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm mx-auto payment-card">
        <div className="card-body p-5 text-center">
          <i className={`bi ${status === "success" ? "bi-check-circle text-success" : "bi-info-circle text-primary"} display-3`} />
          <h1 className="h3 mt-3">{status === "success" ? "Payment successful" : "Payment result"}</h1>
          <p className="text-secondary">
            Payment callbacks are handled by the Spring Boot backend. Check your order status for the final state.
          </p>
          <Link className="btn btn-primary" to="/orders">Go to orders</Link>
        </div>
      </div>
    </div>
  );
}