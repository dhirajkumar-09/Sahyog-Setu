import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { addChallenge } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, ChevronRight, Plus, Trash2, Save, Eye, Send, AlertCircle, Shield, Lock } from "lucide-react";

const steps = ["Problem", "Requirements", "KPIs", "Review"];

const departments = ["Urban Development Department", "Transport Department", "Rural Development Department", "Agriculture Department", "Health Department"];
const locations = ["Bihar", "Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Rajasthan", "Tamil Nadu"];

const CYBER_ITEMS = [
  "End-to-end encryption (data in transit & at rest)",
  "ISO 27001 / equivalent information security certification",
  "CERT-In empanelled security audit",
  "Role-based access control (RBAC) + audit logging",
  "Incident response plan (24-hr notification SLA)",
  "Penetration testing (bi-annual minimum)",
];

const defaultKPIs = [
  { name: "Accuracy / Effectiveness", target: ">90%", measurement: "Automated testing & validation" },
  { name: "Cost Reduction", target: ">20%", measurement: "Financial analysis vs baseline" },
  { name: "User Satisfaction", target: ">85%", measurement: "User survey" },
];

const likelihoodColor = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626" };

export default function CreateChallengePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [kpis, setKpis] = useState(defaultKPIs);
  const [publishError, setPublishError] = useState("");
  const [form, setForm] = useState({
    title: "", department: "", location: "", description: "", currentSituation: "", expectedOutcome: "", targetUsers: "",
    budget: "", pilotDuration: "", targetGeo: "", capabilities: "", constraints: "",
    // New fields — Feature 1 & 2
    ipOwnership: "",
    dataLocalization: false,
    cyberChecklist: Array(CYBER_ITEMS.length).fill(false),
    waiveTurnoverRequirement: false,
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleCyber = (i) => setForm(f => {
    const arr = [...f.cyberChecklist];
    arr[i] = !arr[i];
    return { ...f, cyberChecklist: arr };
  });

  const addKPI = () => setKpis(k => [...k, { name: "", target: "", measurement: "" }]);
  const updateKPI = (i, field, val) => setKpis(k => k.map((kpi, idx) => idx === i ? { ...kpi, [field]: val } : kpi));
  const removeKPI = (i) => setKpis(k => k.filter((_, idx) => idx !== i));

  const handlePublish = () => {
    if (!form.title.trim() || !form.department) {
      setPublishError("Please go back to Step 1 and fill in at least the Challenge Title and Department.");
      return;
    }
    const budgetNum = Number(form.budget.replace(/[^0-9]/g, "")) || 0;
    addChallenge({
      title: form.title.trim(),
      department: form.department,
      sector: form.department.replace(" Department", ""),
      location: form.location || "Pan India",
      budget: form.budget ? `₹${budgetNum.toLocaleString("en-IN")}` : "Not specified",
      budgetNum,
      pilotDuration: form.pilotDuration || "60 Days",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      description: form.description || "No description provided.",
      expectedOutcome: form.expectedOutcome || "Not specified.",
      eligibility: (form.capabilities || "").split(",").map(s => s.trim()).filter(Boolean),
      kpis,
      pilotInfo: {
        geography: form.targetGeo || "To be finalised",
        targetUsers: form.targetUsers || "Not specified",
        governmentSupport: user?.department ? `Coordination via ${user.department}` : "Departmental coordination",
        deliverables: "Functional pilot, periodic reports, final impact assessment",
      },
      // New fields
      ipOwnership: form.ipOwnership || "Not specified",
      dataLocalization: form.dataLocalization,
      cyberChecklist: form.cyberChecklist,
      waiveTurnoverRequirement: form.waiveTurnoverRequirement,
    });
    navigate("/government/challenges");
  };

  const cyberPassCount = form.cyberChecklist.filter(Boolean).length;

  const StepCircle = ({ idx }) => {
    const done = idx < step;
    const active = idx === step;
    return (
      <div className={`step-circle ${active ? "active" : done ? "completed" : ""}`}>
        {done ? <CheckCircle size={16} /> : idx + 1}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Create New Challenge</h2>
        <p>Define a new government innovation challenge in 4 steps.</p>
      </div>

      {/* Step Indicator */}
      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div className="step-indicator">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="step-item" onClick={() => i < step && setStep(i)} style={{ cursor: i < step ? "pointer" : "default" }}>
                <StepCircle idx={i} />
                <span className={`step-label ${i === step ? "active" : i < step ? "completed" : ""}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`step-line ${i < step ? "completed" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="card card-padded">
        {/* Step 1: Problem */}
        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Step 1 — Problem Definition</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 24 }}>Define the government problem clearly, with technology-neutral framing and measurable outcomes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Challenge Title *</label>
                <input className="form-input" placeholder="e.g. Smart Waste Management System for Urban Municipalities" value={form.title} onChange={e => update("title", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select className="form-input" value={form.department} onChange={e => update("department", e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location / State *</label>
                <select className="form-input" value={form.location} onChange={e => update("location", e.target.value)}>
                  <option value="">Select State</option>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Problem Description *</label>
                <textarea className="form-input form-textarea" rows={4} placeholder="Describe the problem in clear, technology-neutral terms. Focus on the challenge, not the solution." value={form.description} onChange={e => update("description", e.target.value)} />
                <span className="form-hint">Be specific about the scale and impact of the problem. Avoid prescribing technology.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Current Situation</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="What is happening today? What are current costs, inefficiencies or pain points?" value={form.currentSituation} onChange={e => update("currentSituation", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Outcome *</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="What should be achieved? State measurable outcomes." value={form.expectedOutcome} onChange={e => update("expectedOutcome", e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Target Users / Beneficiaries</label>
                <input className="form-input" placeholder="e.g. 50,000 households in Patna Municipal Corporation" value={form.targetUsers} onChange={e => update("targetUsers", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Step 2 — Requirements & Constraints</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 24 }}>Define the pilot scope, budget, geography and technical requirements.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Budget (₹) *</label>
                <input className="form-input" placeholder="e.g. ₹8,00,000" value={form.budget} onChange={e => update("budget", e.target.value)} />
                <span className="form-hint">This is the total pilot budget including all costs.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Pilot Duration *</label>
                <select className="form-input" value={form.pilotDuration} onChange={e => update("pilotDuration", e.target.value)}>
                  <option value="">Select Duration</option>
                  <option>30 Days</option><option>45 Days</option><option>60 Days</option>
                  <option>75 Days</option><option>90 Days</option><option>120 Days</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Target Geography *</label>
                <input className="form-input" placeholder="e.g. 2 wards of Patna Municipal Corporation, Bihar" value={form.targetGeo} onChange={e => update("targetGeo", e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Required Capabilities</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="e.g. IoT sensor experience, data analytics platform, mobile app development..." value={form.capabilities} onChange={e => update("capabilities", e.target.value)} />
                <span className="form-hint">List technical and domain capabilities required — not specific technologies.</span>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Constraints & Compliance</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="e.g. Data must be stored in India, solution must work in low-bandwidth environments..." value={form.constraints} onChange={e => update("constraints", e.target.value)} />
              </div>
            </div>

            {/* ── Data, IP & Cybersecurity Section ── */}
            <div style={{ marginTop: 28, padding: "20px 24px", background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)", border: "1.5px solid #bfdbfe", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, background: "#2563eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={18} color="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: "#1e40af", fontSize: "1rem" }}>Data, IP & Cybersecurity</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#3b82f6" }}>Compliance requirements startups must meet for this challenge</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
                {/* IP Ownership */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: "#1e40af" }}>IP Ownership *</label>
                  <select
                    className="form-input"
                    value={form.ipOwnership}
                    onChange={e => update("ipOwnership", e.target.value)}
                    style={{ borderColor: "#bfdbfe" }}
                  >
                    <option value="">Select IP ownership model</option>
                    <option value="Govt-owned">Govt-owned — All IP vests with Government</option>
                    <option value="Startup-owned">Startup-owned — Government gets perpetual license</option>
                    <option value="Joint">Joint Ownership — Shared IP with defined terms</option>
                  </select>
                  <span className="form-hint">This will appear in the pilot contract and on the public challenge page.</span>
                </div>

                {/* Data Localization */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="form-label" style={{ color: "#1e40af" }}>Data Localization</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: form.dataLocalization ? "#dbeafe" : "#fff", border: `1.5px solid ${form.dataLocalization ? "#3b82f6" : "#e2e8f0"}`, borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.2s" }}>
                    <input
                      type="checkbox"
                      checked={form.dataLocalization}
                      onChange={e => update("dataLocalization", e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#2563eb", cursor: "pointer" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: form.dataLocalization ? "#1e40af" : "var(--text-primary)" }}>
                        Require Data Localization
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                        All citizen data must be stored on servers physically located in India
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Cybersecurity Checklist */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label className="form-label" style={{ color: "#1e40af", marginBottom: 0 }}>Cybersecurity Requirements</label>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: cyberPassCount === CYBER_ITEMS.length ? "#dcfce7" : cyberPassCount > 2 ? "#fef3c7" : "#fee2e2",
                    color: cyberPassCount === CYBER_ITEMS.length ? "#16a34a" : cyberPassCount > 2 ? "#d97706" : "#dc2626"
                  }}>
                    {cyberPassCount}/{CYBER_ITEMS.length} selected
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CYBER_ITEMS.map((item, i) => (
                    <label
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                        background: form.cyberChecklist[i] ? "#eff6ff" : "#fff",
                        border: `1.5px solid ${form.cyberChecklist[i] ? "#93c5fd" : "#e2e8f0"}`,
                        borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.cyberChecklist[i]}
                        onChange={() => toggleCyber(i)}
                        style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.85rem", color: form.cyberChecklist[i] ? "#1e40af" : "var(--text-secondary)", fontWeight: form.cyberChecklist[i] ? 600 : 400 }}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Waive Turnover Requirement — Feature 2 */}
              <div style={{ marginTop: 20, padding: "16px 18px", background: form.waiveTurnoverRequirement ? "#dbeafe" : "#fff", border: `2px solid ${form.waiveTurnoverRequirement ? "#3b82f6" : "#bfdbfe"}`, borderRadius: "var(--radius-md)", transition: "all 0.25s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 32, height: 32, background: form.waiveTurnoverRequirement ? "#2563eb" : "#e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
                    <Lock size={15} color={form.waiveTurnoverRequirement ? "#fff" : "var(--text-muted)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: form.waiveTurnoverRequirement ? "#1e40af" : "var(--text-primary)" }}>
                          Waive Prior Turnover Requirement
                        </div>
                        <div style={{ fontSize: "0.78rem", color: form.waiveTurnoverRequirement ? "#3b82f6" : "var(--text-muted)", marginTop: 3, lineHeight: 1.5 }}>
                          Enables early-stage startups (without ₹40L+ prior turnover) to apply. Encourages deep-tech and social-impact innovations.
                        </div>
                      </div>
                      <label style={{ position: "relative", width: 48, height: 26, cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
                        <input
                          type="checkbox"
                          checked={form.waiveTurnoverRequirement}
                          onChange={e => update("waiveTurnoverRequirement", e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                        />
                        <span style={{
                          position: "absolute", inset: 0, borderRadius: 13,
                          background: form.waiveTurnoverRequirement ? "#2563eb" : "#cbd5e1",
                          transition: "background 0.25s",
                          display: "block"
                        }} />
                        <span style={{
                          position: "absolute", top: 3, left: form.waiveTurnoverRequirement ? 26 : 3,
                          width: 20, height: 20, borderRadius: "50%", background: "#fff",
                          transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          display: "block"
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: KPIs */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Step 3 — Success KPIs</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 24 }}>Define measurable KPIs that will determine whether the pilot is successful. These must be objective and independently verifiable.</p>

            <div style={{ marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", background: "var(--surface-2)", borderRadius: "8px 0 0 0", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600 }}>KPI Name</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", background: "var(--surface-2)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600 }}>Target</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", background: "var(--surface-2)", borderRadius: "0 8px 0 0", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600 }}>Measurement Method</th>
                    <th style={{ background: "var(--surface-2)", padding: "8px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.map((kpi, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "10px 8px" }}>
                        <input className="form-input" value={kpi.name} onChange={e => updateKPI(i, "name", e.target.value)} placeholder="KPI name" style={{ fontSize: "0.875rem" }} />
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <input className="form-input" value={kpi.target} onChange={e => updateKPI(i, "target", e.target.value)} placeholder=">90%" style={{ fontSize: "0.875rem" }} />
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <input className="form-input" value={kpi.measurement} onChange={e => updateKPI(i, "measurement", e.target.value)} placeholder="How will this be measured?" style={{ fontSize: "0.875rem" }} />
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <button onClick={() => removeKPI(i)} style={{ color: "var(--danger)", padding: 4 }}><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addKPI}><Plus size={14} /> Add KPI</button>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Step 4 — Review & Publish</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 24 }}>Review your challenge before publishing. Once published, startups can discover and apply.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Challenge Title", val: form.title || "Smart Waste Management System" },
                { label: "Department", val: form.department || "Urban Development Department" },
                { label: "Location", val: form.location || "Bihar" },
                { label: "Budget", val: form.budget || "₹8,00,000" },
                { label: "Pilot Duration", val: form.pilotDuration || "60 Days" },
                { label: "Target Geography", val: form.targetGeo || "2 wards, Patna Municipal Corporation" },
              ].map((m, i) => (
                <div key={i} style={{ padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontWeight: 600 }}>{m.val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ marginBottom: 12 }}>KPIs</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kpis.map((kpi, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", flexWrap: "wrap" }}>
                    <div style={{ flex: 2, minWidth: 140 }}><span style={{ fontWeight: 600 }}>{kpi.name || `KPI ${i + 1}`}</span></div>
                    <div style={{ flex: 1, color: "var(--accent)", fontWeight: 700 }}>{kpi.target}</div>
                    <div style={{ flex: 3, color: "var(--text-secondary)", fontSize: "0.85rem" }}>{kpi.measurement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Data, IP & Cybersecurity Review Summary ── */}
            <div style={{ marginTop: 24, padding: "18px 20px", background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)", border: "1.5px solid #bfdbfe", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Shield size={17} color="#2563eb" />
                <h4 style={{ margin: 0, color: "#1e40af", fontSize: "0.95rem" }}>Data, IP & Cybersecurity Summary</h4>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                {/* IP Ownership Badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
                  background: "#dbeafe", color: "#1e40af", borderRadius: 20, fontWeight: 700, fontSize: "0.8rem", border: "1px solid #93c5fd"
                }}>
                  🔑 IP: {form.ipOwnership || "Not specified"}
                </span>

                {/* Data Localization Badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
                  background: form.dataLocalization ? "#dcfce7" : "#f1f5f9",
                  color: form.dataLocalization ? "#16a34a" : "var(--text-muted)",
                  borderRadius: 20, fontWeight: 600, fontSize: "0.8rem",
                  border: `1px solid ${form.dataLocalization ? "#86efac" : "#e2e8f0"}`
                }}>
                  🇮🇳 Data Localization: {form.dataLocalization ? "Required" : "Not required"}
                </span>

                {/* Turnover Waiver Badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
                  background: form.waiveTurnoverRequirement ? "#fef3c7" : "#f1f5f9",
                  color: form.waiveTurnoverRequirement ? "#d97706" : "var(--text-muted)",
                  borderRadius: 20, fontWeight: 600, fontSize: "0.8rem",
                  border: `1px solid ${form.waiveTurnoverRequirement ? "#fcd34d" : "#e2e8f0"}`
                }}>
                  ⚡ Turnover Requirement: {form.waiveTurnoverRequirement ? "Waived for startups" : "Standard requirement"}
                </span>

                {/* Cyber Checklist Badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
                  background: cyberPassCount === CYBER_ITEMS.length ? "#dcfce7" : cyberPassCount > 0 ? "#fef3c7" : "#fee2e2",
                  color: cyberPassCount === CYBER_ITEMS.length ? "#16a34a" : cyberPassCount > 0 ? "#d97706" : "#dc2626",
                  borderRadius: 20, fontWeight: 700, fontSize: "0.8rem",
                  border: `1px solid ${cyberPassCount === CYBER_ITEMS.length ? "#86efac" : cyberPassCount > 0 ? "#fcd34d" : "#fca5a5"}`
                }}>
                  🔒 Cyber Requirements: {cyberPassCount}/{CYBER_ITEMS.length}
                </span>
              </div>

              {/* Individual cyber items */}
              {cyberPassCount > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CYBER_ITEMS.map((item, i) => form.cyberChecklist[i] && (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "#eff6ff", color: "#1e40af", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, border: "1px solid #bfdbfe" }}>
                      <CheckCircle size={11} /> {item.split(" (")[0].split(" /")[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 24, padding: "16px", background: "#fef3c7", borderRadius: "var(--radius-md)", border: "1px solid #fcd34d" }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", lineHeight: 1.6 }}>
                <strong>Review carefully before publishing.</strong> Once a challenge is live, startups can apply. You can edit it until the first application is received.
              </p>
            </div>

            {publishError && (
              <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: "0.82rem" }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {publishError}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Previous</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary"><Save size={15} /> Save Draft</button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next: {steps[step + 1]} <ChevronRight size={15} /></button>
            ) : (
              <>
                <button className="btn btn-secondary"><Eye size={15} /> Preview</button>
                <button className="btn btn-success" onClick={handlePublish}><Send size={15} /> Publish Challenge</button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
