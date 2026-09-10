import { Link } from "react-router-dom";
import { addToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const inStock = Number(product.stockQty) > 0;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      setMessage("Sign in to add this item to your cart.");
      return;
    }
    try {
      setAdding(true);
      await addToCart(user.userId, product.productId, 1);
      setMessage("Added to cart.");
      window.setTimeout(() => setMessage(""), 2500);
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="product-card h-100">
      <div className="product-card-media">
        <Link to={`/products/${product.productId}`} className="product-image-link">
          <ProductImage product={product} className="product-image" />
        </Link>
        <span className={`stock-pill ${inStock ? "stock-pill-in" : "stock-pill-out"}`}>
          <i className={`bi ${inStock ? "bi-check-circle" : "bi-x-circle"}`} />
          {inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand || "PC Hardware"}</span>
          {product.category?.name && <span className="product-category">{product.category.name}</span>}
        </div>
        <Link to={`/products/${product.productId}`} className="product-title">
          {product.name}
        </Link>
        <p className="product-spec-snippet">
          {product.description || "Performance-focused computer hardware for your next build."}
        </p>
        <div className="product-card-footer">
          <div>
            <div className="price-label">Price</div>
            <div className="product-price">Rs. {Number(product.price || 0).toLocaleString()}</div>
          </div>
          <div className="product-actions">
            <Link className="icon-action" to={`/products/${product.productId}`} title="View details" aria-label="View details">
              <i className="bi bi-arrow-up-right" />
            </Link>
            <button className="add-action" disabled={!inStock || adding} onClick={handleAdd}>
              <i className={`bi ${adding ? "bi-hourglass-split" : "bi-cart-plus"}`} />
              {adding ? "Adding" : "Add"}
            </button>
          </div>
        </div>
        {message && <div className="product-card-message">{message}</div>}
      </div>
    </article>
  );
}
