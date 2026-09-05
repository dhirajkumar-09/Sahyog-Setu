import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useChallenges } from "../../lib/store";
import { PlusCircle, Eye, Search } from "lucide-react";

const statusBadge = (s) => {
  const map = { Open: "badge-success", Evaluation: "badge-purple", Pilot: "badge-primary", Screening: "badge-warning", Completed: "badge-neutral", Draft: "badge-neutral" };
  return <span className={`badge ${map[s] || "badge-neutral"}`}>● {s}</span>;
};

export default function GovChallengesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const challenges = useChallenges();
  const filtered = challenges.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2>Challenges</h2>
          <p>Manage all your published and draft innovation challenges.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/government/create-challenge")}>
          <PlusCircle size={16} /> Create Challenge
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ paddingBottom: 16 }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges..." className="form-input" style={{ paddingLeft: 38 }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Department</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Applications</th>
                <th>Stage</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>{c.title}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: 180 }}>{c.department}</td>
                  <td>{c.location}</td>
                  <td style={{ fontWeight: 600, color: "var(--success)" }}>{c.budget}</td>
                  <td>{c.applications}</td>
                  <td>{statusBadge(c.stage)}</td>
                  <td style={{ fontSize: "0.82rem" }}>{c.deadline}</td>
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
    </DashboardLayout>
  );
}
