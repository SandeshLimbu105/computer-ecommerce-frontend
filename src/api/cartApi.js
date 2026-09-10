import api from "./axios";

export const addToCart = (userId, productId, quantity) =>
  api.post(`/cart/${userId}/add`, { productId, quantity });

export const getCart = (userId) =>
  api.get(`/cart/${userId}`);

export const updateCartItem = (cartItemId, quantity) =>
  api.put(`/cart/items/${cartItemId}?quantity=${quantity}`);

export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/items/${cartItemId}`);

export const clearCart = (userId) =>
  api.delete(`/cart/${userId}/clear`);