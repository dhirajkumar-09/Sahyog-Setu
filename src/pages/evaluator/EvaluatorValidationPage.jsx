import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { usePilots, useValidations, submitValidation } from "../../lib/store";
import { CheckCircle, XCircle, Award, FileText, TrendingUp, ClipboardCheck } from "lucide-react";

function ValidationForm({ pilot, onSubmit }) {
  const [observations, setObservations] = useState("");
  const [recommendation, setRecommendation] = useState("Recommend for Scale-up");

  return (
    <div className="card card-padded" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <ClipboardCheck size={20} color="var(--accent)" />
        <h3>Certify Validation — {pilot.title}</h3>
      </div>
      <p className="text-sm text-secondary" style={{ marginBottom: 16 }}>
        This pulls the pilot's live KPI actuals recorded by the government team and computes an overall validation score automatically.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {pilot.kpis.map((k, i) => (
          <div key={i} style={{ padding: 12, borderRadius: "var(--radius-md)", border: `1px solid ${k.passed ? "#86efac" : "#fca5a5"}`, background: k.passed ? "#f0fdf4" : "#fff1f2" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{k.name}</div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: k.passed ? "var(--success)" : "var(--danger)" }}>{k.actual}{k.unit} <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>/ {k.target}{k.unit}</span></div>
          </div>
        ))}
      </div>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Validator Observations</label>
        <textarea className="form-input form-textarea" rows={3} value={observations} onChange={e => setObservations(e.target.value)} placeholder="Summarize field findings, data quality, and any caveats..." />
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label">Recommendation</label>
        <select className="form-input" value={recommendation} onChange={e => setRecommendation(e.target.value)}>
          <option>Recommend for Scale-up</option>
          <option>Recommend with Conditions</option>
          <option>Not Recommended</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={() => onSubmit({ observations, recommendation })}>
        <Award size={15} /> Submit Validation Report
      </button>
    </div>
  );
}

export default function EvaluatorValidationPage() {
  const { user } = useAuth();
  const pilots = usePilots();
  const validations = useValidations();

  const pilot = pilots[0];
  const vr = pilot ? validations.find(v => String(v.pilotId) === String(pilot.id)) : null;

  if (!pilot) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Independent Validation</h2><p>No pilots are ready for validation yet.</p></div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (payload) => {
    submitValidation(pilot.id, { validatorName: user?.name, ...payload });
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Independent Validation</h2>
        <p>Review and certify pilot outcome against defined KPIs.</p>
      </div>

      {!vr && <ValidationForm pilot={pilot} onSubmit={handleSubmit} />}

      {vr && (
        <>
          <div className="card card-padded" style={{ marginBottom: 24, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Award size={24} color="var(--success)" />
                  <h3 style={{ color: "var(--success)" }}>Independent Pilot Validation Report</h3>
                </div>
                <p className="text-secondary" style={{ marginBottom: 4 }}>{vr.pilotTitle} · {vr.startupName}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Validated by: {vr.validatorName} · {vr.validatedOn}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "var(--success)", lineHeight: 1 }}>{vr.overallScore}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>/ 100</div>
                <span className="badge badge-success" style={{ marginTop: 8 }}>● {vr.status}</span>
              </div>
            </div>
          </div>

          <h3 style={{ marginBottom: 16 }}>Target vs Actual — KPI Results</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {vr.kpiResults.map((kpi, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 20, padding: "16px 20px",
                borderRadius: "var(--radius-lg)", flexWrap: "wrap",
                border: `1.5px solid ${kpi.passed ? "#86efac" : "#fca5a5"}`,
                background: kpi.passed ? "#f0fdf4" : "#fff1f2",
              }}>
                <div style={{ flex: 2, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{kpi.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {kpi.lowerIsBetter ? "Lower is better" : "Higher is better"}
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>Target</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-secondary)" }}>{kpi.target}{kpi.unit}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>Actual</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: kpi.passed ? "var(--success)" : "var(--danger)" }}>{kpi.actual}{kpi.unit}</div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${kpi.passed ? "success" : "warning"}`} style={{ width: `${Math.min(100, kpi.lowerIsBetter ? (kpi.target / (kpi.actual || 1) * 100) : (kpi.actual / (kpi.target || 1) * 100))}%` }} />
                  </div>
                </div>
                <div>
                  {kpi.passed
                    ? <span className="badge badge-success"><CheckCircle size={12} /> Passed</span>
                    : <span className="badge badge-danger"><XCircle size={12} /> Failed</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="card card-padded" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Validator Observations</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>{vr.observations || "No additional observations recorded."}</p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="badge badge-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              <TrendingUp size={14} /> Recommendation: {vr.recommendation}
            </span>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
