import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getTrending, getCategories } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getCategoryImage } from "../utils/productImages";

const categoryIcons = ["bi-cpu", "bi-gpu-card", "bi-memory", "bi-device-ssd", "bi-pc-display", "bi-keyboard"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getTrending(), getCategories()])
      .then(([p, t, c]) => {
        setProducts(p.data || []);
        setTrending(t.data || []);
        setCategories(c.data || []);
      })
      .catch((e) => setError(e.response?.data?.message || "Unable to load store data."));
  }, []);

  const newArrivals = useMemo(() => products.slice(0, 8), [products]);
  const bestSellers = trending.length ? trending.slice(0, 8) : newArrivals;

  if (error) return <div className="container page-shell"><ErrorMessage message={error} /></div>;

  return (
    <div>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> PC HARDWARE · BUILT FOR PERFORMANCE</div>
            <h1>Build a PC you’ll be proud to <em>power on.</em></h1>
            <p>Shop processors, graphics cards, memory, storage and essential peripherals from one focused hardware store.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary-large">Explore hardware <i className="bi bi-arrow-up-right" /></Link>
              <Link to="/products" className="btn-ghost-large">Browse categories <i className="bi bi-grid-3x3-gap" /></Link>
            </div>
            <div className="hero-trust">
              <span><i className="bi bi-check2-circle" /> Clear stock status</span>
              <span><i className="bi bi-credit-card" /> eSewa Sandbox checkout</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-hardware-card">
              <div className="hardware-top"><span>CORE / 01</span><span><i className="bi bi-broadcast-pin" /> ONLINE</span></div>
              <div className="hardware-chip"><i className="bi bi-cpu" /></div>
              <div className="hardware-lines"><span /><span /><span /></div>
              <div className="hardware-bottom"><strong>PERFORMANCE</strong><span>COMPONENTS</span></div>
            </div>
            <div className="floating-spec spec-a"><span>GPU</span><strong>POWER</strong><small>READY</small></div>
            <div className="floating-spec spec-b"><span>BUILD</span><strong>SMART</strong><small>SELECT</small></div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div><span className="section-kicker">SHOP BY</span><h2>Popular categories</h2></div>
          <Link to="/products" className="section-link">All products <i className="bi bi-arrow-up-right" /></Link>
        </div>
        {categories.length ? (
          <div className="category-grid">
            {categories.slice(0, 8).map((category, index) => (
              <Link className="category-tile" key={category.categoryId} to={`/products?category=${category.categoryId}`}>
                <div className="category-image"><img src={getCategoryImage(category.name)} alt="" /></div>
                <div className="category-tile-content">
                  <span className="category-icon"><i className={`bi ${categoryIcons[index % categoryIcons.length]}`} /></span>
                  <span><strong>{category.name}</strong><small>Explore parts</small></span>
                  <i className="bi bi-arrow-up-right category-arrow" />
                </div>
              </Link>
            ))}
          </div>
        ) : <Loading text="Loading categories..." />}
      </section>

      <section className="section-band">
        <div className="container section-block">
          <div className="section-heading">
            <div><span className="section-kicker">TOP PICKS</span><h2>Best sellers</h2></div>
            <Link to="/products" className="section-link">Shop all <i className="bi bi-arrow-up-right" /></Link>
          </div>
          {bestSellers.length ? <ProductGrid products={bestSellers} /> : <Loading text="Loading products..." />}
        </div>
      </section>

      <section className="container section-block">
        <div className="promo-panel">
          <div>
            <span className="section-kicker">BUILD SMARTER</span>
            <h2>Every component has a job. Make every choice count.</h2>
            <p>Compare specifications, check stock and open the full product page before adding anything to your build.</p>
            <Link to="/products" className="btn-primary-large">Start shopping <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="promo-stat-grid">
            <div><strong>{products.length || "—"}</strong><span>listed products</span></div>
            <div><strong>{categories.length || "—"}</strong><span>hardware categories</span></div>
            <div><strong>eSewa</strong><span>Sandbox payments</span></div>
            <div><strong>24/7</strong><span>store access</span></div>
          </div>
        </div>
      </section>

      <section className="container section-block section-last">
        <div className="section-heading">
          <div><span className="section-kicker">JUST ADDED</span><h2>New arrivals</h2></div>
          <Link to="/products" className="section-link">View inventory <i className="bi bi-arrow-up-right" /></Link>
        </div>
        {newArrivals.length ? <ProductGrid products={newArrivals} /> : <Loading text="Loading inventory..." />}
      </section>
    </div>
  );
}
