import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth-scroll to section if on homepage, else navigate to homepage first
  const scrollTo = (id) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="public-nav">
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">SS</div>
        <span className="nav-logo-text">Sahyog-Setu</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/public-challenges" className="nav-link">Challenges</Link>
        <button onClick={() => scrollTo("how-it-works")} className="nav-link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}>How It Works</button>
        <button onClick={() => scrollTo("success-stories")} className="nav-link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}>Success Stories</button>
        <button onClick={() => scrollTo("resources")} className="nav-link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}>Resources</button>
      </div>

      <div className="nav-actions">
        {user ? (
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/${user.role}/dashboard`)}>
            Go to Dashboard
          </button>
        ) : (
          <>
            <Link to="/login/government" className="btn btn-secondary btn-sm">Government Login</Link>
            <Link to="/login/startup" className="btn btn-navy btn-sm">Startup Login</Link>
            <Link to="/login/startup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
