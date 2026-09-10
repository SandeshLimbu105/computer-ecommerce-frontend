import api from "./axios";

export const createReview = (review) => api.post("/reviews", review);
export const getProductReviews = (productId) =>
  api.get(`/reviews/product/${productId}`);
export const getUserReviews = (userId) => api.get(`/reviews/user/${userId}`);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
