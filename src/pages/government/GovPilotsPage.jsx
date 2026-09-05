import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { usePilots, updateMilestoneStatus, updateKpiActual } from "../../lib/store";
import { Activity, CheckCircle, ArrowRight, Circle } from "lucide-react";

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

  const nextActiveIndex = pilot.milestones.findIndex(m => m.status === "active");

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
        </div>
      </div>
    </DashboardLayout>
  );
}
