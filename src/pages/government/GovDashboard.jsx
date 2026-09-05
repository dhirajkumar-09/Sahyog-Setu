import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { pilotKpiChartData } from "../../data/dummyData";
import { useChallenges, useApplications, useEvaluations, usePilots, useValidations } from "../../lib/store";
import {
  ListChecks, Inbox, Star, Activity, CheckCircle, TrendingUp,
  PlusCircle, ArrowRight, Eye
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const statusBadge = (s) => {
  const map = { Open: "badge-success", Evaluation: "badge-purple", Pilot: "badge-primary", Screening: "badge-warning", Completed: "badge-neutral", Draft: "badge-neutral" };
  return <span className={`badge ${map[s] || "badge-neutral"}`}>● {s}</span>;
};

export default function GovDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const challenges = useChallenges();
  const applications = useApplications();
  const evaluations = useEvaluations();
  const pilots = usePilots();
  const validations = useValidations();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    { key: "activeChallenges", label: "Active Challenges", icon: ListChecks, color: "#3b82f6", bg: "#dbeafe", val: challenges.filter(c => c.status === "Open").length },
    { key: "applicationsReceived", label: "Applications Received", icon: Inbox, color: "#16a34a", bg: "#dcfce7", val: applications.length },
    { key: "underEvaluation", label: "Under Evaluation", icon: Star, color: "#d97706", bg: "#fef3c7", val: evaluations.filter(e => e.status === "Pending").length },
    { key: "runningPilots", label: "Running Pilots", icon: Activity, color: "#0891b2", bg: "#e0f2fe", val: pilots.filter(p => p.status === "Active").length },
    { key: "pendingValidation", label: "Pending Validation", icon: CheckCircle, color: "#7c3aed", bg: "#ede9fe", val: validations.filter(v => !v.procurementStatus).length },
    { key: "readyForScale", label: "Ready for Scale-up", icon: TrendingUp, color: "#16a34a", bg: "#dcfce7", val: validations.filter(v => v.status === "Validated" && !v.procurementStatus).length },
  ];

  const activePilot = pilots.find(p => p.status === "Active") || pilots[0];
  const recentChallenges = [...challenges].slice(0, 6);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2>{greeting}, {user?.name?.split(" ")[0] || "Officer"} 👋</h2>
          <p className="text-secondary" style={{ marginTop: 4 }}>Manage your innovation challenges, evaluate startups, track pilots and make procurement decisions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/government/create-challenge")}>
          <PlusCircle size={16} /> Create Challenge
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.bg }}>
                <Icon size={20} color={s.color} />
              </div>
              <div className="stat-card-value">{s.val}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header">
            <h3>Recent Challenges</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/government/challenges")}>View All <ArrowRight size={14} /></button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Challenge</th>
                    <th>Applications</th>
                    <th>Stage</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChallenges.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td>{c.applications}</td>
                      <td>{statusBadge(c.stage)}</td>
                      <td>{c.deadline}</td>
                      <td>{statusBadge(c.status)}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/challenge/${c.id}`)}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Active Pilot Performance</h3>
              <p className="text-sm text-secondary" style={{ marginTop: 3 }}>{activePilot ? `${activePilot.title} — ${activePilot.startupName}` : "No active pilots yet"}</p>
            </div>
            {activePilot && <span className="badge badge-success">● Active</span>}
          </div>
          <div className="card-body">
            {!activePilot && <p className="text-secondary text-sm">Approve a shortlisted evaluation to start your first pilot.</p>}
            {activePilot?.kpis.map((kpi) => {
              const pct = kpi.target ? (kpi.lowerIsBetter ? Math.min(100, (kpi.target / (kpi.actual || 1)) * 100) : Math.min(100, (kpi.actual / kpi.target) * 100)) : 0;
              return (
                <div key={kpi.name} className="progress-bar-wrapper" style={{ marginBottom: 16 }}>
                  <div className="progress-bar-label">
                    <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                    <span style={{ color: kpi.passed ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                      {kpi.actual}{kpi.unit} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/ Target {kpi.target}{kpi.unit}</span>
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${kpi.passed ? "success" : "warning"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>KPI Trend — Last 6 Weeks</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={pilotKpiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} dot={false} name="Accuracy %" />
                <Line type="monotone" dataKey="satisfaction" stroke="#16a34a" strokeWidth={2} dot={false} name="Satisfaction %" />
                <Line type="monotone" dataKey="cost" stroke="#d97706" strokeWidth={2} dot={false} name="Cost Red. %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
