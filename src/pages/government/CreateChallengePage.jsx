import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { addChallenge } from "../../lib/store";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, ChevronRight, Plus, Trash2, Save, Eye, Send, AlertCircle } from "lucide-react";

const steps = ["Problem", "Requirements", "KPIs", "Review"];

const departments = ["Urban Development Department", "Transport Department", "Rural Development Department", "Agriculture Department", "Health Department"];
const locations = ["Bihar", "Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Rajasthan", "Tamil Nadu"];

const defaultKPIs = [
  { name: "Accuracy / Effectiveness", target: ">90%", measurement: "Automated testing & validation" },
  { name: "Cost Reduction", target: ">20%", measurement: "Financial analysis vs baseline" },
  { name: "User Satisfaction", target: ">85%", measurement: "User survey" },
];

export default function CreateChallengePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [kpis, setKpis] = useState(defaultKPIs);
  const [publishError, setPublishError] = useState("");
  const [form, setForm] = useState({
    title: "", department: "", location: "", description: "", currentSituation: "", expectedOutcome: "", targetUsers: "",
    budget: "", pilotDuration: "", targetGeo: "", capabilities: "", constraints: "",
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
    });
    navigate("/government/challenges");
  };

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
