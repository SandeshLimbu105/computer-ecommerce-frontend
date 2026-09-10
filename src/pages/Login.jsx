import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      const destination = location.state?.from?.pathname || (data.role === "ADMIN" ? "/admin" : "/");
      navigate(destination, { replace: true });
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card mx-auto card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold">Welcome back</h1>
          <p className="text-secondary">Sign in to continue.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <label className="form-label">Email</label>
            <input className="form-control mb-3" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="form-label">Password</label>
            <input className="form-control mb-4" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="text-center mt-4 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
