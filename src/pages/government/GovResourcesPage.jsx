import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FileText, Download, ExternalLink, BookOpen, Video, Link2 } from "lucide-react";

const guides = [
  { icon: FileText, title: "Challenge Design Handbook", desc: "Step-by-step guide to defining outcome-focused, technology-neutral government challenges.", type: "PDF", tag: "Government", color: "#dbeafe", iconColor: "#2563eb" },
  { icon: FileText, title: "Eligibility Criteria Framework", desc: "Standardised criteria for screening startup applications — legal, technical, financial.", type: "PDF", tag: "Government", color: "#dcfce7", iconColor: "#16a34a" },
  { icon: FileText, title: "KPI Definition Guide", desc: "How to define measurable, independently-verifiable KPIs for pilot success assessment.", type: "PDF", tag: "Government", color: "#fef3c7", iconColor: "#d97706" },
  { icon: FileText, title: "Pilot Contract Template", desc: "Standard government pilot contract with milestone-based payment schedule and IP clause.", type: "DOCX", tag: "Legal", color: "#ede9fe", iconColor: "#7c3aed" },
  { icon: FileText, title: "Validation & Procurement Guide", desc: "Process for independent validation, scale-up assessment and GFR-compliant procurement.", type: "PDF", tag: "Procurement", color: "#fce7f3", iconColor: "#db2777" },
  { icon: FileText, title: "Startup Due Diligence Checklist", desc: "Full due diligence checklist for government officers before pilot contract award.", type: "XLSX", tag: "Government", color: "#e0f2fe", iconColor: "#0891b2" },
];

const videos = [
  { title: "Introduction to Sahyog-Setu", desc: "Overview of the platform, its mandate and how it connects government to startups.", duration: "8 min" },
  { title: "How to Create a Challenge", desc: "Walkthrough of the 4-step challenge creation form with best practices.", duration: "12 min" },
  { title: "Evaluating Applications: A Practical Guide", desc: "Training for evaluators on the scoring framework and conflict of interest procedures.", duration: "18 min" },
  { title: "Pilot Management & KPI Tracking", desc: "How to set up, monitor and report on a controlled government pilot.", duration: "15 min" },
];

const links = [
  { title: "DPIIT Startup India Portal", url: "https://www.startupindia.gov.in", desc: "Official startup registration and recognition" },
  { title: "MeitY Digital India", url: "https://www.meity.gov.in", desc: "Ministry of Electronics & IT — parent ministry" },
  { title: "GFR 2017 — Procurement Rules", url: "#", desc: "Government Financial Rules governing procurement" },
  { title: "GeM Portal", url: "https://gem.gov.in", desc: "Government e-Marketplace for procurement" },
  { title: "Jal Jeevan Mission", url: "https://jaljeevanmission.gov.in", desc: "Rural water supply — key pilot partner" },
  { title: "Smart Cities Mission", url: "https://smartcities.gov.in", desc: "Urban innovation — key challenge area" },
];

export default function GovResourcesPage() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Resources</h2>
        <p>Guides, templates, videos and reference links for government officers on Sahyog-Setu.</p>
      </div>

      {/* Guides & Templates */}
      <div className="section-heading" style={{ marginBottom: 16 }}>
        <div>
          <h3>Guides & Templates</h3>
          <p className="text-sm text-secondary">Download official documents, templates and frameworks.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
        {guides.map((g, i) => {
          const Icon = g.icon;
          return (
            <div key={i} className="card card-padded" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, background: g.color, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={g.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.4 }}>{g.title}</span>
                  <span className="badge badge-neutral" style={{ flexShrink: 0 }}>{g.type}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }}>{g.desc}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", background: g.color, color: g.iconColor, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{g.tag}</span>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }}><Download size={12} /> Download</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        {/* Training Videos */}
        <div>
          <div className="section-heading" style={{ marginBottom: 16 }}>
            <div>
              <h3>Training Videos</h3>
              <p className="text-sm text-secondary">Platform walkthroughs and training modules.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => (
              <div key={i} className="card card-padded" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, background: "#ede9fe", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Video size={20} color="#7c3aed" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: 2 }}>{v.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{v.desc}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>{v.duration}</div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", marginTop: 4 }}><ExternalLink size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div>
          <div className="section-heading" style={{ marginBottom: 16 }}>
            <div>
              <h3>Useful Links</h3>
              <p className="text-sm text-secondary">Government portals and reference sites.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-light)"; e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; }}>
                <Link2 size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{l.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{l.desc}</div>
                </div>
                <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
