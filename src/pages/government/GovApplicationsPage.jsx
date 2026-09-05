import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useApplications, advanceApplicationStage } from "../../lib/store";
import { Eye, Send, X } from "lucide-react";

const stageBadge = (s) => {
  const map = { Applied: "badge-neutral", "Eligibility Screening": "badge-warning", "Expert Evaluation": "badge-purple", Shortlisted: "badge-primary", Pilot: "badge-success", Active: "badge-success", Screening: "badge-warning", Waitlisted: "badge-warning", "Not Selected": "badge-danger" };
  return <span className={`badge ${map[s] || "badge-neutral"}`}>● {s}</span>;
};

const demoApps = [
  { id: 1, challenge: "Smart Waste Management", dept: "Urban Development Dept.", startup: "GreenSolve Technologies", applied: "2024-07-20", stage: "Eligibility Screening", score: null, status: "Screening" },
  { id: 2, challenge: "AI Traffic Management", dept: "Transport Department", startup: "TechVision Labs", applied: "2024-08-15", stage: "Expert Evaluation", score: 87, status: "Shortlisted" },
  { id: 3, challenge: "Smart Water Monitoring", dept: "Rural Development Dept.", startup: "TechVision Labs", applied: "2024-08-01", stage: "Pilot", score: 92, status: "Pilot" },
  { id: 4, challenge: "Crop Disease Detection", dept: "Agriculture Department", startup: "AgroTech Innovations", applied: "2024-08-22", stage: "Eligibility Screening", score: null, status: "Screening" },
  { id: 5, challenge: "Digital Health Records", dept: "Health Department", startup: "DataBridge Analytics", applied: "2024-09-01", stage: "Applied", score: null, status: "Applied" },
  { id: 6, challenge: "AI Traffic Management", dept: "Transport Department", startup: "UrbanFlow Systems", applied: "2024-08-16", stage: "Expert Evaluation", score: 78, status: "Screening" },
];

function DetailModal({ app, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: "var(--radius-xl)" }}>
        <div className="card-header">
          <h3>{app.challenge}</h3>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.9rem" }}>
          <div><strong>Startup:</strong> {app.startup}</div>
          <div><strong>Department:</strong> {app.dept}</div>
          <div><strong>Applied:</strong> {app.applied}</div>
          <div><strong>Current Stage:</strong> {stageBadge(app.stage)}</div>
          <div><strong>Status:</strong> {stageBadge(app.status)}</div>
          {app.score && <div><strong>Evaluation Score:</strong> {app.score}/100</div>}
        </div>
      </div>
    </div>
  );
}

export default function GovApplicationsPage() {
  const liveApplications = useApplications();
  const [viewing, setViewing] = useState(null);

  const realRows = liveApplications
    .filter(a => !demoApps.some(d => d.challenge === a.challengeTitle && d.startup === a.startupName))
    .map(a => ({
      id: a.id,
      isLive: true,
      challenge: a.challengeTitle,
      dept: a.department,
      startup: a.startupName,
      applied: a.appliedDate,
      stage: a.currentStage,
      score: null,
      status: a.status,
    }));

  const allRows = [...realRows, ...demoApps];
  const totalCount = 110 + realRows.length;

  const handleAdvance = (row) => {
    advanceApplicationStage(row.id, "Expert Evaluation", "Screening");
  };

  return (
    <DashboardLayout>
      {viewing && <DetailModal app={viewing} onClose={() => setViewing(null)} />}

      <div className="page-header">
        <h2>Applications Received</h2>
        <p>All startup applications across your active challenges.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        {[
          { label: "Total Applications", val: totalCount, color: "#3b82f6", bg: "#dbeafe" },
          { label: "Under Screening", val: 42 + realRows.filter(r => r.status === "Applied" || r.stage === "Applied").length, color: "#d97706", bg: "#fef3c7" },
          { label: "In Evaluation", val: 28, color: "#7c3aed", bg: "#ede9fe" },
          { label: "Shortlisted", val: 18 + realRows.filter(r => r.status === "Shortlisted").length, color: "#16a34a", bg: "#dcfce7" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3>All Applications</h3></div>
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Department</th>
                <th>Startup</th>
                <th>Applied Date</th>
                <th>Current Stage</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.challenge}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{a.dept}</td>
                  <td>{a.startup}</td>
                  <td style={{ fontSize: "0.82rem" }}>{a.applied}</td>
                  <td>{stageBadge(a.stage)}</td>
                  <td style={{ fontWeight: 700, color: a.score ? "var(--success)" : "var(--text-muted)" }}>{a.score ? `${a.score}/100` : "—"}</td>
                  <td>{stageBadge(a.status)}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setViewing(a)}><Eye size={14} /> View</button>
                    {a.isLive && (a.stage === "Applied" || a.stage === "Eligibility Screening") && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAdvance(a)}><Send size={14} /> Send to Evaluation</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
