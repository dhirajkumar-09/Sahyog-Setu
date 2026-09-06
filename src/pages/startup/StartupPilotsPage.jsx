import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { usePilots } from "../../lib/store";
import { CheckCircle, Activity, Circle, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { pilotKpiChartData } from "../../data/dummyData";

const milestoneIcon = (status) => {
  if (status === "completed") return <CheckCircle size={14} color="#fff" />;
  if (status === "active") return <Activity size={13} color="#fff" />;
  return <Circle size={12} color="var(--text-muted)" />;
};
const milestoneColors = { completed: "var(--success)", active: "var(--accent)", upcoming: "transparent" };
const milestoneBorder = { completed: "var(--success)", active: "var(--accent)", upcoming: "var(--border)" };

export default function StartupPilotsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const allPilots = usePilots();
  const myPilots = allPilots.filter(p => p.startupName === user?.company);
  const pilots = myPilots.length ? myPilots : allPilots.slice(0, 1);
  const [selectedId, setSelectedId] = useState(pilots[0]?.id);
  const pilot = pilots.find(p => p.id === selectedId) || pilots[0];

  if (!pilot) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>My Pilots</h2><p>You don't have any active pilots yet — get shortlisted in an evaluation to start one.</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header"><h2>My Pilots</h2><p>Monitor your active government pilots, milestones and KPI performance.</p></div>

      {pilots.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {pilots.map(p => (
            <button key={p.id} className={`btn btn-sm ${p.id === pilot.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setSelectedId(p.id)}>
              {p.title}
            </button>
          ))}
        </div>
      )}

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3>{pilot.title}</h3>
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
            </div>
            <p className="text-sm text-secondary">{pilot.department} · {pilot.location}</p>
            <p className="text-sm text-secondary" style={{ marginTop: 2 }}>Contract Value: <strong style={{ color: "var(--success)" }}>{pilot.contractValue}</strong></p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/startup/payments")}>View Payments</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/startup/validation")}>Validation <ArrowRight size={13} /></button>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700 }}>Pilot Progress</span>
            <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: "1.1rem" }}>Day {pilot.currentDay} / {pilot.totalDays}</span>
          </div>
          <div className="progress-bar-track" style={{ height: 14 }}>
            <div className="progress-bar-fill primary" style={{ width: `${pilot.progress}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <span>Started: {pilot.startDate}</span>
            <span style={{ fontWeight: 600, color: "var(--accent)" }}>{pilot.progress}% Complete</span>
            <span>Ends: {pilot.endDate}</span>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <h4 style={{ marginBottom: 16 }}>Milestones</h4>
            <div className="timeline">
              {pilot.milestones.map((m, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-line-wrapper">
                    <div className="timeline-dot" style={{ background: milestoneColors[m.status], borderColor: milestoneBorder[m.status], boxShadow: m.status === "active" ? "0 0 0 3px rgba(37,99,235,0.2)" : "none" }}>
                      {milestoneIcon(m.status)}
                    </div>
                    {i < pilot.milestones.length - 1 && (
                      <div className="timeline-connector" style={{ background: m.status === "completed" ? "var(--success)" : "var(--border)" }} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title" style={{ color: m.status === "upcoming" ? "var(--text-muted)" : "var(--text-primary)" }}>{m.name}</div>
                    {m.date && <div className="timeline-date">{m.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 16 }}>KPI Performance</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pilot.kpis.map((kpi) => {
                const pct = kpi.target ? (kpi.lowerIsBetter ? Math.min(100, (kpi.target / (kpi.actual || 1)) * 100) : Math.min(100, (kpi.actual / kpi.target) * 100)) : 0;
                return (
                  <div key={kpi.name} className="kpi-card">
                    <div className="kpi-header">
                      <span className="kpi-label">{kpi.name}</span>
                      <span className={kpi.passed ? "kpi-passed" : "kpi-failed"} style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                        {kpi.passed ? "✓ On Track" : "⚠ Below Target"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span className={`kpi-actual ${kpi.passed ? "kpi-passed" : "kpi-failed"}`}>{kpi.actual}{kpi.unit}</span>
                      <span className="kpi-target">/ {kpi.target}{kpi.unit} target</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className={`progress-bar-fill ${kpi.passed ? "success" : "warning"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card card-padded">
        <h3 style={{ marginBottom: 20 }}>KPI Trend — Last 6 Weeks</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={pilotKpiChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Accuracy %" />
            <Line type="monotone" dataKey="satisfaction" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Satisfaction %" />
            <Line type="monotone" dataKey="cost" stroke="#d97706" strokeWidth={2.5} dot={false} name="Cost Reduction %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
