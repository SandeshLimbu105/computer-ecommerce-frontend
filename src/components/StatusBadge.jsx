export default function StatusBadge({ status }) {
  const map = {
    PENDING_PAYMENT: "warning",
    CONFIRMED: "primary",
    SHIPPED: "info",
    DELIVERED: "success",
    CANCELLED: "secondary",
    FAILED: "danger",
    PENDING: "warning",
    SUCCESS: "success"
  };
  return <span className={`badge text-bg-${map[status] || "dark"}`}>{status}</span>;
}
