import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEvaluations } from "../../lib/store";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

export default function EvaluatorDashboard() {
  const navigate = useNavigate();
  const evaluations = useEvaluations();

  const pending = evaluations.filter(e => e.status === "Pending");
  const completed = evaluations.filter(e => e.status === "Completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, e) => s + (e.totalScore || 0), 0) / completed.length)
    : "—";

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h2>Expert Evaluation Panel 📋</h2>
        <p className="text-secondary" style={{ marginTop: 4 }}>Review assigned applications objectively and submit structured evaluation reports.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {[
          { label: "Assigned to You", val: evaluations.length, color: "var(--accent)", bg: "#dbeafe" },
          { label: "Pending Evaluation", val: pending.length, color: "var(--warning)", bg: "#fef3c7" },
          { label: "Completed", val: completed.length, color: "var(--success)", bg: "#dcfce7" },
          { label: "Avg. Score Given", val: avgScore, color: "var(--purple)", bg: "#ede9fe" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.bg }} />
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-heading"><h3>Assigned Evaluations</h3></div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {evaluations.length === 0 && (
          <div className="card card-padded text-secondary">No evaluations assigned yet.</div>
        )}
        {evaluations.map(ev => (
          <div key={ev.id} className="card card-padded" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: ev.status === "Pending" ? "#fef3c7" : "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {ev.status === "Pending" ? <ClipboardList size={20} color="var(--warning)" /> : <CheckCircle size={20} color="var(--success)" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 2 }}>{ev.challengeTitle}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Startup: <strong>{ev.startupName}</strong> · {ev.department}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <Clock size={12} /> Deadline: {ev.deadline}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {ev.totalScore != null && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success)" }}>{ev.totalScore}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>/ 100</div>
                </div>
              )}
              <span className={`badge ${ev.status === "Pending" ? "badge-warning" : "badge-success"}`}>● {ev.status}</span>
              <button
                className={`btn btn-sm ${ev.status === "Pending" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => navigate(`/evaluator/evaluations/${ev.id}`)}
              >
                {ev.status === "Pending" ? "Evaluate" : "View"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
