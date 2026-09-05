import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useChallenges } from "../../lib/store";
import { Search, ArrowRight } from "lucide-react";

const statusColor = { Open: "badge-success", Pilot: "badge-primary", Screening: "badge-warning", Evaluation: "badge-purple", Completed: "badge-neutral" };
const sectors = ["All", "Smart Cities", "Transportation", "Water & Sanitation", "Agriculture", "Healthcare"];

export default function StartupChallengesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const challenges = useChallenges();

  const filtered = challenges.filter(c =>
    (sector === "All" || c.sector === sector) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.department.toLowerCase().includes(search.toLowerCase()))
  );

  const matchScores = { 1: 78, 2: 92, 3: 94, 4: 83, 5: 88 };

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Discover Challenges</h2><p>Find government challenges that match your startup's capabilities.</p></div>

      <div className="card card-padded" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges..." className="form-input" style={{ paddingLeft: 38 }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sectors.map(s => (
              <button key={s} onClick={() => setSector(s)} className={`btn btn-sm ${sector === s ? "btn-primary" : "btn-secondary"}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 18 }}>
        {filtered.map(c => (
          <div key={c.id} className="challenge-card">
            <div className="challenge-card-top" style={{ background: c.color }} />
            <div className="challenge-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div className="challenge-card-title" style={{ flex: 1, marginRight: 8 }}>{c.title}</div>
                <span style={{ background: "#dcfce7", color: "var(--success)", borderRadius: 20, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                  {matchScores[c.id]}% match
                </span>
              </div>
              <div className="challenge-card-dept">{c.department}</div>
              <div className="challenge-card-meta">
                <div className="challenge-meta-item"><span className="challenge-meta-label">Location</span><span className="challenge-meta-value">{c.location}</span></div>
                <div className="challenge-meta-item"><span className="challenge-meta-label">Budget</span><span className="challenge-meta-value" style={{ color: "var(--success)" }}>{c.budget}</span></div>
                <div className="challenge-meta-item"><span className="challenge-meta-label">Pilot Duration</span><span className="challenge-meta-value">{c.pilotDuration}</span></div>
                <div className="challenge-meta-item"><span className="challenge-meta-label">Deadline</span><span className="challenge-meta-value">{c.deadline}</span></div>
              </div>
              <span className={`badge ${statusColor[c.status] || "badge-neutral"}`}>● {c.status}</span>
            </div>
            <div className="challenge-card-footer">
              <span className="text-sm text-secondary">{c.applications} applicants</span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/challenge/${c.id}`)}>View & Apply <ArrowRight size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
