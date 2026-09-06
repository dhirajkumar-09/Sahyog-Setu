import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FileText, Download, ExternalLink, BookOpen, Video, Link2 } from "lucide-react";

// ── Real markdown content for all 6 templates ──────────────────────────────
const TEMPLATE_CONTENT = {
  "Challenge Design Handbook": `# Challenge Design Handbook
## Sahyog-Setu Government Innovation Programme

**Version 2.1 | Ministry of Electronics & Information Technology**

---

## 1. Introduction

The Challenge Design Handbook provides government officers with a step-by-step framework to define outcome-focused, technology-neutral innovation challenges that attract qualified startups and produce measurable results.

### 1.1 Why Technology-Neutral Framing Matters
When challenges prescribe specific technologies, they:
- Limit the solution space unnecessarily
- Create potential for vendor capture
- May disadvantage innovative approaches

**Instead, define the PROBLEM, not the SOLUTION.**

---

## 2. Step-by-Step Challenge Design Process

### Step 1: Problem Identification Workshop
- Conduct a stakeholder mapping exercise (60–90 min)
- List current-state pain points with quantitative evidence
- Identify root causes vs. symptoms
- Define the "problem boundary" (what is in-scope)

### Step 2: Draft the Problem Statement
**Template:**
> "[Department] faces [problem] which affects [target group] and results in [measurable impact]. A solution would achieve [measurable outcome] within [timeframe]."

**Good Example:**
> "Bihar municipalities face waste collection inefficiencies affecting 2M residents, costing ₹40 Cr/year in excess operational expense. A solution would reduce collection costs by 20% and improve coverage to 95% within 60 days."

**Bad Example (avoid):**
> "We need a mobile app with AI to manage waste using IoT sensors."

### Step 3: Eligibility Criteria Design
- Functional: What capability must the startup demonstrate?
- Technical: What standards must the solution meet?
- Organisational: What is the minimum team/entity requirement?
- Financial: What is the minimum financial soundness criterion?

### Step 4: KPI Definition (see KPI Guide)

### Step 5: Pilot Scope Definition
- Geography: Specific wards, districts or PHCs — not vague regions
- Scale: Number of users/units/transactions in scope
- Duration: 30–120 days (recommend 60–90 for most challenges)
- Government Support: Be explicit about data, infrastructure and staff access provided

---

## 3. Common Mistakes to Avoid

| Mistake | Better Approach |
|---|---|
| "Best AI company" as criterion | "Working ML model with >80% accuracy on test set" |
| Vague outcome: "better service" | Specific KPI: ">85% citizen satisfaction (CSAT)" |
| No IP clause | Explicit IP model: Govt-owned / Startup-owned / Joint |
| Open-ended timeline | Fixed pilot end date with milestone gates |

---

## 4. Approval Checklist

- [ ] Problem statement is technology-neutral
- [ ] At least 3 measurable KPIs defined
- [ ] Pilot geography specified to ward/block level
- [ ] Budget approved by competent financial authority
- [ ] IP ownership model selected
- [ ] Data localization requirement stated
- [ ] Legal team reviewed eligibility criteria

---

*For support: contact the Sahyog-Setu Programme Management Unit at pmu@sahyog-setu.gov.in*
`,

  "Eligibility Criteria Framework": `# Eligibility Criteria Framework
## Standardised Startup Screening — Sahyog-Setu

**Version 1.4 | DPIIT / MeitY Joint Guidance**

---

## 1. Purpose

This framework provides government officers with standardised, legally defensible eligibility criteria for screening startup applications. Criteria must be:
1. **Relevant** — directly linked to the challenge
2. **Proportionate** — not excessively burdensome for early-stage startups
3. **Objective** — verifiable through documents or demonstrations
4. **Non-discriminatory** — no geographical or age bias

---

## 2. Mandatory Criteria (All Challenges)

### 2.1 Legal & Organisational
- [ ] Registered company in India (Pvt Ltd / LLP / OPC / Partnership Firm)
- [ ] DPIIT Startup Recognition Certificate (or applied, recognition pending)
- [ ] GST Registration (if applicable — turnover > ₹20L)
- [ ] PAN and TAN registration
- [ ] No conviction / debarment under any government procurement proceeding

### 2.2 Financial Soundness
- [ ] Audited accounts for at least 1 financial year OR
- [ ] Bank statement showing operating balance of ≥ 3 months' pilot runway
- [ ] No pending insolvency proceedings

### 2.3 Technical Demonstration
- [ ] Working prototype, MVP or deployed solution
- [ ] Demonstration video (max 5 min) OR live demo capability
- [ ] Technical architecture document

---

## 3. Configurable Criteria (Per-Challenge)

### Category A: Domain Expertise
Select relevant criteria:
- [ ] Prior work in [domain] sector (evidence required)
- [ ] Domain expert on founding team (CV required)
- [ ] Advisory relationship with [domain] institution

### Category B: Scale & Team Size
Choose ONE range appropriate for challenge complexity:
- **Micro**: 2+ full-time team members
- **Small**: 5+ full-time team members
- **Medium**: 10+ full-time team members

### Category C: Funding / Financial Stage
Use only if pilot contract value justifies it:
- Bootstrapped / grant-funded: acceptable for pilots ≤ ₹10L
- Seed / Angel funded: recommended for pilots ₹10L–₹50L
- Series A+: for pilots > ₹50L (optional, not mandatory)

### Category D: Turnover (Use with caution)
> ⚠️ **IMPORTANT**: Turnover requirements disproportionately affect deep-tech and social-impact startups. The Waive Turnover Requirement toggle in Sahyog-Setu allows officers to remove this barrier. Use only for challenges where financial track record is genuinely essential.

Standard thresholds (if used):
- Pilot ≤ ₹10L: No turnover minimum
- Pilot ₹10–50L: ₹40L minimum turnover OR waived
- Pilot > ₹50L: ₹1 Cr minimum turnover OR waived

---

## 4. Evaluation Scoring Guide

| Criterion Category | Max Weight | Notes |
|---|---|---|
| Innovation & Novelty | 20% | Is the approach differentiated? |
| Technical Feasibility | 25% | Can the team build and deploy this? |
| Cost Effectiveness | 20% | Value for pilot budget? |
| Scalability | 20% | Can it scale across India? |
| Team Capability | 15% | Right skills and track record? |

---

## 5. Conflict of Interest Protocol

Evaluators must recuse if:
- They hold equity in the applicant startup
- They have a family relationship with founders
- They have provided paid consulting to the startup in last 2 years

Recusal must be declared in writing within 24 hours of assignment.

---

*Approved by: DPIIT Startup India Programme | Last updated: March 2024*
`,

  "KPI Definition Guide": `# KPI Definition Guide
## How to Define Measurable, Verifiable Success Indicators

**Sahyog-Setu Programme | Version 2.0**

---

## 1. The SMART KPI Standard

All Sahyog-Setu pilot KPIs must be:

| Criterion | Meaning | Example |
|---|---|---|
| **S**pecific | Clearly defined, unambiguous | "Door-to-door collection coverage" not "better coverage" |
| **M**easurable | Numerical, verifiable | ">95%" not "high" |
| **A**chievable | Realistic within pilot timeframe | 60 days, limited geography |
| **R**elevant | Directly linked to problem | Cost reduction for waste management challenge |
| **T**ime-bound | Measured at defined milestones | "By Day 60 of pilot" |

---

## 2. KPI Categories

### 2.1 Output KPIs (measure what is delivered)
- Number of sensors deployed
- Number of users onboarded
- Records digitised

### 2.2 Outcome KPIs (measure impact)
- Cost reduction percentage
- Citizen satisfaction score
- Response time improvement

### 2.3 Process KPIs (measure reliability)
- System uptime percentage
- Data accuracy rate
- Report submission timeliness

### 2.4 Leading vs. Lagging KPIs
- **Leading**: Predictive (e.g., % deployment complete)
- **Lagging**: Result (e.g., actual cost savings)
- **Best practice**: 2–3 outcome KPIs + 1–2 process KPIs

---

## 3. Measurement Methodology

### 3.1 Baseline Establishment (Before Pilot)
- Document current state metrics with evidence
- Establish measurement protocol (who, how, when)
- Define measurement tools (GPS logs, surveys, system logs)

### 3.2 Mid-Pilot Measurement (Day 30–45)
- Verify data collection is operational
- Compare trends against target trajectory
- Flag deviations early for corrective action

### 3.3 Final Measurement (Day 55–60)
- Independent validation of all KPIs
- Triangulate data sources (startup-reported vs. government-verified)
- Document exceptions and context

---

## 4. Sample KPI Sets by Sector

### Smart Cities / Urban
| KPI | Target | Method |
|---|---|---|
| Cost per unit service | >20% reduction | Financial audit |
| Service coverage | >90% of target area | GPS tracking |
| Citizen satisfaction | >80% CSAT | Phone/app survey |
| System uptime | >99% | Monitoring dashboard |

### Agriculture
| KPI | Target | Method |
|---|---|---|
| Farmer onboarding | >5,000 registrations | App database |
| Detection accuracy | >85% | Expert field validation |
| Crop loss reduction | >20% | Yield comparison study |
| Advisory response time | <10 min | System logs |

### Healthcare
| KPI | Target | Method |
|---|---|---|
| Records digitised | 100% | Database count |
| Registration time reduction | >70% | Time-motion study |
| Data accuracy | >98% | Audit sampling |
| ABHA integration uptime | >99.9% | API monitoring |

---

## 5. Red Flags in KPI Design

- ❌ KPIs the startup fully controls (no independent verification)
- ❌ KPIs with no baseline (can't measure improvement)
- ❌ More than 6 KPIs (dilutes focus)
- ❌ Vanity metrics (app downloads with no usage verification)

---

*Template approved by the Sahyog-Setu Technical Standards Committee*
`,

  "Pilot Contract Template": `# Government Pilot Contract — Template
## Sahyog-Setu Innovation Programme

**DRAFT — For Legal Review Before Use**

---

## AGREEMENT FOR INNOVATION PILOT

This Agreement is entered into on [DATE] between:

**Government Party:**
[Department Name], Government of [State/India]
("Government")

**Startup Party:**
[Company Name], [CIN], registered at [Registered Office]
("Startup" or "Service Provider")

---

## 1. Scope of Pilot

### 1.1 Challenge
This pilot addresses the challenge titled: **[Challenge Title]** as published on the Sahyog-Setu platform (Challenge ID: [ID]).

### 1.2 Pilot Objectives
The Startup shall deploy, operate and demonstrate a solution that achieves the KPIs defined in Schedule A within the pilot geography and timeframe.

### 1.3 Pilot Geography
[Specific geography — e.g., "2 wards of Patna Municipal Corporation: Ward 14 (Rajendra Nagar) and Ward 22 (Kankarbagh)"]

### 1.4 Pilot Duration
Commencement Date: [DATE]
Completion Date: [DATE + N DAYS]
Total Duration: [N] calendar days

---

## 2. Payment Schedule (Milestone-Based)

| Milestone | Deliverable | Amount | Timeline |
|---|---|---|---|
| M1 — Contract & Deployment | Contract signed, infrastructure deployed | ₹[X] (20%) | Day 0 |
| M2 — Mid-Pilot Review | 50% deployment, KPIs on trajectory | ₹[X] (30%) | Day [30] |
| M3 — Data Collection | Full deployment, data collected | ₹[X] (20%) | Day [N-10] |
| M4 — Validation & Close | Independent validation passed | ₹[X] (30%) | Day [N+15] |

**Total Contract Value: ₹[AMOUNT]**

Payment will be released within 15 working days of milestone verification.

---

## 3. Intellectual Property

### 3.1 IP Ownership Model
[SELECT ONE:]

**Option A — Government-Owned:**
All intellectual property, including software, models, algorithms, data and documentation, developed specifically for this pilot shall vest with the Government. The Startup retains rights to pre-existing IP.

**Option B — Startup-Owned:**
The Startup retains ownership of all IP. The Government receives a perpetual, royalty-free, non-exclusive licence to use the solution for government purposes within [State/India].

**Option C — Joint Ownership:**
IP developed during the pilot shall be jointly owned in equal shares. Neither party may commercialise jointly owned IP without written consent of the other party.

### 3.2 Pre-Existing IP
Each party retains full ownership of IP developed prior to this Agreement.

### 3.3 Data Rights
All citizen and government data accessed, processed or generated during the pilot belongs exclusively to the Government. The Startup has no right to use, share or monetise this data beyond the scope of this Agreement.

---

## 4. Data Protection & Cybersecurity

### 4.1 Data Localisation
All data processed under this Agreement shall be stored on servers physically located within India.

### 4.2 Security Standards
The Startup shall maintain:
- End-to-end encryption (AES-256 minimum) for all data in transit and at rest
- Role-based access control with full audit logging
- Incident response capability with 24-hour breach notification to Government
- Annual penetration testing by a CERT-In empanelled agency

### 4.3 Data Retention & Deletion
Upon Agreement termination, the Startup shall return all government data within 30 days and certify deletion of all copies.

---

## 5. Performance & Reporting

### 5.1 Reporting Cadence
- Weekly status report (email to designated officer)
- Milestone reports per Schedule A
- Incident reports within 24 hours

### 5.2 KPI Targets
Detailed in Schedule A. Government may conduct field verification at any time with 24 hours' notice.

---

## 6. Termination

Either party may terminate with 30 days' written notice. Government may terminate immediately for:
- Material breach of data protection obligations
- Startup insolvency
- KPIs confirmed off-track at mid-pilot review with no credible remediation plan

---

## 7. Governing Law
This Agreement is governed by the laws of India. Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996, seated in [Delhi/State Capital].

---

## Schedule A — KPI Targets

| KPI | Baseline | Target | Measurement Method | Verification Cadence |
|---|---|---|---|---|
| [KPI 1] | [X] | >[Y]% | [Method] | Monthly |
| [KPI 2] | [X] | >[Y] | [Method] | End of pilot |

---

*This template requires review by the Government's legal counsel before execution.*
*Reference: GFR 2017, DPIIT Startup India Pilot Guidelines, IT Act 2000*
`,

  "Validation & Procurement Guide": `# Validation & Procurement Guide
## From Pilot Completion to Scale-Up

**Sahyog-Setu Programme | Version 1.8**

---

## 1. Introduction

This guide covers the two critical phases after a pilot concludes:
1. **Independent Validation** — verifying KPI achievement objectively
2. **GFR-Compliant Procurement** — converting a successful pilot into a government contract

---

## 2. Independent Validation Process

### 2.1 Who Conducts Validation?
Validation must be conducted by an independent party — NOT the Government department running the pilot, NOT the startup. Options:
- IIT / IIM / NIT faculty
- CERT-In empanelled agency (for cybersecurity)
- NABL-accredited lab (for hardware/sensors)
- Domain expert nominated by Sahyog-Setu PMU

### 2.2 Validation Timeline
| Phase | Duration |
|---|---|
| Validator appointment | Week N-2 (2 weeks before pilot end) |
| Data collection & field verification | Week N to N+1 |
| Draft validation report | Week N+2 |
| Government / Startup review | Week N+3 |
| Final validation report | Week N+4 |

### 2.3 Validation Methodology

**For each KPI:**
1. Review startup-submitted data
2. Conduct independent field measurement (sample-based or full count)
3. Cross-verify against government administrative records
4. Document any methodology limitations or exceptions

**Data sources to triangulate:**
- System logs (exported from startup platform)
- Government records (registers, ledgers, databases)
- Beneficiary surveys (minimum N=100 for large pilots)
- Physical site inspection (for hardware/infrastructure)

### 2.4 Validation Scorecard

| Category | Pass Threshold | Implication |
|---|---|---|
| All KPIs passed | 100% | Recommend for scale-up |
| 80–99% KPIs passed | Partial | Case-by-case review |
| <80% KPIs passed | Failed | Reject or conditional re-pilot |

### 2.5 Handling Exceptions
If a KPI was not achieved due to factors outside the startup's control (e.g., government infrastructure failure, natural disaster, policy change):
- Document with evidence
- Validator may classify as "Conditional Pass"
- Government retains sole discretion on scale-up decision

---

## 3. Scale-Up Decision Framework

After receiving the validation report, the competent authority shall decide within 30 days:

### Decision Options:
| Decision | Condition | Action |
|---|---|---|
| **Approve for Scale-up** | Validation passed | Initiate procurement |
| **More Evidence Required** | Partial pass or unusual results | Extend pilot or request more data |
| **Reject** | Failed validation | Close pilot; notify startup with reasons |

---

## 4. GFR-Compliant Procurement Process

### 4.1 Legal Basis
Government procurement of startup solutions validated through Sahyog-Setu may proceed under:
- **Rule 166 (GFR 2017)**: Limited tender for specialised services
- **DPIIT Startup Procurement Policy 2023**: Direct procurement from DPIIT-recognised startups up to ₹1 Cr (without tender)
- **GeM Startup Runway**: Listing on Government e-Marketplace

### 4.2 Procurement Thresholds

| Contract Value | Procurement Route |
|---|---|
| Up to ₹25L | Direct procurement (Startup India policy) |
| ₹25L – ₹1 Cr | Limited tender (minimum 3 quotes) or direct under startup policy |
| > ₹1 Cr | Open tender (GFR Rule 149) |

### 4.3 Procurement Steps (Direct Route)
1. Validate startup's DPIIT recognition status
2. Prepare Detailed Project Report (DPR) for scale-up
3. Obtain financial concurrence from Finance Department
4. Issue Purchase Order / Letter of Award
5. Execute scale-up contract (modified from pilot contract)
6. Onboard to GeM if applicable

---

## 5. Post-Procurement Governance

- Quarterly performance reviews against scaled KPIs
- Annual contract renewal based on performance
- Mandatory GeM listing within 6 months of scale-up contract

---

*Reference: GFR 2017 (Rules 149, 166, 200), DPIIT Startup Procurement Policy 2023, GeM SOPs*
`,

  "Startup Due Diligence Checklist": `# Startup Due Diligence Checklist
## Pre-Pilot Contract Award

**For Government Officers | Sahyog-Setu Programme**

---

## Instructions
Complete this checklist BEFORE signing the pilot contract. All items marked ✱ are mandatory. Document reference numbers for all submitted documents.

| # | Item | ✱ | Verified | Doc Reference | Notes |
|---|---|---|---|---|---|
| **SECTION 1: LEGAL & ENTITY** |
| 1.1 | Certificate of Incorporation (MCA) | ✱ | ☐ | | |
| 1.2 | DPIIT Startup Recognition Certificate | ✱ | ☐ | | |
| 1.3 | GST Registration Certificate | ✱ | ☐ | | |
| 1.4 | PAN Card (Company) | ✱ | ☐ | | |
| 1.5 | TAN Registration | | ☐ | | |
| 1.6 | Shop & Establishment Certificate | | ☐ | | |
| 1.7 | No conviction certificate (Director) | ✱ | ☐ | | Undertaking acceptable |
| | **SECTION 2: FINANCIAL** |
| 2.1 | Audited Balance Sheet (latest FY) | ✱ | ☐ | | |
| 2.2 | Audited P&L (latest FY) | ✱ | ☐ | | |
| 2.3 | Bank statement (last 6 months) | ✱ | ☐ | | |
| 2.4 | IT Returns (last 2 years, if applicable) | | ☐ | | |
| 2.5 | No outstanding statutory dues | ✱ | ☐ | | Self-declaration |
| 2.6 | Funding proof (if claiming investor-backed) | | ☐ | | Term sheet / CA certificate |
| | **SECTION 3: TECHNICAL** |
| 3.1 | Live product demonstration | ✱ | ☐ | | |
| 3.2 | Technical architecture document | ✱ | ☐ | | |
| 3.3 | Data flow diagram | ✱ | ☐ | | |
| 3.4 | Security assessment / pentest report | | ☐ | | Required for data-sensitive challenges |
| 3.5 | Source code access or escrow agreement | | ☐ | | For Govt-owned IP model |
| 3.6 | Cloud hosting agreement (data localization proof) | ✱ | ☐ | | If data localization required |
| 3.7 | ISO 27001 certificate | | ☐ | | If required in challenge |
| | **SECTION 4: TEAM & REFERENCES** |
| 4.1 | CVs of key technical leads | ✱ | ☐ | | |
| 4.2 | CVs of founders | | ☐ | | |
| 4.3 | 2 professional references | ✱ | ☐ | | Contact and verify |
| 4.4 | Previous government project experience (if any) | | ☐ | | Completion certificate |
| | **SECTION 5: REGULATORY** |
| 5.1 | CERT-In compliance declaration | | ☐ | | If cybersecurity challenge |
| 5.2 | Healthcare data handling certification | | ☐ | | If health sector |
| 5.3 | Personal Data Protection Act compliance note | ✱ | ☐ | | All challenges |
| 5.4 | Insurance certificate (cyber / professional liability) | | ☐ | | For large pilots |

---

## Red Flags — Automatic Disqualification

- [ ] Company incorporated less than 30 days ago (unless exception granted)
- [ ] Director debarred from government contracts
- [ ] Bank account in negative balance
- [ ] Unable to demonstrate working product
- [ ] Discrepancy between stated team size and provable employees

---

## Verification Sign-Off

**Verified by (Government Officer):**
Name: ___________________
Designation: ___________________
Date: ___________________
Signature: ___________________

**Countersigned by (Senior Officer):**
Name: ___________________
Designation: ___________________
Date: ___________________
Signature: ___________________

---

*This checklist is mandatory under Sahyog-Setu Programme Guidelines. Retain for audit purposes for 5 years.*
`,
};

const guides = [
  { key: "Challenge Design Handbook", icon: FileText, title: "Challenge Design Handbook", desc: "Step-by-step guide to defining outcome-focused, technology-neutral government challenges.", type: "MD", tag: "Government", color: "#dbeafe", iconColor: "#2563eb" },
  { key: "Eligibility Criteria Framework", icon: FileText, title: "Eligibility Criteria Framework", desc: "Standardised criteria for screening startup applications — legal, technical, financial.", type: "MD", tag: "Government", color: "#dcfce7", iconColor: "#16a34a" },
  { key: "KPI Definition Guide", icon: FileText, title: "KPI Definition Guide", desc: "How to define measurable, independently-verifiable KPIs for pilot success assessment.", type: "MD", tag: "Government", color: "#fef3c7", iconColor: "#d97706" },
  { key: "Pilot Contract Template", icon: FileText, title: "Pilot Contract Template", desc: "Standard government pilot contract with milestone-based payment schedule and IP clause.", type: "MD", tag: "Legal", color: "#ede9fe", iconColor: "#7c3aed" },
  { key: "Validation & Procurement Guide", icon: FileText, title: "Validation & Procurement Guide", desc: "Process for independent validation, scale-up assessment and GFR-compliant procurement.", type: "MD", tag: "Procurement", color: "#fce7f3", iconColor: "#db2777" },
  { key: "Startup Due Diligence Checklist", icon: FileText, title: "Startup Due Diligence Checklist", desc: "Full due diligence checklist for government officers before pilot contract award.", type: "MD", tag: "Government", color: "#e0f2fe", iconColor: "#0891b2" },
];

const videos = [
  { title: "Introduction to Sahyog-Setu", desc: "Overview of the platform, its mandate and how it connects government to startups.", duration: "8 min" },
  { title: "How to Create a Challenge", desc: "Walkthrough of the 4-step challenge creation form — covering problem definition, sandbox vs full pilot mode, IP ownership, waiver toggles and KPI setting.", duration: "12 min" },
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

function handleDownload(guide) {
  const content = TEMPLATE_CONTENT[guide.key];
  if (!content) return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${guide.key.replace(/[^a-z0-9]/gi, "_")}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
          <p className="text-sm text-secondary">Download official documents, templates and frameworks — real Markdown content, no install required.</p>
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
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginLeft: "auto" }}
                    onClick={() => handleDownload(g)}
                    title={`Download ${g.title} as Markdown`}
                  >
                    <Download size={12} /> Download
                  </button>
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
