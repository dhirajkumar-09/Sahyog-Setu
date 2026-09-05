import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useValidations } from "../../lib/store";
import { CheckCircle, XCircle, Award, FileText } from "lucide-react";

export default function StartupValidationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const validations = useValidations();
  const vr = validations.find(v => v.startupName === user?.company) || validations[0];

  if (!vr) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Validation Status</h2><p>No validation report yet — this will appear once your pilot completes and is independently certified.</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Validation Status</h2><p>Independent validation results for your completed pilot.</p></div>

      <div className="card card-padded" style={{ marginBottom: 24, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Award size={28} color="var(--success)" />
              <h3 style={{ color: "var(--success)" }}>Independent Pilot Validation</h3>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{vr.pilotTitle}</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Validated by {vr.validatorName} · {vr.validatedOn}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", fontWeight: 900, color: "var(--success)", lineHeight: 1 }}>{vr.overallScore}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>/ 100</div>
            <span className="badge badge-success" style={{ marginTop: 8, fontSize: "0.85rem", padding: "4px 16px" }}>● {vr.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16, marginBottom: 24 }}>
        {vr.kpiResults.map((kpi, i) => (
          <div key={i} style={{ padding: "20px", borderRadius: "var(--radius-lg)", border: `1.5px solid ${kpi.passed ? "#86efac" : "#fca5a5"}`, background: kpi.passed ? "#f0fdf4" : "#fff1f2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, color: "var(--text-muted)" }}>{kpi.name}</span>
              {kpi.passed ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.passed ? "var(--success)" : "var(--danger)" }}>{kpi.actual}{kpi.unit}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target: {kpi.target}{kpi.unit}</div>
            <span className={`badge ${kpi.passed ? "badge-success" : "badge-danger"}`} style={{ marginTop: 8 }}>{kpi.passed ? "✓ Passed" : "✗ Failed"}</span>
          </div>
        ))}
      </div>

      <div className="card card-padded" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Validator Observations</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>{vr.observations || "No additional observations recorded."}</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-secondary"><FileText size={15} /> View Full Report</button>
        <button className="btn btn-success" onClick={() => navigate("/startup/pilots")}>
          <CheckCircle size={15} /> {vr.recommendation}
        </button>
      </div>
    </DashboardLayout>
  );
}
