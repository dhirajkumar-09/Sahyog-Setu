import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { useChallenges, addApplication, hasApplied } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Clock, DollarSign, Calendar, ArrowLeft, CheckCircle, Shield, Lock } from "lucide-react";

const statusColor = { Open: "badge-success", Pilot: "badge-primary", Screening: "badge-warning", Evaluation: "badge-purple", Completed: "badge-neutral" };

const CYBER_ITEMS = [
  "End-to-end encryption (data in transit & at rest)",
  "ISO 27001 / equivalent information security certification",
  "CERT-In empanelled security audit",
  "Role-based access control (RBAC) + audit logging",
  "Incident response plan (24-hr notification SLA)",
  "Penetration testing (bi-annual minimum)",
];

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

  // Derived helpers for new fields
  const hasSecuritySection = challenge.ipOwnership || challenge.dataLocalization || challenge.waiveTurnoverRequirement ||
    (Array.isArray(challenge.cyberChecklist) && challenge.cyberChecklist.some(Boolean));
  const checkedCyberItems = Array.isArray(challenge.cyberChecklist)
    ? CYBER_ITEMS.filter((_, i) => challenge.cyberChecklist[i])
    : [];

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

          {/* Turnover waiver notice in hero */}
          {challenge.waiveTurnoverRequirement && (
            <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 24 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fbbf24" }}>⚡ Turnover Requirement Waived</span>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>— Early-stage startups can apply</span>
            </div>
          )}
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

          {/* ── Data, IP & Cybersecurity Section (Feature 1) ── */}
          {hasSecuritySection && (
            <div className="card card-padded" style={{ border: "1.5px solid #bfdbfe", background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={18} color="#fff" />
                </div>
                <h3 style={{ margin: 0, color: "#1e40af" }}>Data, IP & Cybersecurity Requirements</h3>
              </div>

              {/* Badges row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: checkedCyberItems.length > 0 ? 18 : 0 }}>
                {challenge.ipOwnership && challenge.ipOwnership !== "Not specified" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#dbeafe", color: "#1e40af", borderRadius: 24, fontWeight: 700, fontSize: "0.82rem", border: "1px solid #93c5fd" }}>
                    🔑 IP Ownership: {challenge.ipOwnership}
                  </span>
                )}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
                  background: challenge.dataLocalization ? "#dcfce7" : "#f1f5f9",
                  color: challenge.dataLocalization ? "#16a34a" : "var(--text-muted)",
                  borderRadius: 24, fontWeight: 600, fontSize: "0.82rem",
                  border: `1px solid ${challenge.dataLocalization ? "#86efac" : "#e2e8f0"}`
                }}>
                  🇮🇳 Data Localization: {challenge.dataLocalization ? "Required" : "Not required"}
                </span>
                {challenge.waiveTurnoverRequirement && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fef3c7", color: "#d97706", borderRadius: 24, fontWeight: 700, fontSize: "0.82rem", border: "1px solid #fcd34d" }}>
                    ⚡ Turnover Requirement Waived
                  </span>
                )}
                {checkedCyberItems.length > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#dcfce7", color: "#16a34a", borderRadius: 24, fontWeight: 700, fontSize: "0.82rem", border: "1px solid #86efac" }}>
                    🔒 {checkedCyberItems.length}/{CYBER_ITEMS.length} Cybersecurity Controls Required
                  </span>
                )}
              </div>

              {/* Individual cyber requirements */}
              {checkedCyberItems.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#3b82f6", fontWeight: 700, marginBottom: 10 }}>
                    Required Cybersecurity Controls
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {checkedCyberItems.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid #bfdbfe" }}>
                        <CheckCircle size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: "0.85rem", color: "#1e40af", fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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

            {/* Turnover waiver badge in sidebar (Feature 2) */}
            {challenge.waiveTurnoverRequirement && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={14} color="#d97706" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#92400e" }}>Turnover Requirement Waived</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#78350f", margin: "4px 0 0", lineHeight: 1.5 }}>
                  This challenge is open to early-stage startups without the standard turnover requirement. Apply even if you're pre-revenue.
                </p>
              </div>
            )}
          </div>

          {/* IP Ownership mini-card */}
          {challenge.ipOwnership && challenge.ipOwnership !== "Not specified" && (
            <div className="card card-padded" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Shield size={15} color="#2563eb" />
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1e40af" }}>IP Ownership Model</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#3b82f6", margin: 0, fontWeight: 600 }}>{challenge.ipOwnership}</p>
              <p style={{ fontSize: "0.75rem", color: "#60a5fa", margin: "4px 0 0", lineHeight: 1.5 }}>
                {challenge.ipOwnership === "Govt-owned" && "All intellectual property developed during the pilot will vest with the Government."}
                {challenge.ipOwnership === "Startup-owned" && "Startup retains IP; Government receives a perpetual, royalty-free license."}
                {challenge.ipOwnership === "Joint" && "IP is jointly owned with terms defined in the pilot contract."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
