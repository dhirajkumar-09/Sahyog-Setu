import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { usePilots, updateMilestoneStatus, updateKpiActual, addPilotRisk, updatePilotRisk, removePilotRisk } from "../../lib/store";
import { Activity, CheckCircle, ArrowRight, Circle, AlertTriangle, Plus, Trash2, ChevronDown } from "lucide-react";

const LIKELIHOOD_STYLE = {
  Low:    { bg: "#dcfce7", color: "#16a34a", border: "#86efac", dot: "#16a34a" },
  Medium: { bg: "#fef3c7", color: "#d97706", border: "#fcd34d", dot: "#d97706" },
  High:   { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", dot: "#dc2626" },
};

function RiskRegister({ pilot }) {
  const risks = pilot.risks || [];
  const [newDesc, setNewDesc] = useState("");
  const [newLikelihood, setNewLikelihood] = useState("Medium");
  const [newOwner, setNewOwner] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newDesc.trim()) return;
    addPilotRisk(pilot.id, { description: newDesc.trim(), likelihood: newLikelihood, mitigationOwner: newOwner.trim() });
    setNewDesc("");
    setNewLikelihood("Medium");
    setNewOwner("");
    setAdding(false);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={17} color="#d97706" />
          <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
            Risk Register
            <span style={{ marginLeft: 10, fontSize: "0.75rem", background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 12, fontWeight: 700, border: "1px solid #fcd34d" }}>
              {risks.length} risks
            </span>
          </h4>
        </div>
        {!adding && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAdding(true)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={13} /> Add Risk
          </button>
        )}
      </div>

      {/* Existing Risks */}
      {risks.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: "0.85rem", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
          No risks logged yet. Click "Add Risk" to log the first one.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {risks.map((risk) => {
          const ls = LIKELIHOOD_STYLE[risk.likelihood] || LIKELIHOOD_STYLE.Medium;
          return (
            <div key={risk.id} style={{ padding: "14px 16px", background: "#fff", borderRadius: "var(--radius-md)", border: `1px solid ${ls.border}`, borderLeft: `4px solid ${ls.dot}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    rows={2}
                    value={risk.description}
                    onChange={e => updatePilotRisk(pilot.id, risk.id, { description: e.target.value })}
                    style={{
                      width: "100%", border: "none", background: "transparent", resize: "none",
                      fontFamily: "inherit", fontSize: "0.875rem", color: "var(--text-primary)",
                      lineHeight: 1.6, outline: "none", padding: 0,
                    }}
                    placeholder="Describe the risk..."
                  />
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                    {/* Likelihood dropdown */}
                    <div style={{ position: "relative" }}>
                      <select
                        value={risk.likelihood}
                        onChange={e => updatePilotRisk(pilot.id, risk.id, { likelihood: e.target.value })}
                        style={{
                          appearance: "none", padding: "3px 24px 3px 10px",
                          background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`,
                          borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                      <ChevronDown size={11} color={ls.color} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                    {/* Mitigation Owner */}
                    <input
                      value={risk.mitigationOwner}
                      onChange={e => updatePilotRisk(pilot.id, risk.id, { mitigationOwner: e.target.value })}
                      placeholder="Mitigation owner..."
                      style={{
                        flex: 1, minWidth: 160, border: "1px solid var(--border)", borderRadius: 6,
                        padding: "3px 10px", fontSize: "0.78rem", color: "var(--text-secondary)", background: "var(--surface-2)"
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removePilotRisk(pilot.id, risk.id)}
                  style={{ color: "var(--danger)", padding: 6, flexShrink: 0, borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca" }}
                  title="Delete risk"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Risk Form */}
        {adding && (
          <div style={{ padding: "16px", background: "#fffbeb", border: "1.5px dashed #fcd34d", borderRadius: "var(--radius-md)" }}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
                Risk Description *
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe the risk in detail..."
                className="form-input form-textarea"
                style={{ fontSize: "0.875rem" }}
                autoFocus
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
                  Likelihood
                </label>
                <select
                  className="form-input"
                  value={newLikelihood}
                  onChange={e => setNewLikelihood(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
                  Mitigation Owner
                </label>
                <input
                  className="form-input"
                  value={newOwner}
                  onChange={e => setNewOwner(e.target.value)}
                  placeholder="Name / team responsible"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={!newDesc.trim()}>
                <Plus size={13} /> Add Risk
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setAdding(false); setNewDesc(""); setNewOwner(""); setNewLikelihood("Medium"); }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GovPilotsPage() {
  const navigate = useNavigate();
  const pilots = usePilots();
  const [selectedId, setSelectedId] = useState(pilots[0]?.id);
  const pilot = pilots.find(p => p.id === selectedId) || pilots[0];

  const running = pilots.filter(p => p.status === "Active");
  const doneCount = pilots.filter(p => p.status === "Completed").length;
  const milestonesDue = pilots.reduce((n, p) => n + p.milestones.filter(m => m.status === "active").length, 0);
  const kpisOnTrack = pilots.reduce((n, p) => n + p.kpis.filter(k => k.passed).length, 0);

  if (!pilot) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Active Pilots</h2><p>No pilots yet — approve a shortlisted evaluation to start one.</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Active Pilots</h2>
        <p>Monitor all running pilot projects, KPIs and milestones.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {[
          { label: "Running Pilots", val: running.length, color: "#3b82f6" },
          { label: "Milestones Due", val: milestonesDue, color: "#d97706" },
          { label: "KPIs On Track", val: kpisOnTrack, color: "#16a34a" },
          { label: "Pilots Completed", val: doneCount, color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {pilots.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {pilots.map(p => (
            <button key={p.id} className={`btn btn-sm ${p.id === pilot.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setSelectedId(p.id)}>
              {p.title}
            </button>
          ))}
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <h3>{pilot.title}</h3>
            <p className="text-sm text-secondary" style={{ marginTop: 3 }}>{pilot.department} · {pilot.location} · {pilot.startupName}</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className={`badge ${pilot.status === "Completed" ? "badge-neutral" : "badge-success"}`}>● {pilot.status}</span>
            {pilot.pilotMode === "sandbox" ? (
              <span style={{ background: "#f5f3ff", color: "#7c3aed", border: "1.5px solid #c4b5fd", borderRadius: 20, padding: "2px 10px", fontSize: "0.73rem", fontWeight: 700 }}>
                🧪 Sandbox
              </span>
            ) : (
              <span style={{ background: "#eff6ff", color: "#2563eb", border: "1.5px solid #93c5fd", borderRadius: 20, padding: "2px 10px", fontSize: "0.73rem", fontWeight: 700 }}>
                🚀 Full Pilot
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/government/payments")}>Payments</button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/government/validation")}>
              View Validation <ArrowRight size={13} />
            </button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Pilot Progress</span>
              <span style={{ fontWeight: 700, color: "var(--accent)" }}>Day {pilot.currentDay} / {pilot.totalDays} — {pilot.progress}%</span>
            </div>
            <div className="progress-bar-track" style={{ height: 12 }}>
              <div className="progress-bar-fill primary" style={{ width: `${pilot.progress}%` }} />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <h4 style={{ marginBottom: 14, fontSize: "0.95rem" }}>KPI Performance <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "var(--text-muted)" }}>(update as field data comes in)</span></h4>
              {pilot.kpis.map((kpi, i) => {
                const pct = kpi.target ? Math.min(100, kpi.lowerIsBetter ? (kpi.target / (kpi.actual || 1)) * 100 : (kpi.actual / kpi.target) * 100) : 0;
                return (
                  <div key={kpi.name} className="progress-bar-wrapper" style={{ marginBottom: 14 }}>
                    <div className="progress-bar-label">
                      <span>{kpi.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number" value={kpi.actual}
                          onChange={e => updateKpiActual(pilot.id, i, e.target.value)}
                          style={{ width: 64, padding: "2px 6px", border: "1.5px solid var(--border)", borderRadius: 6, fontWeight: 700, fontSize: "0.85rem", textAlign: "center" }}
                        />
                        <span style={{ fontWeight: 700, color: kpi.passed ? "var(--success)" : "var(--danger)" }}>
                          {kpi.unit} / {kpi.target}{kpi.unit} {kpi.passed ? "✓" : "✗"}
                        </span>
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div className={`progress-bar-fill ${kpi.passed ? "success" : "warning"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <h4 style={{ marginBottom: 14, fontSize: "0.95rem" }}>Milestones</h4>
              <div className="timeline">
                {pilot.milestones.map((m, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-line-wrapper">
                      <div className={`timeline-dot ${m.status}`}>
                        {m.status === "completed" && <CheckCircle size={12} color="#fff" />}
                        {m.status === "active" && <Activity size={11} color="#fff" />}
                        {m.status === "upcoming" && <Circle size={10} color="var(--text-muted)" />}
                      </div>
                      {i < pilot.milestones.length - 1 && <div className={`timeline-connector ${m.status === "completed" ? "completed" : ""}`} />}
                    </div>
                    <div className="timeline-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div>
                        <div className="timeline-title">{m.name}</div>
                        {m.date && <div className="timeline-date">{m.date}</div>}
                      </div>
                      {m.status === "active" && (
                        <button className="btn btn-success btn-sm" onClick={() => updateMilestoneStatus(pilot.id, i, "completed")}>
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Risk Register (Feature 4) ── */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 4 }}>
            <RiskRegister pilot={pilot} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
