import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getEvaluationById, submitEvaluation } from "../../lib/store";
import { Save, Send, AlertTriangle } from "lucide-react";

export default function EvaluationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const evaluation = getEvaluationById(id);

  const [scores, setScores] = useState(() => {
    const initial = {};
    evaluation?.criteria.forEach(c => { if (c.score != null) initial[c.name] = c.score; });
    return initial;
  });
  const [comments, setComments] = useState(evaluation?.comments || "");
  const [strengths, setStrengths] = useState(evaluation?.strengths || "");
  const [risks, setRisks] = useState(evaluation?.risks || "");
  const [recommendation, setRecommendation] = useState(evaluation?.recommendation || "");
  const [coi, setCoi] = useState(evaluation?.status === "Completed");
  const [submitted, setSubmitted] = useState(false);

  if (!evaluation) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: 12 }}>Evaluation not found</h2>
          <p className="text-secondary" style={{ marginBottom: 24 }}>This evaluation may have been removed or the link is incorrect.</p>
          <button className="btn btn-primary" onClick={() => navigate("/evaluator/dashboard")}>← Back to Dashboard</button>
        </div>
      </DashboardLayout>
    );
  }

  const criteria = evaluation.criteria;
  const readOnly = evaluation.status === "Completed";

  const setScore = (name, val) => {
    const criterion = criteria.find(c => c.name === name);
    const clamped = Math.min(criterion.weight, Math.max(0, parseInt(val) || 0));
    setScores(s => ({ ...s, [name]: clamped }));
  };

  const totalScore = criteria.reduce((sum, c) => sum + (scores[c.name] || 0), 0);
  const totalMax = criteria.reduce((sum, c) => sum + c.weight, 0);
  const pct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

  const handleSubmit = () => {
    const payload = {
      criteria: criteria.map(c => ({ ...c, score: scores[c.name] || 0 })),
      comments,
      strengths,
      risks,
      recommendation,
    };
    const result = submitEvaluation(evaluation.id, payload);
    if (result.ok) setSubmitted(true);
  };

  if (submitted || readOnly) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "2rem" }}>✓</div>
          <h2 style={{ marginBottom: 12 }}>{submitted ? "Evaluation Submitted!" : "Evaluation Already Submitted"}</h2>
          <p className="text-secondary" style={{ marginBottom: 24, lineHeight: 1.7 }}>
            {evaluation.challengeTitle} — {evaluation.startupName} evaluation is locked and part of the audit trail.
          </p>
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--success)" }}>{evaluation.totalScore ?? totalScore} / {totalMax}</div>
            <div style={{ color: "var(--text-secondary)", marginTop: 4 }}>Overall Score · {evaluation.recommendation || recommendation}</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/evaluator/dashboard")}>← Back to Dashboard</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Expert Evaluation</h2>
        <p>{evaluation.challengeTitle} — {evaluation.startupName} · {evaluation.department}</p>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Challenge", val: evaluation.challengeTitle },
            { label: "Startup", val: evaluation.startupName },
            { label: "Evaluator", val: user?.name || evaluation.evaluatorName },
            { label: "Deadline", val: evaluation.deadline },
          ].map((m, i) => (
            <div key={i} style={{ minWidth: 140 }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 20, border: "1px solid var(--warning-bg)", background: "#fffbeb" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: 6, color: "#92400e" }}>Conflict of Interest Declaration</h4>
            <p style={{ fontSize: "0.875rem", color: "#92400e", lineHeight: 1.6, marginBottom: 12 }}>I declare that I have no personal, financial, or professional conflict of interest with the startup being evaluated.</p>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={coi} onChange={e => setCoi(e.target.checked)} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#92400e" }}>I confirm — no conflict of interest</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3>Evaluation Criteria</h3>
          <div style={{ textAlign: "center", padding: "10px 20px", background: pct >= 80 ? "#dcfce7" : pct >= 60 ? "#fef3c7" : "#fee2e2", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)" }}>
              {totalScore} / {totalMax}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Live Total Score</div>
          </div>
        </div>

        {criteria.map(c => {
          const val = scores[c.name] || 0;
          const cPct = Math.round((val / c.weight) * 100);
          return (
            <div key={c.name} className="eval-criterion">
              <div className="eval-criterion-header">
                <div>
                  <div className="eval-criterion-name">{c.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>{c.description}</div>
                </div>
                <span className="eval-criterion-weight">Weight: {c.weight}%</span>
              </div>
              <div className="score-input-row">
                <input
                  type="number" min={0} max={c.weight} value={scores[c.name] ?? ""}
                  onChange={e => setScore(c.name, e.target.value)}
                  className="score-input" placeholder="0"
                />
                <span className="score-max">/ {c.weight}</span>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${cPct >= 80 ? "success" : cPct >= 60 ? "warning" : "primary"}`} style={{ width: `${cPct}%` }} />
                  </div>
                </div>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: cPct >= 80 ? "var(--success)" : "var(--text-secondary)", minWidth: 36, textAlign: "right" }}>{cPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card card-padded" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20 }}>Qualitative Assessment</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Key Strengths</label>
            <textarea className="form-input form-textarea" rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="What are the strongest aspects of this solution?" />
          </div>
          <div className="form-group">
            <label className="form-label">Key Risks & Concerns</label>
            <textarea className="form-input form-textarea" rows={3} value={risks} onChange={e => setRisks(e.target.value)} placeholder="What are the risks or concerns with this approach?" />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Evaluator Comments</label>
            <textarea className="form-input form-textarea" rows={4} value={comments} onChange={e => setComments(e.target.value)} placeholder="Provide a comprehensive evaluation narrative including your overall assessment..." />
          </div>
          <div className="form-group">
            <label className="form-label">Recommendation *</label>
            <select className="form-input" value={recommendation} onChange={e => setRecommendation(e.target.value)}>
              <option value="">Select Recommendation</option>
              <option value="Shortlist">Shortlist for Pilot</option>
              <option value="Waitlist">Waitlist</option>
              <option value="Reject">Do Not Shortlist</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn btn-secondary"><Save size={15} /> Save Draft</button>
        <button
          className="btn btn-primary"
          disabled={!coi || !recommendation}
          onClick={handleSubmit}
          style={{ opacity: !coi || !recommendation ? 0.5 : 1 }}
        >
          <Send size={15} /> Submit Evaluation
        </button>
      </div>
      {(!coi || !recommendation) && (
        <p style={{ textAlign: "right", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 8 }}>
          Please declare no conflict of interest and select a recommendation before submitting.
        </p>
      )}
    </DashboardLayout>
  );
}
