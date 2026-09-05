import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEvaluations } from "../../lib/store";
import { CheckCircle, Eye } from "lucide-react";

export default function EvaluatorScorecardsPage() {
  const navigate = useNavigate();
  const evaluations = useEvaluations();
  const completed = evaluations.filter(e => e.status === "Completed");

  const avgScore = completed.length
    ? (completed.reduce((s, e) => s + (e.totalScore || 0), 0) / completed.length).toFixed(1)
    : "—";
  const shortlisted = completed.filter(e => e.recommendation === "Shortlist").length;

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Scorecards</h2><p>All completed evaluation scorecards submitted by you.</p></div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        {[
          { label: "Total Completed", val: completed.length, color: "var(--success)" },
          { label: "Average Score", val: avgScore, color: "var(--accent)" },
          { label: "Shortlisted", val: shortlisted, color: "var(--warning)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {completed.length === 0 && (
          <div className="card card-padded text-secondary">No completed scorecards yet — evaluations you submit will appear here.</div>
        )}
        {completed.map(ev => {
          const totalMax = ev.criteria.reduce((s, c) => s + c.weight, 0);
          return (
            <div key={ev.id} className="card card-padded">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <CheckCircle size={18} color="var(--success)" />
                    <h4>{ev.challengeTitle}</h4>
                    <span className="badge badge-success">● Submitted</span>
                  </div>
                  <p className="text-sm text-secondary">Startup: <strong>{ev.startupName}</strong> · Evaluated on {ev.completedDate}</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--success)" }}>{ev.totalScore}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>/ {totalMax}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/evaluator/evaluations/${ev.id}`)}>
                    <Eye size={14} /> View Full Scorecard
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ev.criteria.map(c => {
                  const pct = Math.round(((c.score || 0) / c.weight) * 100);
                  return (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Weight: {c.weight}%</div>
                      </div>
                      <div className="progress-bar-track" style={{ flex: 1 }}>
                        <div className={`progress-bar-fill ${pct >= 80 ? "success" : "warning"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div style={{ width: 56, textAlign: "right", fontWeight: 700, fontSize: "0.9rem", color: pct >= 80 ? "var(--success)" : "var(--warning)" }}>
                        {c.score || 0} / {c.weight}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-light)", display: "flex", gap: 12 }}>
                <div style={{ fontSize: "0.82rem" }}>
                  Recommendation: <span className="badge badge-success">{ev.recommendation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
