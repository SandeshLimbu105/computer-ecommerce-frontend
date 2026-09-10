import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><i className="bi bi-box-seam" /></div>
        <h3>No products found</h3>
        <p>Try another search, category or filter.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard product={product} key={product.productId} />)}
    </div>
  );
}
