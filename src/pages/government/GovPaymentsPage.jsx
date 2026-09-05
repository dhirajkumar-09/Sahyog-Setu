import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { usePayments, approveMilestonePayment, fmtINR } from "../../lib/store";
import { CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";

const statusIcon = { Paid: <CheckCircle size={16} color="var(--success)" />, "Verification Pending": <Clock size={16} color="var(--warning)" />, Upcoming: <AlertCircle size={16} color="var(--text-muted)" /> };
const statusBadge = { Paid: "badge-success", "Verification Pending": "badge-warning", Upcoming: "badge-neutral" };

export default function GovPaymentsPage() {
  const payments = usePayments();
  const [selectedId, setSelectedId] = useState(payments[0]?.pilotId);
  const p = payments.find(x => x.pilotId === selectedId) || payments[0];

  if (!p) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Payments & Disbursements</h2><p>No pilots with a payment schedule yet.</p></div>
      </DashboardLayout>
    );
  }

  const paid = p.milestones.filter(m => m.status === "Paid").reduce((a, m) => a + m.amountNum, 0);
  const pending = p.milestones.filter(m => m.status === "Verification Pending").reduce((a, m) => a + m.amountNum, 0);
  const upcoming = p.milestones.filter(m => m.status === "Upcoming").reduce((a, m) => a + m.amountNum, 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Payments & Disbursements</h2>
        <p>Milestone-based payment tracking for all active pilots.</p>
      </div>

      {payments.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {payments.map(x => (
            <button key={x.pilotId} className={`btn btn-sm ${x.pilotId === p.pilotId ? "btn-primary" : "btn-secondary"}`} onClick={() => setSelectedId(x.pilotId)}>
              {x.pilotTitle}
            </button>
          ))}
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {[
          { label: "Total Contract Value", val: p.totalContract, color: "var(--primary)" },
          { label: "Total Disbursed", val: fmtINR(paid), color: "var(--success)" },
          { label: "Pending Verification", val: fmtINR(pending), color: "var(--warning)" },
          { label: "Upcoming Payouts", val: fmtINR(upcoming), color: "var(--text-muted)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-value" style={{ color: s.color, fontSize: "1.5rem" }}>{s.val}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3>{p.pilotTitle}</h3>
            <p className="text-sm text-secondary" style={{ marginTop: 4 }}>Total Contract: <strong>{p.totalContract}</strong> · {p.startupName}</p>
          </div>
          <CreditCard size={24} color="var(--accent)" />
        </div>

        {p.milestones.map(m => (
          <div key={m.id} className="payment-milestone">
            <div style={{ flexShrink: 0 }}>{statusIcon[m.status]}</div>
            <div className="payment-milestone-info">
              <div className="payment-milestone-name">{m.name}</div>
              <div className="payment-milestone-desc">{m.description || "Awaiting startup submission"}</div>
              {m.date && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Paid on {m.date}</div>}
            </div>
            <span className="payment-milestone-amount">{m.amount}</span>
            <span className={`badge ${statusBadge[m.status]}`}>{m.status}</span>
            {m.status === "Verification Pending" && (
              <button className="btn btn-success btn-sm" onClick={() => approveMilestonePayment(p.pilotId, m.id)}>Approve</button>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3>Payment History</h3></div>
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Reference</th><th>Status</th></tr>
            </thead>
            <tbody>
              {p.history.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td style={{ fontWeight: 700, color: "var(--success)" }}>{h.amount}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{h.reference}</td>
                  <td><span className="badge badge-success">● {h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
