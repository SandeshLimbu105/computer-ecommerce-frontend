import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getProductsByCategory, getCategories, searchProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category");
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("featured");
  const [brand, setBrand] = useState("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      const query = params.get("keyword")?.trim() || "";
      if (query) response = await searchProducts(query);
      else if (categoryId) response = await getProductsByCategory(categoryId);
      else response = await getProducts();
      setProducts(response.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCategories().then((r) => setCategories(r.data || [])).catch(() => {}); }, []);
  useEffect(() => { load(); }, [categoryId, params.get("keyword")]);
  useEffect(() => { setKeyword(params.get("keyword") || ""); }, [params]);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products]);
  const filteredProducts = useMemo(() => {
    const next = products.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (stockOnly && Number(p.stockQty) <= 0) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });
    return next.sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "name") return String(a.name).localeCompare(String(b.name));
      return Number(b.stockQty > 0) - Number(a.stockQty > 0);
    });
  }, [products, brand, stockOnly, maxPrice, sort]);

  const submitSearch = (e) => {
    e.preventDefault();
    const next = {};
    if (keyword.trim()) next.keyword = keyword.trim();
    if (categoryId) next.category = categoryId;
    setParams(next);
  };

  const clearFilters = () => {
    setBrand("all"); setStockOnly(false); setMaxPrice(""); setSort("featured");
  };

  return (
    <div className="container page-shell">
      <div className="shop-header">
        <div>
          <span className="section-kicker">HARDWARE CATALOG</span>
          <h1>Find the right parts for your build.</h1>
          <p>Search the existing inventory by product or brand, then refine the results before you buy.</p>
        </div>
        <div className="catalog-count"><strong>{filteredProducts.length}</strong><span>results</span></div>
      </div>

      <div className="shop-toolbar">
        <form className="shop-search" onSubmit={submitSearch}>
          <i className="bi bi-search" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search CPUs, GPUs, RAM, SSDs..." />
          <button>Search</button>
        </form>
        <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      <div className="category-filter-row">
        <button className={`filter-chip ${!categoryId ? "active" : ""}`} onClick={() => setParams(keyword ? { keyword } : {})}>All</button>
        {categories.map((c) => (
          <button key={c.categoryId} className={`filter-chip ${String(categoryId) === String(c.categoryId) ? "active" : ""}`} onClick={() => setParams({ category: c.categoryId })}>{c.name}</button>
        ))}
      </div>

      <div className="shop-layout">
        <aside className="filter-panel">
          <div className="filter-panel-head"><strong>Refine</strong><button onClick={clearFilters}>Reset</button></div>
          <label>Brand</label>
          <select className="filter-control" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label>Maximum price</label>
          <input className="filter-control" type="number" min="0" placeholder="e.g. 100000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <label className="check-row"><input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} /><span>Only show in-stock items</span></label>
          <div className="filter-note"><i className="bi bi-info-circle" /><span>Specifications shown on product pages come directly from the current backend data.</span></div>
        </aside>
        <section className="catalog-results">
          {loading ? <Loading text="Loading products..." /> : error ? <ErrorMessage message={error} onRetry={load} /> : <ProductGrid products={filteredProducts} />}
        </section>
      </div>
    </div>
  );
}
