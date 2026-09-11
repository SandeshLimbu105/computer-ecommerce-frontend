import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getFrequentlyBought, getPersonalized } from "../api/productApi";
import { getProductReviews, createReview, deleteReview } from "../api/reviewApi";
import { addToCart } from "../api/cartApi";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SEO from "../components/SEO";  //  ADDED
import { useAuth } from "../context/AuthContext";
import { trackProductView, trackAddToCart, trackBackendActivity } from "../analytics/analytics";  //  ADDED

export default function ProductDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const specs = (() => {
    if (!product?.specJson) return [];
    try {
      const parsed = JSON.parse(product.specJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return Object.entries(parsed);
    } catch {}
    return [];
  })();

  const load = async () => {
    try {
      setError("");
      const [p, r, f] = await Promise.all([
        getProduct(id),
        getProductReviews(id),
        getFrequentlyBought(id)
      ]);
      setProduct(p.data);
      setReviews(r.data);
      setRecommendations(f.data);

      // ✅ ADDED: Track product view
      trackProductView(p.data);
      trackBackendActivity('PRODUCT_VIEW', {
        productId: p.data.productId,
        categoryId: p.data.category?.categoryId,
      });
    } catch (e) {
      setError(e.response?.data?.message || "Could not load product.");
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleCart = async () => {
    if (!isAuthenticated) return setMessage("Please login first.");
    try {
      await addToCart(user.userId, product.productId, quantity);
      // ✅ ADDED: Track add to cart
      trackAddToCart(product, quantity);
      trackBackendActivity('ADD_TO_CART', { productId: product.productId });
      setMessage("Added to cart.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not add to cart.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        user: { userId: user.userId },
        product: { productId: product.productId },
        rating: Number(rating),
        comment
      });
      setComment("");
      setRating(5);
      setMessage("Review submitted.");
      const r = await getProductReviews(id);
      setReviews(r.data);
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not submit review.");
    }
  };

  const removeReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((current) => current.filter((r) => r.reviewId !== reviewId));
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not delete review.");
    }
  };

  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!product) return <Loading text="Loading product..." />;

  return (
    <div className="container py-5">
      {/* ✅ ADDED: SEO metadata */}
      <SEO
        title={`${product.name} | Computer Parts Store`}
        description={product.description || `Buy ${product.name} at Computer Parts Store`}
        image={product.imageUrl}
        url={window.location.href}
        type="product"
      />

      <Link to="/products" className="text-decoration-none">← Back to products</Link>
      <div className="row g-5 mt-1">
        <div className="col-lg-6">
          <div className="detail-image-wrap">
            <ProductImage product={product} className="detail-image" loading="eager" />
            <div className="image-caption"><span><i className="bi bi-patch-check" /> Product image</span><span>{product.category?.name || "Computer hardware"}</span></div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="product-detail-brand">{product.brand || "PC HARDWARE"}</div>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price">Rs. {Number(product.price || 0).toLocaleString()}</div>
          <p className="detail-description">{product.description || "No description available."}</p>
          <div className="detail-stock-row">
            <span className={`stock-pill ${Number(product.stockQty) > 0 ? "stock-pill-in" : "stock-pill-out"}`}>
              <i className={`bi ${Number(product.stockQty) > 0 ? "bi-check-circle" : "bi-x-circle"}`} />
              {Number(product.stockQty) > 0 ? `In stock · ${product.stockQty} available` : "Currently out of stock"}
            </span>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              min="1"
              max={product.stockQty || 1}
              className="form-control quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <button className="btn-primary-large" disabled={!product.stockQty} onClick={handleCart}>
              <i className="bi bi-bag-plus" /> Add to cart
            </button>
            <button className="btn-ghost-large" disabled={!product.stockQty} onClick={async () => { await handleCart(); if (isAuthenticated) window.location.assign("/checkout"); }}>
              Buy now <i className="bi bi-arrow-right" />
            </button>
          </div>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-lg-7">
          <div className="detail-section-heading"><span className="section-kicker">TECHNICAL DATA</span><h2>Specifications</h2></div>
          {specs.length ? (
            <div className="spec-table">
              {specs.map(([key, value]) => (
                <div className="spec-row" key={key}><span>{String(key).replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</span><strong>{typeof value === "object" ? JSON.stringify(value) : String(value)}</strong></div>
              ))}
            </div>
          ) : <div className="spec-empty">{product.specJson || "No specifications provided by the current product record."}</div>}

          <h2 className="h4 mt-5">Reviews</h2>
          {reviews.length === 0 && <div className="text-secondary">No reviews yet.</div>}
          {reviews.map((review) => (
            <div className="card border-0 shadow-sm mb-3" key={review.reviewId}>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <strong>{review.user?.name || "Customer"}</strong>
                  <span className="text-warning">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p className="mb-2 mt-2">{review.comment}</p>
                {user?.userId === review.user?.userId && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeReview(review.reviewId)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {isAuthenticated && (
            <form className="card border-0 shadow-sm mt-4" onSubmit={submitReview}>
              <div className="card-body">
                <h3 className="h5">Write a review</h3>
                <select className="form-select mb-3" value={rating} onChange={(e) => setRating(e.target.value)}>
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
                </select>
                <textarea
                  className="form-control mb-3"
                  rows="4"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                />
                <button className="btn btn-primary">Submit review</button>
              </div>
            </form>
          )}
        </div>
        <div className="col-lg-5">
          <h2 className="h4">Frequently bought together</h2>
          {recommendations.length ? <ProductGrid products={recommendations} /> : <div className="text-secondary">No recommendations yet.</div>}
          {isAuthenticated && (
            <Personalized userId={user.userId} />
          )}
        </div>
      </div>
    </div>
  );
}

function Personalized({ userId }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getPersonalized(userId).then((r) => setProducts(r.data)).catch(() => {});
  }, [userId]);

  if (!products.length) return null;
  return (
    <div className="mt-5">
      <h2 className="h4">Recommended for you</h2>
      <ProductGrid products={products} />
    </div>
  );
}