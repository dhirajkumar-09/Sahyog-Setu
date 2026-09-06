import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEvaluations, approveForPilot, usePilots, getAverageScore } from "../../lib/store";
import { ClipboardList, Eye, X, CheckCircle, Rocket, Users, Clock, BarChart2 } from "lucide-react";

function EvalDetailModal({ ev, onClose }) {
  const totalMax = ev.criteria.reduce((s, c) => s + c.weight, 0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 680, boxShadow: "var(--shadow-xl)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ marginBottom: 2 }}>{ev.challengeTitle}</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Startup: {ev.startupName} · Evaluator: <strong>{ev.evaluatorName}</strong>
              {ev.evaluatorSlot && (
                <span style={{ marginLeft: 8, background: "#eff6ff", color: "var(--accent)", borderRadius: 20, padding: "1px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                  Evaluator {ev.evaluatorSlot}
                </span>
              )}
              · {ev.status === "Completed" ? "Submitted" : "Pending"}
            </p>
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
            <span style={{ fontWeight: 700 }}>Total Score ({ev.evaluatorName})</span>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: (ev.totalScore || 0) >= 80 ? "var(--success)" : "var(--warning)" }}>{ev.totalScore ?? "—"} / {totalMax}</div>
          </div>

          {ev.comments && (
            <div style={{ marginBottom: 12, fontSize: "0.85rem" }}>
              <strong>Evaluator Comments:</strong>
              <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{ev.comments}</p>
            </div>
          )}

          {ev.status === "Completed" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontWeight: 600 }}>
              <CheckCircle size={18} /> Evaluation submitted · Recommendation: {ev.recommendation || "—"}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Groups evaluations by applicationId
function groupByApplication(evaluations) {
  const groups = {};
  evaluations.forEach(ev => {
    const key = String(ev.applicationId ?? ev.id);
    if (!groups[key]) groups[key] = [];
    groups[key].push(ev);
  });
  return Object.values(groups);
}

export default function GovEvaluationPage() {
  const navigate = useNavigate();
  const evaluations = useEvaluations();
  const pilots = usePilots();
  const [detailEval, setDetailEval] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const completed = evaluations.filter(e => e.status === "Completed").length;
  const pending = evaluations.length - completed;

  const groups = groupByApplication(evaluations);

  const handleApprove = (appId, primaryEvalId) => {
    setApprovingId(appId);
    const result = approveForPilot(primaryEvalId);
    setApprovingId(null);
    if (result.ok) navigate("/government/pilots");
  };

  return (
    <DashboardLayout>
      {detailEval && <EvalDetailModal ev={detailEval} onClose={() => setDetailEval(null)} />}

      <div className="page-header">
        <h2>Evaluation Overview</h2>
        <p>Track all expert evaluations across your challenges. Each application is reviewed by 2 independent evaluators.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        {[
          { label: "Application Groups", val: groups.length, color: "#d97706" },
          { label: "Total Evaluations", val: evaluations.length, color: "#3b82f6" },
          { label: "Evaluations Completed", val: completed, color: "#16a34a" },
          { label: "Pending Action", val: pending, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {groups.map((group) => {
          // All evaluations in this group share the same applicationId
          const primary = group[0];
          const appId = primary.applicationId;
          const allDone = group.every(e => e.status === "Completed");
          const doneCount = group.filter(e => e.status === "Completed").length;
          const avgScore = allDone
            ? Math.round(group.reduce((s, e) => s + (e.totalScore || 0), 0) / group.length)
            : null;
          const alreadyPiloted = pilots.some(p => String(p.applicationId) === String(appId));

          // Consensus recommendation
          const recCounts = group
            .filter(e => e.status === "Completed")
            .reduce((acc, e) => { acc[e.recommendation] = (acc[e.recommendation] || 0) + 1; return acc; }, {});
          const consensusRec = Object.entries(recCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

          return (
            <div key={String(appId ?? primary.id)} className="card card-padded">
              {/* Group header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <ClipboardList size={18} color="var(--accent)" />
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>{primary.challengeTitle}</span>
                    <span className={`badge ${allDone ? "badge-success" : doneCount > 0 ? "badge-warning" : "badge-neutral"}`}>
                      ● {allDone ? "All Done" : doneCount > 0 ? "Partial" : "Pending"}
                    </span>
                    {/* Multi-evaluator badge */}
                    <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 600 }}>
                      <Users size={11} /> {group.length} Evaluators
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Startup: <strong>{primary.startupName}</strong> · Deadline: {primary.deadline}
                  </div>
                </div>

                {/* Average score */}
                {avgScore != null ? (
                  <div style={{ textAlign: "center", padding: "10px 18px", background: avgScore >= 80 ? "#f0fdf4" : "#fffbeb", borderRadius: "var(--radius-lg)", border: `1px solid ${avgScore >= 80 ? "#86efac" : "#fcd34d"}` }}>
                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>
                      <BarChart2 size={10} style={{ marginRight: 3 }} />Avg Score
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: avgScore >= 80 ? "var(--success)" : "var(--warning)" }}>{avgScore}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/ 100</div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "10px 18px", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>Avg Score</div>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-muted)" }}>—</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>pending</div>
                  </div>
                )}
              </div>

              {/* Per-evaluator rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: allDone ? 16 : 0 }}>
                {group.map((ev, i) => (
                  <div key={ev.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)", gap: 12, flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: ev.status === "Completed" ? "var(--success)" : "var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {ev.status === "Completed"
                          ? <CheckCircle size={14} color="#fff" />
                          : <Clock size={13} color="var(--text-muted)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.87rem" }}>
                          Evaluator {ev.evaluatorSlot ?? i + 1}: {ev.evaluatorName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {ev.status === "Completed"
                            ? `Submitted ${ev.completedDate || ""} · ${ev.recommendation}`
                            : `Pending · Due ${ev.deadline}`}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {ev.totalScore != null && (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: ev.totalScore >= 80 ? "var(--success)" : "var(--warning)" }}>{ev.totalScore}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>/ 100</div>
                        </div>
                      )}
                      <button
                        className={`btn btn-sm ${ev.status === "Pending" ? "btn-secondary" : "btn-primary"}`}
                        onClick={() => setDetailEval(ev)}
                      >
                        <Eye size={13} /> {ev.status === "Pending" ? "Status" : "Scorecard"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Approve for Pilot — only when ALL evaluators done + consensus is Shortlist */}
              {allDone && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: avgScore >= 80 ? "#f0fdf4" : "#fffbeb", borderRadius: "var(--radius-md)", border: `1px solid ${avgScore >= 80 ? "#86efac" : "#fcd34d"}` }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Consensus: <span style={{ color: consensusRec === "Shortlist" ? "var(--success)" : "var(--danger)" }}>{consensusRec || "—"}</span>
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 12 }}>Average Score: {avgScore ?? "—"}/100</span>
                  </div>
                  {!alreadyPiloted && consensusRec === "Shortlist" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={approvingId === String(appId)}
                      onClick={() => handleApprove(appId, primary.id)}
                    >
                      <Rocket size={13} /> Approve for Pilot
                    </button>
                  ) : alreadyPiloted ? (
                    <span className="badge badge-success">● Pilot already started</span>
                  ) : null}
                </div>
              )}

              {!allDone && doneCount > 0 && (
                <div style={{ padding: "10px 14px", background: "#fffbeb", borderRadius: "var(--radius-md)", border: "1px solid #fcd34d", fontSize: "0.8rem", color: "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={13} /> {doneCount}/{group.length} evaluators completed. Waiting for remaining evaluator(s) before making pilot decision.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
