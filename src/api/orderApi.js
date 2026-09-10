import api from "./axios";

export const placeOrder = (userId, shippingAddress) =>
  api.post("/orders/place", { shippingAddress }, { params: { userId } });

export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const getOrder = (orderId) => api.get(`/orders/${orderId}`);
export const getAllOrders = () => api.get("/orders/all");
export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, { status });
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);
