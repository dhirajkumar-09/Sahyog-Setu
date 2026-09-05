import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { challenges, platformStats, successStories } from "../../data/dummyData";
import {
  ArrowRight, CheckCircle, Target, Zap, Shield, TrendingUp,
  BarChart2, Users, Activity, Globe, FileText
} from "lucide-react";

const statusColor = { Open: "badge-success", Pilot: "badge-primary", Screening: "badge-warning", Evaluation: "badge-purple", Completed: "badge-neutral" };
const sectorColors = { "Smart Cities": "#3b82f6", Transportation: "#8b5cf6", "Water & Sanitation": "#06b6d4", Agriculture: "#16a34a", Healthcare: "#dc2626" };

const workflowSteps = ["Problem", "Discovery", "Evaluation", "Pilot", "Validation", "Scale"];

const howSteps = [
  { num: "01", icon: Target, color: "#3b82f6", bg: "#dbeafe", title: "Problem Identification", desc: "Government departments define real-world problems with clear, measurable outcome targets that are technology-neutral." },
  { num: "02", icon: Users, color: "#16a34a", bg: "#dcfce7", title: "Startup Discovery", desc: "Verified Indian startups browse and discover challenges that match their capabilities through an open, transparent portal." },
  { num: "03", icon: Shield, color: "#d97706", bg: "#fef3c7", title: "Eligibility Screening", desc: "Startups are objectively screened against defined criteria covering technical capability, legal standing and team readiness." },
  { num: "04", icon: Star2, color: "#7c3aed", bg: "#ede9fe", title: "Expert Evaluation", desc: "Independent domain experts score applications on innovation, feasibility, cost-effectiveness, scalability and team capability." },
  { num: "05", icon: Activity, color: "#0891b2", bg: "#e0f2fe", title: "Controlled Pilot", desc: "Selected startups run a time-bound, KPI-defined pilot in a real government environment with milestone-based payments." },
  { num: "06", icon: TrendingUp, color: "#16a34a", bg: "#dcfce7", title: "Validation & Scale-up", desc: "Independent validators verify pilot KPIs and make evidence-based scale-up recommendations for government procurement." },
];

function Star2({ size, color }) {
  return <BarChart2 size={size} color={color} />;
}

export default function HomePage() {
  const navigate = useNavigate();
  const featured = challenges.slice(0, 3);

  return (
    <div>
      <PublicNavbar />

      {/* Hero */}
      <section className="hero-section">
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <div className="hero-badge">
            <Zap size={12} />
            Government × Startup Innovation Platform
          </div>
          <h1 className="hero-title">From Government Problems<br />to Scaled Innovation.</h1>
          <p className="hero-subtitle">
            Sahyog-Setu connects government departments with innovative startups through a transparent, competitive and compliant journey — from problem identification to pilot, validation and procurement.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/public-challenges")}>
              Explore Challenges <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate("/login/government")}>
              For Government
            </button>
          </div>

          <div className="hero-workflow">
            {workflowSteps.map((step, i) => (
              <React.Fragment key={step}>
                <div className="workflow-step">
                  <div className="workflow-step-num">{i + 1}</div>
                  <span className="workflow-step-label">{step}</span>
                </div>
                {i < workflowSteps.length - 1 && <span className="workflow-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="platform-stats">
        <div className="stats-row">
          {[
            { num: platformStats.activeChallenges, label: "Active Challenges" },
            { num: platformStats.registeredStartups.toLocaleString(), label: "Registered Startups" },
            { num: platformStats.runningPilots, label: "Running Pilots" },
            { num: platformStats.validatedSolutions, label: "Validated Solutions" },
          ].map((s) => (
            <div key={s.label} className="platform-stat-card">
              <div className="platform-stat-num">{s.num}</div>
              <div className="platform-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="section section-dark">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Open Challenges</div>
          <h2 className="section-title">Solve Real Government Problems</h2>
          <p className="section-subtitle">These challenges represent real, funded opportunities for startups to create measurable government impact.</p>

          <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {featured.map((c) => (
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

          <div className="text-center mt-6">
            <Link to="/public-challenges" className="btn btn-secondary">
              View All Challenges <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section section-white">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Process</div>
          <h2 className="section-title">How Sahyog-Setu Works</h2>
          <p className="section-subtitle">A structured 6-stage process ensuring transparency, accountability and measurable impact at every step.</p>

          <div className="how-steps">
            {howSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="how-step-card">
                  <div className="how-step-num">{s.num} —</div>
                  <div className="how-step-icon" style={{ background: s.bg }}>
                    <Icon size={22} color={s.color} />
                  </div>
                  <div className="how-step-title">{s.title}</div>
                  <p className="how-step-desc">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="section section-dark">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Impact</div>
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">Startups that completed the Sahyog-Setu journey and are now at scale.</p>

          <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {successStories.map((s) => (
              <div key={s.id} className="success-card">
                <div>
                  <span className="badge badge-success" style={{ marginBottom: 8 }}>● {s.status}</span>
                  <h4 style={{ marginBottom: 4 }}>{s.title}</h4>
                  <p className="text-sm text-secondary">{s.department}</p>
                </div>
                <div className="success-kpi">
                  <CheckCircle size={24} /> {s.kpiScore} KPI Score
                </div>
                <p className="success-impact">{s.impact}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>{s.savedAmount}</span>
                  <button className="btn btn-secondary btn-sm">View Results</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="section section-navy">
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>Public Dashboard</div>
          <h2 className="section-title" style={{ color: "#fff" }}>Platform Transparency</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 40 }}>Live aggregate data on all government problems, active pilots and validated solutions — visible to everyone.</p>

          <div className="transparency-grid">
            <div className="transparency-card">
              <div className="transparency-num">{platformStats.activeProblems}</div>
              <div className="transparency-label">Active Problems</div>
            </div>
            <div className="transparency-card">
              <div className="transparency-num">{platformStats.activePilots}</div>
              <div className="transparency-label">Active Pilots</div>
            </div>
            <div className="transparency-card">
              <div className="transparency-num">{platformStats.validatedSolutions}</div>
              <div className="transparency-label">Validated Solutions</div>
            </div>
            <div className="transparency-card">
              <div className="transparency-num">{platformStats.scaledSolutions}</div>
              <div className="transparency-label">Scaled Solutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" style={{ padding: "80px 6%", background: "#0f172a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(37,99,235,0.15)", color: "#60a5fa", padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>Resources</div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 12 }}>Everything You Need to Get Started</h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: 540, lineHeight: 1.7, marginBottom: 48 }}>Guides, templates, training videos and frameworks for government officers and startups.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { Icon: FileText, iconBg: "#1e3a5f", iconColor: "#60a5fa", title: "Challenge Design Handbook", desc: "How to write a technology-neutral, outcome-focused government challenge.", tag: "Government", tagBg: "#1e3a8a", tagColor: "#93c5fd" },
              { Icon: CheckCircle, iconBg: "#14532d", iconColor: "#4ade80", title: "Eligibility Criteria Framework", desc: "Standardised startup screening criteria — legal, technical and financial.", tag: "Government", tagBg: "#14532d", tagColor: "#86efac" },
              { Icon: Target, iconBg: "#451a03", iconColor: "#fb923c", title: "KPI Definition Guide", desc: "Defining measurable, independently-verifiable pilot success metrics.", tag: "Evaluation", tagBg: "#451a03", tagColor: "#fdba74" },
              { Icon: Shield, iconBg: "#2e1065", iconColor: "#c084fc", title: "Pilot Contract Template", desc: "Standard pilot contract with milestone payments and IP clauses.", tag: "Legal", tagBg: "#2e1065", tagColor: "#d8b4fe" },
              { Icon: Zap, iconBg: "#0c4a6e", iconColor: "#38bdf8", title: "Startup Application Guide", desc: "How to write a compelling application for a Sahyog-Setu challenge.", tag: "Startup", tagBg: "#0c4a6e", tagColor: "#7dd3fc" },
              { Icon: TrendingUp, iconBg: "#831843", iconColor: "#f9a8d4", title: "Validation & Procurement Guide", desc: "Independent validation process and GFR-compliant procurement path.", tag: "Procurement", tagBg: "#831843", tagColor: "#fbcfe8" },
            ].map((r, i) => {
              const Icon = r.Icon;
              return (
                <div key={i} style={{
                  padding: "28px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.22s",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}>
                  {/* Icon */}
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: r.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, flexShrink: 0 }}>
                    <Icon size={22} color={r.iconColor} />
                  </div>
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", lineHeight: 1.4 }}>{r.title}</div>
                    <span style={{ background: r.tagBg, color: r.tagColor, borderRadius: 20, padding: "2px 10px", fontSize: "0.68rem", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>{r.tag}</span>
                  </div>
                  {/* Description */}
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.65, margin: "0 0 20px 0", flex: 1 }}>{r.desc}</p>
                  {/* CTA */}
                  <button style={{ alignSelf: "flex-start", fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
                    Download PDF →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-white" style={{ textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="section-title">Ready to Build for Bharat?</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 32px" }}>Whether you are a government department with a problem or a startup with a solution, Sahyog-Setu is your platform.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/login/government" className="btn btn-navy btn-lg">Government Login</Link>
            <Link to="/login/startup" className="btn btn-primary btn-lg">Register Your Startup</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-top">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div className="nav-logo-icon">SS</div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Sahyog-Setu</span>
              </div>
              <p className="footer-brand-desc">India's national government innovation platform — connecting departments and startups through transparent, outcome-focused challenges.</p>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <Link to="/public-challenges" className="footer-link">Active Challenges</Link>
              <a href="#how-it-works" className="footer-link">How It Works</a>
              <a href="#success-stories" className="footer-link">Success Stories</a>
              <a className="footer-link">Transparency Dashboard</a>
            </div>
            <div>
              <div className="footer-col-title">For Startups</div>
              <Link to="/login/startup" className="footer-link">Register Startup</Link>
              <a className="footer-link">Eligibility Guide</a>
              <a className="footer-link">Pilot Handbook</a>
              <a className="footer-link">Payment Process</a>
            </div>
            <div>
              <div className="footer-col-title">Government</div>
              <Link to="/login/government" className="footer-link">Government Login</Link>
              <a className="footer-link">Create Challenge</a>
              <a className="footer-link">Evaluation Framework</a>
              <a className="footer-link">Procurement Guide</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 Sahyog-Setu — Government Innovation Portal. All rights reserved.</span>
            <div className="footer-badges">
              <span className="footer-badge">MeitY</span>
              <span className="footer-badge">DPIIT</span>
              <span className="footer-badge">Startup India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
