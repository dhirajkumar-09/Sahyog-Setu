import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { useChallenges, addApplication, hasApplied } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Clock, DollarSign, Calendar, Users, ArrowLeft, CheckCircle, Target } from "lucide-react";

const statusColor = { Open: "badge-success", Pilot: "badge-primary", Screening: "badge-warning", Evaluation: "badge-purple", Completed: "badge-neutral" };

export default function ChallengeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const challenges = useChallenges();
  const challenge = challenges.find(c => c.id === parseInt(id));
  const [applied, setApplied] = useState(() => user?.role === "startup" && challenge && hasApplied(challenge.id, user.company));

  const handleApply = () => {
    if (!user || user.role !== "startup") {
      navigate("/login/startup");
      return;
    }
    if (!applied) {
      addApplication({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        department: challenge.department,
        startupName: user.company,
      });
      setApplied(true);
    }
    navigate("/startup/applications");
  };

  if (!challenge) return (
    <div>
      <PublicNavbar />
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Challenge not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</Link>
      </div>
    </div>
  );

  return (
    <div>
      <PublicNavbar />
      <div style={{ background: "var(--primary)", color: "#fff", padding: "40px 5% 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,0.65)", marginBottom: 16, padding: "6px 0" }}>
            <ArrowLeft size={16} /> Back to Challenges
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className={`badge ${statusColor[challenge.status] || "badge-neutral"}`} style={{ marginBottom: 12 }}>● {challenge.status}</span>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>{challenge.title}</h1>
              <p style={{ opacity: 0.75, fontSize: "1rem" }}>{challenge.department}</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleApply}>
              {applied ? "Already Applied — View Status" : "Apply for Pilot"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
            {[
              { icon: MapPin, val: challenge.location },
              { icon: DollarSign, val: challenge.budget },
              { icon: Clock, val: challenge.pilotDuration },
              { icon: Calendar, val: `Deadline: ${challenge.deadline}` },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", opacity: 0.85 }}>
                <m.icon size={16} />
                <span>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 5%", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Problem */}
          <div className="card card-padded">
            <h3 style={{ marginBottom: 14 }}>Problem Statement</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{challenge.description}</p>
          </div>

          {/* Expected Outcome */}
          <div className="card card-padded">
            <h3 style={{ marginBottom: 14 }}>Expected Outcome</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{challenge.expectedOutcome}</p>
          </div>

          {/* Eligibility */}
          <div className="card card-padded">
            <h3 style={{ marginBottom: 16 }}>Eligibility Criteria</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {challenge.eligibility.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle size={18} style={{ color: "var(--success)", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="card card-padded">
            <h3 style={{ marginBottom: 16 }}>Success KPIs</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {challenge.kpis.map((kpi, i) => (
                <div key={i} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>{kpi.name}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>{kpi.target}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{kpi.measurement}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pilot Info */}
          <div className="card card-padded">
            <h3 style={{ marginBottom: 16 }}>Pilot Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Pilot Duration", val: challenge.pilotDuration },
                { label: "Geography", val: challenge.pilotInfo.geography },
                { label: "Target Users", val: challenge.pilotInfo.targetUsers },
                { label: "Government Support", val: challenge.pilotInfo.governmentSupport },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>{m.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Expected Deliverables</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{challenge.pilotInfo.deliverables}</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded" style={{ background: "var(--primary)", color: "#fff" }}>
            <h4 style={{ marginBottom: 8 }}>Apply for this Challenge</h4>
            <p style={{ fontSize: "0.85rem", opacity: 0.75, marginBottom: 20, lineHeight: 1.6 }}>
              {applied
                ? "You've already applied to this challenge. Track its progress from your dashboard."
                : user?.role === "startup"
                ? "You're logged in as a startup — apply now to be considered for this pilot."
                : "Register or login as a startup to apply for this pilot opportunity."}
            </p>
            <button className="btn btn-primary btn-full" onClick={handleApply} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
              {applied ? "View Application Status" : "Apply for Pilot"}
            </button>
          </div>

          <div className="card card-padded">
            <h4 style={{ marginBottom: 16 }}>Quick Info</h4>
            {[
              { label: "Sector", val: challenge.sector },
              { label: "Budget", val: challenge.budget },
              { label: "Duration", val: challenge.pilotDuration },
              { label: "Location", val: challenge.location },
              { label: "Deadline", val: challenge.deadline },
              { label: "Applications", val: challenge.applications },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? "1px solid var(--border-light)" : "none" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>{m.label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
