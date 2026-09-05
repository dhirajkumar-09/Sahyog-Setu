import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useChallenges, useApplications, usePilots, usePayments, fmtINR } from "../../lib/store";
import { Inbox, Activity, CreditCard, CheckCircle, TrendingUp, Zap, ArrowRight } from "lucide-react";

export default function StartupDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const challenges = useChallenges();
  const applications = useApplications();
  const pilots = usePilots();
  const payments = usePayments();

  const myApplications = applications.filter(a => a.startupName === user?.company);
  const myPilots = pilots.filter(p => p.startupName === user?.company);
  const myPayments = payments.filter(p => p.startupName === user?.company);

  const pendingPaymentsNum = myPayments.reduce((sum, p) =>
    sum + p.milestones.filter(m => m.status !== "Paid").reduce((a, m) => a + m.amountNum, 0), 0);
  const totalPilotValueNum = myPilots.reduce((sum, p) => sum + (p.contractValueNum || 0), 0);

  const statCards = [
    { key: "applicationsSubmitted", label: "Applications Submitted", icon: Inbox, color: "#3b82f6", bg: "#dbeafe", val: myApplications.length },
    { key: "shortlisted", label: "Shortlisted", icon: CheckCircle, color: "#16a34a", bg: "#dcfce7", val: myApplications.filter(a => a.status === "Shortlisted" || a.currentStage === "Shortlisted" || a.currentStage === "Pilot").length },
    { key: "activePilots", label: "Active Pilots", icon: Activity, color: "#0891b2", bg: "#e0f2fe", val: myPilots.filter(p => p.status === "Active").length },
    { key: "completedPilots", label: "Completed Pilots", icon: TrendingUp, color: "#7c3aed", bg: "#ede9fe", val: myPilots.filter(p => p.status === "Completed").length },
    { key: "pendingPayments", label: "Pending Payments", icon: CreditCard, color: "#d97706", bg: "#fef3c7", val: fmtINR(pendingPaymentsNum) },
    { key: "totalPilotValue", label: "Total Pilot Value", icon: Zap, color: "#16a34a", bg: "#dcfce7", val: fmtINR(totalPilotValueNum) },
  ];

  const appliedIds = new Set(myApplications.map(a => a.challengeId));
  const recommended = challenges.filter(c => c.status === "Open" && !appliedIds.has(c.id)).slice(0, 3);
  const activePilot = myPilots.find(p => p.status === "Active");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2>Welcome back, {user?.name?.split(" ")[0] || "Innovator"} 🚀</h2>
          <p className="text-secondary" style={{ marginTop: 4 }}>Discover government problems where your startup can create measurable impact.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/startup/challenges")}>
          Discover Challenges <ArrowRight size={16} />
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

      <div className="section-heading" style={{ marginBottom: 16 }}>
        <div>
          <h3>Recommended Challenges</h3>
          <p className="text-sm text-secondary">Based on your profile — {user?.company} ({user?.sector})</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/startup/challenges")}>View All</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18, marginBottom: 28 }}>
        {recommended.length === 0 && (
          <div className="card card-padded text-secondary">You've applied to all open challenges — check back soon for new ones.</div>
        )}
        {recommended.map(c => (
          <div key={c.id} className="challenge-card">
            <div className="challenge-card-top" style={{ background: c.color }} />
            <div className="challenge-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div className="challenge-card-title" style={{ flex: 1, marginRight: 8 }}>{c.title}</div>
              </div>
              <div className="challenge-card-dept">{c.department}</div>
              <div className="challenge-card-meta">
                <div className="challenge-meta-item"><span className="challenge-meta-label">Budget</span><span className="challenge-meta-value" style={{ color: "var(--success)" }}>{c.budget}</span></div>
                <div className="challenge-meta-item"><span className="challenge-meta-label">Pilot</span><span className="challenge-meta-value">{c.pilotDuration}</span></div>
                <div className="challenge-meta-item" style={{ gridColumn: "1 / -1" }}><span className="challenge-meta-label">Deadline</span><span className="challenge-meta-value">{c.deadline}</span></div>
              </div>
            </div>
            <div className="challenge-card-footer">
              <span className="badge badge-success">● Open</span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/challenge/${c.id}`)}>View & Apply <ArrowRight size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {activePilot && (
        <div className="card card-padded" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: 4 }}>ACTIVE PILOT</div>
              <h3 style={{ color: "#fff", marginBottom: 4 }}>{activePilot.title}</h3>
              <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>{activePilot.department} · Day {activePilot.currentDay} of {activePilot.totalDays} · {activePilot.progress}% complete</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }} onClick={() => navigate("/startup/pilots")}>
                View Pilot Dashboard
              </button>
              <button className="btn btn-sm" style={{ background: "#fff", color: "var(--primary)", fontWeight: 700 }} onClick={() => navigate("/startup/payments")}>
                View Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
