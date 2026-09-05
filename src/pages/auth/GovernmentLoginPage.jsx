import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DEMO_CREDENTIALS } from "../../lib/store";
import { Building2, Rocket, UserCheck, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function GovernmentLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password, "government");
    setLoading(false);
    if (result.ok) {
      navigate("/government/dashboard");
    } else {
      setError(result.error);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.government.email);
    setPassword(DEMO_CREDENTIALS.government.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff" }}>SS</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Sahyog-Setu</span>
          </Link>

          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Building2 size={28} color="#fff" />
            </div>
            <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>Government Portal</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: "0.95rem" }}>Manage innovation challenges, evaluate startups, track pilots and make evidence-based procurement decisions.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Publish innovation challenges",
              "Review startup applications",
              "Track pilot KPIs in real-time",
              "Validate and scale solutions",
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={16} color="rgba(255,255,255,0.6)" />
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: "16px", background: "rgba(255,255,255,0.06)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: 6 }}>
              <Shield size={13} /> Secure Government Access
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", lineHeight: 1.6 }}>Access restricted to verified government officials. All sessions are logged and audited.</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 2 }}>Government Login</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Department Officer Portal</div>
            </div>
          </div>

          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in with your official government credentials.</p>

          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: "0.82rem", marginBottom: 16 }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="officer@department.gov.in" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ paddingRight: 40 }} required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-navy btn-full btn-lg" disabled={loading}>{loading ? "Signing in..." : "Login as Government"}</button>
          </form>

          <button type="button" onClick={fillDemo} style={{ marginTop: 14, fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", width: "100%" }}>
            Use demo credentials: <strong>{DEMO_CREDENTIALS.government.email}</strong>
          </button>

          <div className="login-divider" style={{ margin: "24px 0" }}>or continue as</div>

          <div className="login-role-links">
            <Link to="/login/startup" className="login-role-link">
              <Rocket size={18} color="var(--accent)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Startup Login</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Access your startup dashboard</div>
              </div>
            </Link>
            <Link to="/login/evaluator" className="login-role-link">
              <UserCheck size={18} color="var(--purple)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Evaluator Login</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Access evaluation panel</div>
              </div>
            </Link>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 24 }}>
            <Link to="/" style={{ color: "var(--accent)" }}>← Back to Sahyog-Setu Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
