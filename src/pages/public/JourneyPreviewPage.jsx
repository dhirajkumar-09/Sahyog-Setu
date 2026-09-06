import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Play, Pause, ArrowRight,
  FileText, Users, Star, Rocket, AlertTriangle, CreditCard,
  CheckCircle, TrendingUp, Globe,
} from "lucide-react";

const JOURNEY_STEPS = [
  {
    id: 1, emoji: "🏛️", role: "Government",
    roleColor: "#2563eb", roleBg: "#eff6ff", roleBorder: "#bfdbfe",
    title: "Government Creates Challenge", subtitle: "Problem-first innovation brief",
    description: "A government department defines a real-world problem — not a solution. They set KPIs, budget, pilot duration, and choose between Sandbox (low-risk testing) or Full Pilot mode. Two eligibility waivers let early-stage startups apply even without prior turnover or govt experience.",
    highlights: [
      { icon: "🧪", text: "Sandbox vs Full Pilot mode" },
      { icon: "⚡", text: "Waive turnover & govt-experience requirements" },
      { icon: "🔑", text: "IP ownership model defined upfront" },
      { icon: "🔒", text: "Cybersecurity checklist embedded" },
    ],
    demoRole: "government",
  },
  {
    id: 2, emoji: "📋", role: "Public",
    roleColor: "#7c3aed", roleBg: "#f5f3ff", roleBorder: "#c4b5fd",
    title: "Challenge Goes Live", subtitle: "Open to all eligible startups",
    description: "Published challenges appear on the public portal — no login required. Startups browse by sector, location and budget. Each challenge page shows KPIs, pilot scope, IP terms and eligibility criteria transparently.",
    highlights: [
      { icon: "🌐", text: "Public discovery portal" },
      { icon: "📊", text: "Full KPI & scope transparency" },
      { icon: "📍", text: "Searchable by state & sector" },
      { icon: "📅", text: "Real deadline countdown" },
    ],
    demoRole: null,
  },
  {
    id: 3, emoji: "🚀", role: "Startup",
    roleColor: "#16a34a", roleBg: "#f0fdf4", roleBorder: "#bbf7d0",
    title: "Startup Applies", subtitle: "One-click application with profile",
    description: "Registered startups apply with one click. Their pre-filled profile (DPIIT recognition, sector, team) is auto-attached. The system prevents duplicate applications and notifies government instantly. Application status is tracked in real-time.",
    highlights: [
      { icon: "✅", text: "Auto-filled company profile" },
      { icon: "🔔", text: "Instant govt notification" },
      { icon: "📈", text: "Live application status tracker" },
      { icon: "🛡️", text: "Duplicate prevention built-in" },
    ],
    demoRole: "startup",
  },
  {
    id: 4, emoji: "⭐", role: "Evaluator",
    roleColor: "#d97706", roleBg: "#fffbeb", roleBorder: "#fde68a",
    title: "Independent Expert Evaluation", subtitle: "Dual-evaluator scoring, bias-free",
    description: "Two independent domain experts each score applications on 5 weighted criteria: Innovation, Technical Feasibility, Cost Effectiveness, Scalability, and Team Capability. The final score is the average — no single-evaluator bias.",
    highlights: [
      { icon: "👥", text: "Dual evaluator anti-bias system" },
      { icon: "📊", text: "5 weighted KPI criteria" },
      { icon: "🤝", text: "Consensus shortlist mechanism" },
      { icon: "⚡", text: "Auto-advance on both submissions" },
    ],
    demoRole: "evaluator",
  },
  {
    id: 5, emoji: "🛸", role: "Government",
    roleColor: "#2563eb", roleBg: "#eff6ff", roleBorder: "#bfdbfe",
    title: "Pilot Approved & Launched", subtitle: "Sandbox or Full Pilot mode",
    description: "Government approves the shortlisted startup. A pilot contract is auto-generated with 7 milestones and a 4-part payment schedule. The pilot mode (Sandbox: isolated/simulated, or Full: live users + production data) is shown on the startup's dashboard.",
    highlights: [
      { icon: "🧪", text: "Sandbox = no live citizen data, faster" },
      { icon: "🚀", text: "Full Pilot = real users, full KPI tracking" },
      { icon: "📋", text: "7-milestone timeline auto-generated" },
      { icon: "💰", text: "4-part payment schedule created" },
    ],
    demoRole: "government",
  },
  {
    id: 6, emoji: "⚠️", role: "Both",
    roleColor: "#d97706", roleBg: "#fffbeb", roleBorder: "#fde68a",
    title: "Risk Register & Transparency", subtitle: "Shared visibility — no blind spots",
    description: "Government logs risks in real-time with likelihood and status lifecycle (Open → Mitigated → Closed). Startups see a read-only view of every risk flagged on their pilot — no more surprises. Closed risks are visually de-emphasised.",
    highlights: [
      { icon: "🔴", text: "Open risks flagged in real-time" },
      { icon: "🟡", text: "Mitigated — action taken, monitoring" },
      { icon: "🟢", text: "Closed — resolved, no action needed" },
      { icon: "👁️", text: "Startup gets read-only transparency view" },
    ],
    demoRole: "startup",
  },
  {
    id: 7, emoji: "💳", role: "Startup",
    roleColor: "#16a34a", roleBg: "#f0fdf4", roleBorder: "#bbf7d0",
    title: "Milestone-Based Payments", subtitle: "Transparent, verified disbursements",
    description: "Startup submits milestone completion for verification. Government reviews and approves. Payment is logged to a permanent history with reference numbers. Both sides see the full payment trail — 20%, 30%, 20%, 30% split.",
    highlights: [
      { icon: "📤", text: "Startup requests milestone payment" },
      { icon: "✅", text: "Govt verifies & approves" },
      { icon: "🧾", text: "Auto-generated payment reference" },
      { icon: "📊", text: "Full payment history for both parties" },
    ],
    demoRole: "startup",
  },
  {
    id: 8, emoji: "🔍", role: "Evaluator",
    roleColor: "#d97706", roleBg: "#fffbeb", roleBorder: "#fde68a",
    title: "Independent Validation", subtitle: "Third-party KPI verification",
    description: "An independent validator reviews actual KPI performance vs. declared targets and submits a validation report with an overall score. If ≥70% KPIs pass, status becomes 'Validated'. Both parties are notified of the outcome.",
    highlights: [
      { icon: "📏", text: "Live KPI actual vs target comparison" },
      { icon: "📝", text: "Validator submits independent report" },
      { icon: "✅", text: "≥70% pass = 'Validated' status" },
      { icon: "🔔", text: "Both parties notified of outcome" },
    ],
    demoRole: "evaluator",
  },
  {
    id: 9, emoji: "📈", role: "Government",
    roleColor: "#2563eb", roleBg: "#eff6ff", roleBorder: "#bfdbfe",
    title: "Scale-up Decision", subtitle: "Evidence-based procurement",
    description: "Government reviews the validation report and makes a final procurement decision: Scale-up (full rollout procurement begins), Request More Evidence, or No Scale-up. The startup is notified instantly — converting a successful pilot into a real government contract.",
    highlights: [
      { icon: "🎉", text: "Approved = procurement process begins" },
      { icon: "🔎", text: "More evidence = extended monitoring" },
      { icon: "📄", text: "Full audit trail preserved" },
      { icon: "🔗", text: "GEM / procurement integration ready" },
    ],
    demoRole: "government",
  },
];

const DEMO_CREDS = [
  { role: "Government", emoji: "🏛️", email: "r.singh@bihar.gov.in", pw: "gov@123", path: "/login/government", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { role: "Startup",    emoji: "🚀", email: "ankit@techvisionlabs.in", pw: "start@123", path: "/login/startup",    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { role: "Evaluator",  emoji: "⭐", email: "priya.nair@iitd.ac.in",   pw: "eval@123",  path: "/login/evaluator",  color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
];

const DEMO_LINKS = {
  government: "/login/government",
  startup:    "/login/startup",
  evaluator:  "/login/evaluator",
};

export default function JourneyPreviewPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setActiveStep((s) => {
        if (s >= JOURNEY_STEPS.length - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 3500);
    return () => clearInterval(t);
  }, [playing]);

  const step = JOURNEY_STEPS[activeStep];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f8faff 0%,#f0f9ff 50%,#fafaf0 100%)" }}>
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#2563eb,#7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "1rem" }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1e293b" }}>Sahyog-Setu</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>Journey Preview — SIH 2024 Demo</span>
          <Link to="/public-challenges" style={{ fontSize: "0.82rem", color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Browse Challenges →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "52px 24px 28px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 20, padding: "5px 16px", marginBottom: 20 }}>
          <Rocket size={14} color="#2563eb" />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb" }}>FULL PLATFORM JOURNEY · 9 STEPS</span>
        </div>
        <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900, color: "#1e293b", marginBottom: 14, lineHeight: 1.2 }}>
          From Problem to Scale-up —<br />
          <span style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Complete Sahyog-Setu Journey
          </span>
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Step-by-step walkthrough of how a government problem becomes a validated, funded startup pilot — and eventually a procured solution at scale.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => setPlaying(!playing)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: playing ? "#fee2e2" : "linear-gradient(135deg,#2563eb,#7c3aed)", color: playing ? "#dc2626" : "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
          >
            {playing ? <><Pause size={16} /> Pause Auto-play</> : <><Play size={16} /> Auto-play Tour</>}
          </button>
          <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Step {activeStep + 1} of {JOURNEY_STEPS.length}</span>
        </div>
      </div>

      {/* Step pills */}
      <div style={{ overflowX: "auto", padding: "0 16px 20px" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", minWidth: "max-content", margin: "0 auto" }}>
          {JOURNEY_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveStep(i); setPlaying(false); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: `2px solid ${i === activeStep ? s.roleColor : "#e2e8f0"}`, background: i === activeStep ? s.roleBg : "#fff", color: i === activeStep ? s.roleColor : "#64748b", fontWeight: i === activeStep ? 700 : 500, fontSize: "0.77rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
            >
              <span>{s.emoji}</span>
              <span>{s.title.split(" ").slice(0, 3).join(" ")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main step card */}
      <div style={{ maxWidth: 900, margin: "0 auto 32px", padding: "0 20px" }}>
        <div key={activeStep} style={{ background: "#fff", borderRadius: 20, border: `2px solid ${step.roleBorder}`, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", overflow: "hidden", animation: "fadeInUp 0.3s ease" }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg,${step.roleBg},#fff)`, padding: "28px 32px 20px", borderBottom: `1px solid ${step.roleBorder}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg,${step.roleColor}22,${step.roleColor}11)`, border: `2px solid ${step.roleBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "2rem" }}>
                {step.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 10px", borderRadius: 12, background: step.roleBg, color: step.roleColor, border: `1px solid ${step.roleBorder}`, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {step.role === "Both" ? "👥 Govt & Startup" : step.role === "Government" ? "🏛️ Government" : step.role === "Startup" ? "🚀 Startup" : step.role === "Evaluator" ? "⭐ Evaluator" : step.role}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>Step {activeStep + 1} / {JOURNEY_STEPS.length}</span>
                </div>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.4rem", fontWeight: 800, color: "#1e293b" }}>{step.title}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>{step.subtitle}</p>
              </div>
            </div>
          </div>
          {/* Body */}
          <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#475569", marginBottom: 24 }}>{step.description}</p>
              {step.demoRole && (
                <Link to={DEMO_LINKS[step.demoRole]} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: step.roleColor, color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", boxShadow: `0 4px 14px ${step.roleColor}44` }}>
                  Try as {step.role === "Both" ? "Startup" : step.role} <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div>
              <h4 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Key Features</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {step.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: step.roleBg, border: `1px solid ${step.roleBorder}`, borderRadius: 10 }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{h.icon}</span>
                    <span style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <button onClick={() => { setActiveStep(s => Math.max(0, s - 1)); setPlaying(false); }} disabled={activeStep === 0} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: activeStep === 0 ? "#f1f5f9" : "#fff", color: activeStep === 0 ? "#94a3b8" : "#1e293b", border: "2px solid #e2e8f0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", cursor: activeStep === 0 ? "not-allowed" : "pointer" }}>
            <ChevronLeft size={16} /> Previous
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {JOURNEY_STEPS.map((_, i) => (
              <button key={i} onClick={() => { setActiveStep(i); setPlaying(false); }} style={{ width: i === activeStep ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: i === activeStep ? step.roleColor : "#e2e8f0", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
          <button onClick={() => { setActiveStep(s => Math.min(JOURNEY_STEPS.length - 1, s + 1)); setPlaying(false); }} disabled={activeStep === JOURNEY_STEPS.length - 1} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: activeStep === JOURNEY_STEPS.length - 1 ? "#f1f5f9" : "linear-gradient(135deg,#2563eb,#7c3aed)", color: activeStep === JOURNEY_STEPS.length - 1 ? "#94a3b8" : "#fff", border: "2px solid transparent", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", cursor: activeStep === JOURNEY_STEPS.length - 1 ? "not-allowed" : "pointer" }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Demo credentials panel */}
      <div style={{ maxWidth: 900, margin: "0 auto 64px", padding: "0 20px" }}>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "28px 32px" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>🎯 Try it Live — Demo Credentials</h3>
          <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "#64748b" }}>Click any role to jump straight into that view and explore the full workflow interactively.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {DEMO_CREDS.map((r) => (
              <Link key={r.role} to={r.path} style={{ textDecoration: "none" }}>
                <div style={{ padding: "16px 18px", background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: 12, height: "100%", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: "1.4rem" }}>{r.emoji}</span>
                    <span style={{ fontWeight: 700, color: r.color, fontSize: "0.95rem" }}>{r.role}</span>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginBottom: 3 }}>📧 {r.email}</div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginBottom: 14 }}>🔑 {r.pw}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: r.color, color: "#fff", padding: "5px 12px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700 }}>
                    Login as {r.role} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
