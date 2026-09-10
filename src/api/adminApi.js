import api from "./axios";

export const getAdminOrders = () => api.get("/admin/orders");
export const updateAdminOrderStatus = (orderId, status) =>
  api.put(`/admin/orders/${orderId}/status`, { status });
export const updateProductStock = (productId, stockQty) =>
  api.put(`/admin/products/${productId}/stock`, { stockQty });
