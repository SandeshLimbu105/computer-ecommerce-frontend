import { useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateAdminOrderStatus, updateProductStock } from "../api/adminApi";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, createCategory } from "../api/productApi";
import { getAnalytics } from "../api/analyticsApi";  // ✅ ADDED
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductImage from "../components/ProductImage";

const emptyProduct = {
  name: "", brand: "", description: "", imageUrl: "", specJson: "",
  price: "", stockQty: "", isActive: true
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);  // ✅ ADDED
  const [form, setForm] = useState(emptyProduct);
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [o, p, c] = await Promise.all([getAdminOrders(), getProducts(), getCategories()]);
      setOrders(o.data);
      setProducts(p.data);
      setCategories(c.data);
      // ✅ ADDED: Fetch analytics
      try {
        const a = await getAnalytics();
        setAnalytics(a.data);
      } catch (e) {
        console.warn("Analytics not available:", e.message);
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => ({
    products: products.length,
    orders: orders.length,
    pending: orders.filter((o) => o.status === "PENDING_PAYMENT").length
  }), [products, orders]);

  // ... (rest of your existing code: submitProduct, edit, remove, stock, changeOrderStatus)

  const submitProduct = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQty: Number(form.stockQty),
        isActive: Boolean(form.isActive)
      };
      if (editingId) await updateProduct(editingId, payload);
      else await createProduct(payload, Number(categoryId));
      setForm(emptyProduct);
      setCategoryId("");
      setEditingId(null);
      setStatus("Product saved.");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not save product.");
    }
  };

  const edit = (p) => {
    setEditingId(p.productId);
    setForm({
      name: p.name || "", brand: p.brand || "", description: p.description || "",
      imageUrl: p.imageUrl || "", specJson: p.specJson || "",
      price: p.price ?? "", stockQty: p.stockQty ?? "", isActive: p.isActive ?? true
    });
    setCategoryId(p.category?.categoryId || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete product.");
    }
  };

  const stock = async (id, value) => {
    try {
      await updateProductStock(id, Number(value));
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not update stock.");
    }
  };

  const changeOrderStatus = async (id, value) => {
    try {
      await updateAdminOrderStatus(id, value);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not update order.");
    }
  };

  if (loading) return <Loading text="Loading admin dashboard..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h2">Admin dashboard</h1><p className="text-secondary mb-0">Manage products, stock and orders.</p></div>
        <button className="btn btn-outline-primary" onClick={load}>Refresh</button>
      </div>
      {error && <ErrorMessage message={error} />}
      {status && <div className="alert alert-success">{status}</div>}

      {/* ✅ ADDED: Analytics Section */}
      {analytics && (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body">
            <h2 className="h4 mb-3">📊 E-commerce Analytics (Last 7 Days)</h2>
            
            {/* Stats Grid */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="bg-light p-3 rounded text-center">
                  <div className="h3 mb-0 text-primary">{analytics.totalPageViews || 0}</div>
                  <small className="text-secondary">Page Views</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light p-3 rounded text-center">
                  <div className="h3 mb-0 text-info">{analytics.totalProductViews || 0}</div>
                  <small className="text-secondary">Product Views</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light p-3 rounded text-center">
                  <div className="h3 mb-0 text-warning">{analytics.totalAddToCart || 0}</div>
                  <small className="text-secondary">Add to Cart</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light p-3 rounded text-center">
                  <div className="h3 mb-0 text-success">{analytics.totalPurchases || 0}</div>
                  <small className="text-secondary">Purchases</small>
                </div>
              </div>
            </div>

            {/* Top Products & Searches */}
            <div className="row g-4">
              {/* Top Products */}
              <div className="col-md-6">
                <h3 className="h6 text-secondary mb-3">Most Viewed Products</h3>
                {analytics.topProducts && analytics.topProducts.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {analytics.topProducts.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between px-0">
                        <span>Product ID: <strong>{item.productId}</strong></span>
                        <span className="badge bg-primary rounded-pill">{item.views} views</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-secondary small">No product view data yet.</p>
                )}
              </div>

              {/* Popular Searches */}
              <div className="col-md-6">
                <h3 className="h6 text-secondary mb-3">🔍 Popular Searches</h3>
                {analytics.popularSearches && analytics.popularSearches.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {analytics.popularSearches.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between px-0">
                        <span>"{item.keyword}"</span>
                        <span className="badge bg-success rounded-pill">{item.count} searches</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-secondary small">No search data yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3 mb-5">
        <Stat title="Products" value={counts.products} icon="bi-box" />
        <Stat title="Orders" value={counts.orders} icon="bi-receipt" />
        <Stat title="Pending payment" value={counts.pending} icon="bi-hourglass" />
      </div>

      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body">
          <h2 className="h4">{editingId ? "Edit product" : "Add product"}</h2>
          <form onSubmit={submitProduct} className="row g-3">
            <Field label="Name" value={form.name} onChange={(v) => setForm({...form, name:v})} required />
            <Field label="Brand" value={form.brand} onChange={(v) => setForm({...form, brand:v})} />
            <Field label="Price" type="number" value={form.price} onChange={(v) => setForm({...form, price:v})} required />
            <Field label="Stock" type="number" value={form.stockQty} onChange={(v) => setForm({...form, stockQty:v})} required />
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select className="form-select" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label">Product image URL</label>
              <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl:e.target.value})} placeholder="https://.../product-image.jpg" />
              <div className="form-text">Use a direct, stable product-image URL when you have one. If left empty, the storefront uses a category-appropriate hardware image.</div>
            </div>
            <div className="col-md-4">
              <div className="admin-image-preview">
                <ProductImage product={{ ...form, category: categories.find((c) => String(c.categoryId) === String(categoryId)) }} className="admin-preview-image" alt="Product preview" />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label">Specification JSON</label>
              <textarea className="form-control" rows="4" value={form.specJson} onChange={(e) => setForm({...form, specJson:e.target.value})} placeholder='{"socket":"AM5","cores":8}' />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive:e.target.checked})} id="active" />
                <label className="form-check-label" htmlFor="active">Active product</label>
              </div>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary">{editingId ? "Update product" : "Create product"}</button>
              {editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => {setEditingId(null); setForm(emptyProduct); setCategoryId("");}}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <section className="mb-5">
        <h2 className="h4 mb-3">Products</h2>
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.productId}>
                  <td><div className="admin-product-cell"><ProductImage product={p} className="admin-thumb" alt="" /><div><strong>{p.name}</strong><div className="small text-secondary">{p.brand}</div></div></div></td>
                  <td>{p.category?.name || "—"}</td>
                  <td>Rs. {Number(p.price).toLocaleString()}</td>
                  <td>
                    <input className="form-control form-control-sm stock-input" type="number" min="0" defaultValue={p.stockQty} onBlur={(e) => stock(p.productId, e.target.value)} />
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.productId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="h4 mb-3">Orders</h2>
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Change</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>{o.user?.name}<div className="small text-secondary">{o.user?.email}</div></td>
                  <td>Rs. {Number(o.totalAmount).toLocaleString()}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <select className="form-select form-select-sm" value={o.status} onChange={(e) => changeOrderStatus(o.orderId, e.target.value)}>
                      {["PENDING_PAYMENT","CONFIRMED","SHIPPED","DELIVERED","CANCELLED","FAILED"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="col-md-4">
      <div className="card border-0 shadow-sm"><div className="card-body d-flex justify-content-between align-items-center">
        <div><div className="text-secondary">{title}</div><div className="display-6 fw-bold">{value}</div></div>
        <i className={`bi ${icon} fs-1 text-primary`} />
      </div></div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div className="col-md-4">
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}