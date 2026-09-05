import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useApplications } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Activity, Clock, Eye } from "lucide-react";

const stageLabels = ["Applied", "Eligibility Screening", "Expert Evaluation", "Shortlisted", "Pilot"];
const stageColors = ["#94a3b8", "#d97706", "#7c3aed", "#3b82f6", "#16a34a"];

function ApplicationTimeline({ currentIndex }) {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", margin: "12px 0" }}>
      {stageLabels.map((label, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? stageColors[i] : active ? stageColors[i] : "var(--bg)",
                border: `2px solid ${done || active ? stageColors[i] : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? `0 0 0 3px ${stageColors[i]}33` : "none",
                flexShrink: 0,
              }}>
                {done ? <CheckCircle size={14} color="#fff" /> : active ? <Activity size={13} color="#fff" /> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />}
              </div>
              <span style={{ fontSize: "0.65rem", textAlign: "center", maxWidth: 70, color: done || active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: active ? 700 : 400, lineHeight: 1.3 }}>{label}</span>
            </div>
            {i < stageLabels.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? stageColors[i] : "var(--border)", marginBottom: 20, minWidth: 8 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function StartupApplicationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const applications = useApplications();

  // A brand-new account has no applications yet; established demo startups
  // see the seeded history too, so the page still has something to show.
  const allApps = applications.filter(a => a.startupName === user?.company);

  const stats = [
    { label: "Total Applied", val: allApps.length, color: "var(--accent)" },
    { label: "In Progress", val: allApps.filter(a => !["Pilot", "Completed"].includes(a.currentStage)).length, color: "var(--warning)" },
    { label: "Shortlisted", val: allApps.filter(a => a.status === "Shortlisted").length, color: "var(--success)" },
    { label: "Active Pilot", val: allApps.filter(a => a.currentStage === "Pilot").length, color: "var(--primary)" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header"><h2>My Applications</h2><p>Track your startup's applications across all government challenges.</p></div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {allApps.length === 0 && (
        <div className="card card-padded" style={{ textAlign: "center", padding: "48px 20px" }}>
          <h4 style={{ marginBottom: 8 }}>No applications yet</h4>
          <p className="text-secondary text-sm" style={{ marginBottom: 20 }}>Browse open challenges and apply to get started.</p>
          <button className="btn btn-primary" onClick={() => navigate("/startup/challenges")}>Discover Challenges</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {allApps.map(app => (
          <div key={app.id} className="card card-padded">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
              <div>
                <h4 style={{ fontSize: "1rem", marginBottom: 4 }}>{app.challengeTitle}</h4>
                <p className="text-sm text-secondary">{app.department} · Applied on {app.appliedDate}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, background: "#dcfce7", color: "var(--success)", padding: "2px 10px", borderRadius: 20 }}>{app.matchScore}% match</span>
                <button className="btn btn-secondary btn-sm" onClick={() => app.currentStage === "Pilot" ? navigate("/startup/pilots") : null}>
                  <Eye size={13} /> View Details
                </button>
              </div>
            </div>

            <ApplicationTimeline currentIndex={app.stageIndex} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div><span className="text-xs text-muted">Current Stage</span><p style={{ fontWeight: 600, fontSize: "0.875rem", marginTop: 2 }}>{app.currentStage}</p></div>
                <div><span className="text-xs text-muted">Last Updated</span><p style={{ fontWeight: 600, fontSize: "0.875rem", marginTop: 2 }}>{app.lastUpdate}</p></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <Clock size={13} />
                {app.status === "Active" ? "Pilot in progress" : app.status === "Shortlisted" ? "Evaluation completed" : "Processing"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
