import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { useChallenges } from "../../lib/store";
import { Search, Filter, ArrowRight } from "lucide-react";

const statusColor = { Open: "badge-success", Pilot: "badge-primary", Screening: "badge-warning", Evaluation: "badge-purple", Completed: "badge-neutral" };
const sectors = ["All", "Smart Cities", "Transportation", "Water & Sanitation", "Agriculture", "Healthcare"];

export default function PublicChallengesPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const challenges = useChallenges();

  const filtered = challenges.filter(c =>
    (sector === "All" || c.sector === sector) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PublicNavbar />
      <div style={{ background: "var(--primary)", color: "#fff", padding: "48px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Active Government Challenges</h1>
          <p style={{ opacity: 0.75, marginBottom: 28 }}>Browse open innovation challenges from government departments across India.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges..." className="form-input" style={{ paddingLeft: 38, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5%" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setSector(s)} className={`btn btn-sm ${sector === s ? "btn-primary" : "btn-secondary"}`}>{s}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map(c => (
            <div key={c.id} className="challenge-card">
              <div className="challenge-card-top" style={{ background: c.color }} />
              <div className="challenge-card-body">
                <div className="challenge-card-title">{c.title}</div>
                <div className="challenge-card-dept">{c.department}</div>
                <div className="challenge-card-meta">
                  <div className="challenge-meta-item">
                    <span className="challenge-meta-label">Location</span>
                    <span className="challenge-meta-value">{c.location}</span>
                  </div>
                  <div className="challenge-meta-item">
                    <span className="challenge-meta-label">Budget</span>
                    <span className="challenge-meta-value" style={{ color: "var(--success)" }}>{c.budget}</span>
                  </div>
                  <div className="challenge-meta-item">
                    <span className="challenge-meta-label">Pilot Duration</span>
                    <span className="challenge-meta-value">{c.pilotDuration}</span>
                  </div>
                  <div className="challenge-meta-item">
                    <span className="challenge-meta-label">Deadline</span>
                    <span className="challenge-meta-value">{c.deadline}</span>
                  </div>
                </div>
                <span className={`badge ${statusColor[c.status] || "badge-neutral"}`}>● {c.status}</span>
              </div>
              <div className="challenge-card-footer">
                <span className="text-sm text-secondary">{c.applications} applications</span>
                <Link to={`/challenge/${c.id}`} className="btn btn-primary btn-sm">View Challenge <ArrowRight size={13} /></Link>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <p>No challenges found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
