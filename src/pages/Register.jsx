import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await register(form);
      setSuccess(data.message || "Registration successful.");
      setTimeout(() => navigate("/login"), 700);
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold">Create account</h1>
          <p className="text-secondary">Register as a customer.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={submit}>
            <label className="form-label">Name</label>
            <input className="form-control mb-3" name="name" required value={form.name} onChange={change} />
            <label className="form-label">Email</label>
            <input className="form-control mb-3" type="email" name="email" required value={form.email} onChange={change} />
            <label className="form-label">Password</label>
            <input className="form-control mb-3" type="password" name="password" minLength="6" required value={form.password} onChange={change} />
            <input type="hidden" name="role" value="CUSTOMER" />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="text-center mt-4 mb-0">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
