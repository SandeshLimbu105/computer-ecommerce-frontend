import api from "./axios";

export const getProducts = () => api.get("/products");
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`);
export const searchProducts = (keyword) =>
  api.get("/products/search", { params: { keyword } });

export const createProduct = (product, categoryId) =>
  api.post("/products", product, { params: { categoryId } });
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCategories = () => api.get("/categories");
export const createCategory = (category) => api.post("/categories", category);
export const updateCategory = (id, category) =>
  api.put(`/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getTrending = () => api.get("/recommendations/trending");
export const getFrequentlyBought = (productId) =>
  api.get(`/recommendations/product/${productId}`);
export const getPersonalized = (userId) =>
  api.get(`/recommendations/user/${userId}`);
