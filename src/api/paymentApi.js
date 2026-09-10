import api from "./axios";

// ✅ eSewa initiation (creates payment if needed)
export const initiateEsewa = (orderId) =>
  api.post(`/payments/esewa/initiate/${orderId}`);

// ✅ Check if payment already exists
export const getPaymentByOrder = (orderId) =>
  api.get(`/payments/order/${orderId}`);