import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEvaluations, approveForPilot, usePilots } from "../../lib/store";
import { ClipboardList, Eye, X, CheckCircle, Rocket } from "lucide-react";

function EvalModal({ ev, onClose, onApprove, alreadyPiloted }) {
  const totalMax = ev.criteria.reduce((s, c) => s + c.weight, 0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 720, boxShadow: "var(--shadow-xl)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ marginBottom: 2 }}>{ev.challengeTitle}</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Startup: {ev.startupName} · Evaluator: {ev.evaluatorName} · {ev.status === "Completed" ? "Evaluation completed" : "Pending evaluator action"}</p>
          </div>
          <button onClick={onClose} style={{ padding: 8, borderRadius: 8, color: "var(--text-muted)" }}><X size={20} /></button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {ev.status !== "Completed" && (
            <div style={{ padding: "12px 16px", background: "#fffbeb", borderRadius: "var(--radius-md)", border: "1px solid #fcd34d", marginBottom: 16, color: "#92400e", fontSize: "0.85rem" }}>
              This evaluation is still with {ev.evaluatorName} and hasn't been submitted yet.
            </div>
          )}

          {ev.criteria.map(c => {
            const val = c.score ?? 0;
            const pct = Math.round((val / c.weight) * 100);
            return (
              <div key={c.name} style={{ marginBottom: 14, padding: "14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>({c.weight}%)</span></div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.description}</div>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: ev.status === "Completed" ? "var(--success)" : "var(--text-muted)" }}>{c.score ?? "—"} / {c.weight}</div>
                </div>
                <div className="progress-bar-track">
                  <div className={`progress-bar-fill ${pct >= 80 ? "success" : "warning"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: (ev.totalScore || 0) >= 80 ? "#f0fdf4" : "#fffbeb", borderRadius: "var(--radius-md)", border: `1px solid ${(ev.totalScore || 0) >= 80 ? "#86efac" : "#fcd34d"}`, marginBottom: 16 }}>
            <span style={{ fontWeight: 700 }}>Total Score</span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: (ev.totalScore || 0) >= 80 ? "var(--success)" : "var(--warning)" }}>{ev.totalScore ?? "—"} / {totalMax}</div>
          </div>

          {ev.comments && (
            <div style={{ marginBottom: 12, fontSize: "0.85rem" }}>
              <strong>Evaluator Comments:</strong>
              <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{ev.comments}</p>
            </div>
          )}

          {ev.status === "Completed" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontWeight: 600, marginBottom: 16 }}>
              <CheckCircle size={18} /> Evaluation submitted · Recommendation: {ev.recommendation || "—"}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            {ev.status === "Completed" && ev.recommendation === "Shortlist" && !alreadyPiloted && (
              <button className="btn btn-primary" onClick={() => onApprove(ev)}>
                <Rocket size={14} /> Approve for Pilot
              </button>
            )}
            {alreadyPiloted && (
              <span className="badge badge-success" style={{ alignSelf: "center" }}>● Pilot already started</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GovEvaluationPage() {
  const navigate = useNavigate();
  const evaluations = useEvaluations();
  const pilots = usePilots();
  const [activeEval, setActiveEval] = useState(null);

  const completed = evaluations.filter(e => e.status === "Completed").length;
  const pending = evaluations.length - completed;

  const handleApprove = (ev) => {
    const result = approveForPilot(ev.id);
    setActiveEval(null);
    if (result.ok) navigate("/government/pilots");
  };

  return (
    <DashboardLayout>
      {activeEval && (
        <EvalModal
          ev={activeEval}
          onClose={() => setActiveEval(null)}
          onApprove={handleApprove}
          alreadyPiloted={pilots.some(p => String(p.applicationId) === String(activeEval.applicationId))}
        />
      )}

      <div className="page-header">
        <h2>Evaluation Overview</h2>
        <p>Track all expert evaluations across your challenges.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 24 }}>
        {[
          { label: "Total Evaluations", val: evaluations.length, color: "#d97706" },
          { label: "Evaluations Completed", val: completed, color: "#16a34a" },
          { label: "Pending Action", val: pending, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {evaluations.map(ev => (
          <div key={ev.id} className="card card-padded" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <ClipboardList size={18} color="var(--accent)" />
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>{ev.challengeTitle}</span>
                <span className={`badge ${ev.status === "Completed" ? "badge-success" : "badge-warning"}`}>● {ev.status}</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Startup: <strong>{ev.startupName}</strong> · Evaluator: {ev.evaluatorName} · Deadline: {ev.deadline}
              </div>
            </div>
            {ev.totalScore != null && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--success)" }}>{ev.totalScore}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/ 100</div>
              </div>
            )}
            <button
              className={`btn btn-sm ${ev.status === "Pending" ? "btn-secondary" : "btn-primary"}`}
              onClick={() => setActiveEval(ev)}
            >
              <Eye size={14} /> {ev.status === "Pending" ? "View Status" : "View Scorecard"}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
