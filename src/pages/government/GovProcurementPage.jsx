import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useValidations, recordProcurementDecision } from "../../lib/store";
import { CheckCircle, TrendingUp, AlertTriangle, XCircle } from "lucide-react";

const procSteps = [
  { label: "Pilot Completed", status: "completed" },
  { label: "Independent Validation", status: "completed" },
  { label: "Validation Passed", status: "completed" },
  { label: "Scale-up Recommendation", status: "current" },
  { label: "Procurement Decision", status: "upcoming" },
];

export default function GovProcurementPage() {
  const validations = useValidations();
  const vr = validations[0];
  const [reason, setReason] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");

  if (!vr) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Procurement / Scale-up Decision</h2><p>No validated pilots are awaiting a procurement decision yet.</p></div>
      </DashboardLayout>
    );
  }

  const decision = vr.procurementStatus;
  const setDecision = (d) => recordProcurementDecision(vr.id, d, d === "reject" ? reason : d === "more-evidence" ? evidenceNote : "");

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Procurement / Scale-up Decision</h2>
        <p>Make the final procurement and scale-up decision based on validated pilot results.</p>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Sahyog-Setu Journey</h3>
        <div className="procurement-flow">
          {procSteps.map((s, i) => (
            <div key={i} className="proc-step">
              <div className={`proc-step-box ${s.status === "completed" ? "completed-step" : s.status === "current" ? "current-step" : ""}`}
                style={s.status === "upcoming" ? { background: "var(--bg)", color: "var(--text-muted)", border: "1.5px dashed var(--border)" } : {}}>
                {s.status === "completed" && "✓ "}{s.label}
              </div>
              {i < procSteps.length - 1 && <div className="proc-step-arrow">↓</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24, border: "2px solid #dbeafe", background: "#eff6ff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <TrendingUp size={28} color="var(--accent)" />
          <div>
            <h3 style={{ color: "var(--accent)" }}>{vr.pilotTitle} — {vr.startupName}</h3>
            <p className="text-sm text-secondary" style={{ marginTop: 2 }}>Based on validated pilot results — awaiting final decision.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Validation Score", val: `${vr.overallScore} / 100`, color: vr.overallScore >= 70 ? "var(--success)" : "var(--warning)" },
            { label: "KPIs Passed", val: `${vr.kpiResults.filter(k => k.passed).length} / ${vr.kpiResults.length}`, color: "var(--success)" },
            { label: "Validation Status", val: vr.status, color: vr.status === "Validated" ? "var(--success)" : "var(--danger)" },
            { label: "Department", val: vr.department, color: "var(--primary)" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "14px 16px", background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "14px 16px", background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: 20 }}>
          <h4 style={{ marginBottom: 8, fontSize: "0.95rem" }}>Validator Recommendation</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{vr.observations || vr.recommendation}</p>
        </div>

        {!decision && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-success btn-lg" onClick={() => setDecision("approved")}>
              <CheckCircle size={18} /> Approve Scale-up
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setDecision("more-evidence")}>
              <AlertTriangle size={18} /> Request More Evidence
            </button>
            <button className="btn btn-danger btn-lg" onClick={() => setDecision("reject")}>
              <XCircle size={18} /> Do Not Scale
            </button>
          </div>
        )}

        {decision === "approved" && (
          <div style={{ padding: 20, background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--success)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>
              <CheckCircle size={22} /> Scale-up Approved!
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>The procurement order will be initiated. {vr.startupName} will be notified of the scale-up decision.</p>
          </div>
        )}

        {decision === "more-evidence" && (
          <div style={{ padding: 20, background: "#fef3c7", border: "1.5px solid #fcd34d", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginBottom: 8, color: "#92400e" }}>Request Additional Evidence</h4>
            {vr.procurementReason ? (
              <p style={{ fontSize: "0.85rem", color: "#92400e" }}>Request sent: "{vr.procurementReason}"</p>
            ) : (
              <>
                <textarea className="form-input form-textarea" rows={3} placeholder="Specify what additional evidence or data is required before making a decision..." value={evidenceNote} onChange={e => setEvidenceNote(e.target.value)} style={{ marginBottom: 12 }} />
                <button className="btn btn-primary btn-sm" onClick={() => recordProcurementDecision(vr.id, "more-evidence", evidenceNote)}>Submit Request</button>
              </>
            )}
          </div>
        )}

        {decision === "reject" && (
          <div style={{ padding: 20, background: "#fff1f2", border: "1.5px solid #fca5a5", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginBottom: 8, color: "var(--danger)" }}>Reason for Not Scaling</h4>
            {vr.procurementReason ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Recorded reason: "{vr.procurementReason}"</p>
            ) : (
              <>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 12 }}>This decision will be recorded and the startup notified. Please provide a clear reason.</p>
                <textarea className="form-input form-textarea" rows={3} placeholder="State the reason for not proceeding with scale-up..." value={reason} onChange={e => setReason(e.target.value)} style={{ marginBottom: 12 }} />
                <button className="btn btn-danger btn-sm" onClick={() => recordProcurementDecision(vr.id, "reject", reason)}>Confirm Decision</button>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
