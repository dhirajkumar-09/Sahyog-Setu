import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DEMO_CREDENTIALS } from "../../lib/store";
import { Rocket, Building2, UserCheck, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function StartupLoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register-tab fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDpiit, setRegDpiit] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, "startup");
    setLoading(false);
    if (result.ok) {
      navigate("/startup/dashboard");
    } else {
      setError(result.error);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = register({
      role: "startup",
      name: regName,
      email: regEmail,
      password: regPassword,
      company: regName,
      dpiit: regDpiit || "Not provided",
      sector: "Not specified",
    });
    setLoading(false);
    if (result.ok) {
      navigate("/startup/dashboard");
    } else {
      setError(result.error);
    }
  };

  const fillDemo = () => {
    setTab("login");
    setEmail(DEMO_CREDENTIALS.startup.email);
    setPassword(DEMO_CREDENTIALS.startup.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-left" style={{ background: "linear-gradient(135deg, #1a1f4e 0%, #1e3a5f 60%, #2563eb 100%)" }}>
        <div className="login-left-content">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff" }}>SS</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Sahyog-Setu</span>
          </Link>

          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Rocket size={28} color="#fff" />
            </div>
            <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>Startup Portal</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: "0.95rem" }}>Discover government challenges, apply for pilots, track progress and receive milestone payments.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Discover matching challenges",
              "Apply and track applications",
              "Run controlled government pilots",
              "Receive milestone payments",
              "Scale validated solutions",
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={16} color="rgba(255,255,255,0.6)" />
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, display: "flex", gap: 12 }}>
            {["DPIIT Recognised", "Startup India", "MeitY"].map(b => (
              <span key={b} style={{ padding: "4px 12px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Rocket size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 2 }}>Startup Portal</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Innovator Access</div>
            </div>
          </div>

          <div style={{ display: "flex", background: "var(--bg)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, padding: "8px", borderRadius: 7, fontWeight: 600, fontSize: "0.875rem", transition: "all 0.2s", background: tab === t ? "#fff" : "transparent", color: tab === t ? "var(--text-primary)" : "var(--text-muted)", boxShadow: tab === t ? "var(--shadow-sm)" : "none" }}>
                {t === "login" ? "Login" : "Register Startup"}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: "0.82rem", marginBottom: 16 }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          {tab === "login" ? (
            <>
              <h2 className="login-title">Welcome back, Innovator</h2>
              <p className="login-subtitle">Sign in to access your startup dashboard and active pilots.</p>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 40 }} required />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading ? "Signing in..." : "Login as Startup"}</button>
              </form>

              <button type="button" onClick={fillDemo} style={{ marginTop: 14, fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", width: "100%" }}>
                Use demo credentials: <strong>{DEMO_CREDENTIALS.startup.email}</strong>
              </button>
            </>
          ) : (
            <>
              <h2 className="login-title">Register Your Startup</h2>
              <p className="login-subtitle">Create an account to discover and apply for government challenges.</p>
              <form className="login-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Startup Name</label>
                  <input className="form-input" type="text" placeholder="e.g. TechVision Labs Pvt Ltd" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input className="form-input" type="email" placeholder="ceo@yourstartup.in" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">DPIIT Registration No. (optional)</label>
                  <input className="form-input" type="text" placeholder="DIPP12345" value={regDpiit} onChange={e => setRegDpiit(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="At least 6 characters" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading ? "Creating account..." : "Register & Continue"}</button>
              </form>
            </>
          )}

          <div className="login-divider" style={{ margin: "24px 0" }}>or continue as</div>
          <div className="login-role-links">
            <Link to="/login/government" className="login-role-link">
              <Building2 size={18} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Government Login</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Department officer portal</div>
              </div>
            </Link>
            <Link to="/login/evaluator" className="login-role-link">
              <UserCheck size={18} color="var(--purple)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Evaluator Login</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Expert evaluation panel</div>
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
