import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useValidations } from "../../lib/store";
import { CheckCircle, XCircle, Award, FileText, TrendingUp } from "lucide-react";

export default function GovValidationPage() {
  const navigate = useNavigate();
  const validations = useValidations();
  const vr = validations[0];

  if (!vr) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Validation Dashboard</h2><p>No independent validation reports yet — these appear once a pilot completes and an evaluator certifies the results.</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Validation Dashboard</h2>
        <p>Independent pilot validation results and scale-up recommendations.</p>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Award size={24} color="var(--success)" />
              <h3 style={{ color: "var(--success)" }}>Independent Pilot Validation</h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 4 }}>{vr.pilotTitle} · {vr.startupName}</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Validated by {vr.validatorName} · {vr.validatedOn}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--success)", lineHeight: 1 }}>{vr.overallScore}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>/ 100 Overall Score</div>
            <span className="badge badge-success" style={{ marginTop: 8 }}>● {vr.status}</span>
          </div>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Target vs Actual KPI Results</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {vr.kpiResults.map((kpi, i) => (
            <div key={i} style={{
              padding: "20px",
              borderRadius: "var(--radius-lg)",
              border: `1.5px solid ${kpi.passed ? "#86efac" : "#fca5a5"}`,
              background: kpi.passed ? "#f0fdf4" : "#fff1f2",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, color: "var(--text-muted)" }}>{kpi.name}</span>
                {kpi.passed
                  ? <CheckCircle size={18} color="var(--success)" />
                  : <XCircle size={18} color="var(--danger)" />}
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: kpi.passed ? "var(--success)" : "var(--danger)", marginBottom: 4 }}>
                {kpi.actual}{kpi.unit}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Target: {kpi.target}{kpi.unit} {kpi.lowerIsBetter && "(lower is better)"}
              </div>
              <span className={`badge ${kpi.passed ? "badge-success" : "badge-danger"}`} style={{ marginTop: 8 }}>
                {kpi.passed ? "✓ Passed" : "✗ Failed"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Validator Observations</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>{vr.observations || "No additional observations recorded."}</p>
      </div>

      <div className="card card-padded">
        <h3 style={{ marginBottom: 16 }}>Validation Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button className="btn btn-secondary"><FileText size={15} /> View Full Report</button>
          {vr.procurementStatus ? (
            <span className={`badge ${vr.procurementStatus === "approved" ? "badge-success" : vr.procurementStatus === "reject" ? "badge-danger" : "badge-warning"}`} style={{ padding: "8px 16px" }}>
              Procurement decision recorded: {vr.procurementStatus === "approved" ? "Scale-up Approved" : vr.procurementStatus === "reject" ? "Not Scaling" : "More Evidence Requested"}
            </span>
          ) : (
            <button className="btn btn-success" onClick={() => navigate("/government/procurement")}>
              <TrendingUp size={15} /> Recommend for Scale-up
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
