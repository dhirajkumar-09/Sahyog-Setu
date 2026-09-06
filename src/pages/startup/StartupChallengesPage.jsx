import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useChallenges } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { Search, ArrowRight, Star } from "lucide-react";

const statusColor = {
  Open: "badge-success",
  Pilot: "badge-primary",
  Screening: "badge-warning",
  Evaluation: "badge-purple",
  Completed: "badge-neutral",
};

const sectors = ["All", "Smart Cities", "Transportation", "Water & Sanitation", "Agriculture", "Healthcare"];

// ── Capability-matching: startup sector → relevant challenge sectors ──────────
const SECTOR_MATCH_MAP = {
  "AI/ML":        ["Transportation", "Smart Cities", "Agriculture", "Healthcare"],
  "CleanTech":    ["Smart Cities", "Water & Sanitation"],
  "Data Science": ["Healthcare", "Agriculture", "Smart Cities"],
  "Smart Cities": ["Smart Cities", "Transportation"],
  "AgriTech":     ["Agriculture"],
  "HealthTech":   ["Healthcare"],
  "IoT":          ["Smart Cities", "Water & Sanitation", "Agriculture"],
  "EdTech":       [],
  "FinTech":      [],
};

// Compute match score: sector match = +40, keyword match in eligibility = +10 each (max +60)
function computeMatchScore(challenge, userSector) {
  if (!userSector) return Math.floor(70 + Math.random() * 20);
  let score = 50;
  const matchedSectors = SECTOR_MATCH_MAP[userSector] || [];
  if (matchedSectors.includes(challenge.sector)) score += 40;
  // keyword match in eligibility array
  const keywordsForSector = {
    "AI/ML": ["ai", "ml", "machine learning", "data", "vision", "model"],
    "CleanTech": ["clean", "waste", "environment", "green", "iot"],
    "Data Science": ["data", "analytics", "dashboard", "insights"],
    "Smart Cities": ["smart", "iot", "city", "urban", "sensor"],
    "AgriTech": ["agri", "farm", "crop", "agriculture", "farmer"],
    "HealthTech": ["health", "medical", "clinical", "patient", "hl7", "fhir"],
    "IoT": ["iot", "sensor", "monitoring", "real-time", "network"],
  };
  const keywords = keywordsForSector[userSector] || [];
  const eligText = (challenge.eligibility || []).join(" ").toLowerCase();
  const descText = (challenge.description || "").toLowerCase();
  const combined = eligText + " " + descText;
  const hits = keywords.filter(kw => combined.includes(kw)).length;
  score += Math.min(10, hits * 5);
  return Math.min(99, score);
}

function isRecommended(challenge, userSector) {
  if (!userSector) return false;
  const matchedSectors = SECTOR_MATCH_MAP[userSector] || [];
  return matchedSectors.includes(challenge.sector);
}

export default function StartupChallengesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const challenges = useChallenges();

  const userSector = user?.sector || null;

  const filtered = challenges.filter(c =>
    (sector === "All" || c.sector === sector) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.department.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort: recommended challenges first
  const sorted = [...filtered].sort((a, b) => {
    const aRec = isRecommended(a, userSector) ? 1 : 0;
    const bRec = isRecommended(b, userSector) ? 1 : 0;
    return bRec - aRec;
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Discover Challenges</h2>
        <p>Find government challenges that match your startup's capabilities.
          {userSector && (
            <span style={{ marginLeft: 8, background: "#eff6ff", color: "var(--accent)", padding: "2px 10px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600 }}>
              Your sector: {userSector}
            </span>
          )}
        </p>
      </div>

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

      {userSector && sorted.some(c => isRecommended(c, userSector)) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 14px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: "var(--radius-md)" }}>
          <Star size={15} color="#d97706" fill="#d97706" />
          <span style={{ fontSize: "0.82rem", color: "#92400e", fontWeight: 600 }}>
            Challenges matching your sector ({userSector}) are shown first with the "Recommended" badge.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 18 }}>
        {sorted.map(c => {
          const recommended = isRecommended(c, userSector);
          const matchScore = computeMatchScore(c, userSector);
          return (
            <div key={c.id} className="challenge-card" style={recommended ? { border: "2px solid #fbbf24", boxShadow: "0 0 0 3px rgba(251,191,36,0.15)" } : {}}>
              <div className="challenge-card-top" style={{ background: c.color, position: "relative" }}>
                {recommended && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#fef3c7", color: "#92400e",
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: "0.72rem", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 4,
                    border: "1.5px solid #fcd34d",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  }}>
                    <Star size={11} fill="#d97706" color="#d97706" /> Recommended for you
                  </div>
                )}
              </div>
              <div className="challenge-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div className="challenge-card-title" style={{ flex: 1, marginRight: 8 }}>{c.title}</div>
                  <span style={{
                    background: matchScore >= 85 ? "#dcfce7" : matchScore >= 70 ? "#eff6ff" : "#f3f4f6",
                    color: matchScore >= 85 ? "var(--success)" : matchScore >= 70 ? "var(--accent)" : "var(--text-muted)",
                    borderRadius: 20, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {matchScore}% match
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
          );
        })}
      </div>
    </DashboardLayout>
  );
}
