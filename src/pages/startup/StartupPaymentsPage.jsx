import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { usePayments, requestMilestonePayment, fmtINR } from "../../lib/store";
import { CheckCircle, Clock, AlertCircle, IndianRupee, Send } from "lucide-react";

const statusIcon = { Paid: <CheckCircle size={16} color="var(--success)" />, "Verification Pending": <Clock size={16} color="var(--warning)" />, Upcoming: <AlertCircle size={16} color="var(--text-muted)" /> };
const statusBadge = { Paid: "badge-success", "Verification Pending": "badge-warning", Upcoming: "badge-neutral" };

export default function StartupPaymentsPage() {
  const { user } = useAuth();
  const allPayments = usePayments();
  const mine = allPayments.filter(x => x.startupName === user?.company);
  const list = mine.length ? mine : allPayments.slice(0, 1);
  const [selectedId, setSelectedId] = useState(list[0]?.pilotId);
  const p = list.find(x => x.pilotId === selectedId) || list[0];

  if (!p) {
    return (
      <DashboardLayout>
        <div className="page-header"><h2>Payments</h2><p>No pilot payment schedule yet — this appears once your pilot is approved.</p></div>
      </DashboardLayout>
    );
  }

  const paid = p.milestones.filter(m => m.status === "Paid").reduce((a, m) => a + m.amountNum, 0);
  const pending = p.milestones.filter(m => m.status === "Verification Pending").reduce((a, m) => a + m.amountNum, 0);
  const upcoming = p.milestones.filter(m => m.status === "Upcoming").reduce((a, m) => a + m.amountNum, 0);

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Payments</h2><p>Milestone-based payment tracking for your active pilot.</p></div>

      {list.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {list.map(x => (
            <button key={x.pilotId} className={`btn btn-sm ${x.pilotId === p.pilotId ? "btn-primary" : "btn-secondary"}`} onClick={() => setSelectedId(x.pilotId)}>
              {x.pilotTitle}
            </button>
          ))}
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "#dbeafe" }}><IndianRupee size={20} color="var(--accent)" /></div>
          <div className="stat-card-value" style={{ fontSize: "1.4rem" }}>{p.totalContract}</div>
          <div className="stat-card-label">Total Contract Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "#dcfce7" }}><CheckCircle size={20} color="var(--success)" /></div>
          <div className="stat-card-value" style={{ fontSize: "1.4rem", color: "var(--success)" }}>{fmtINR(paid)}</div>
          <div className="stat-card-label">Total Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "#fef3c7" }}><Clock size={20} color="var(--warning)" /></div>
          <div className="stat-card-value" style={{ fontSize: "1.4rem", color: "var(--warning)" }}>{fmtINR(pending)}</div>
          <div className="stat-card-label">Pending Verification</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "var(--bg)" }}><AlertCircle size={20} color="var(--text-muted)" /></div>
          <div className="stat-card-value" style={{ fontSize: "1.4rem", color: "var(--text-secondary)" }}>{fmtINR(upcoming)}</div>
          <div className="stat-card-label">Upcoming Payouts</div>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <h3>{p.pilotTitle}</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total: {p.totalContract}</span>
        </div>
        <div style={{ position: "relative", height: 16, background: "var(--bg)", borderRadius: 20, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(paid / p.totalContractNum) * 100}%`, background: "var(--success)", borderRadius: 20 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <span>Received: {fmtINR(paid)}</span>
          <span>Remaining: {fmtINR(pending + upcoming)}</span>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Milestone Payment Schedule</h3>
        {p.milestones.map((m, i) => (
          <div key={m.id} style={{
            display: "flex", alignItems: "center", gap: 16, padding: "16px", marginBottom: 10,
            borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
            background: m.status === "Paid" ? "#f0fdf4" : m.status === "Verification Pending" ? "#fef3c7" : "var(--surface-2)",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, background: m.status === "Paid" ? "#dcfce7" : m.status === "Verification Pending" ? "#fde68a" : "var(--bg)", color: m.status === "Paid" ? "var(--success)" : "var(--text-muted)", border: "2px solid", borderColor: m.status === "Paid" ? "var(--success)" : "var(--border)", flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{m.name}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{m.description || "Submit for verification once this milestone is delivered."}</div>
              {m.date && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Processed on {m.date}</div>}
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: m.status === "Paid" ? "var(--success)" : m.status === "Verification Pending" ? "var(--warning)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
              {m.amount}
            </div>
            <span className={`badge ${statusBadge[m.status]}`}>{m.status}</span>
            {m.status === "Upcoming" && (
              <button className="btn btn-primary btn-sm" onClick={() => requestMilestonePayment(p.pilotId, m.id)}>
                <Send size={13} /> Submit for Payment
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3>Payment History</h3></div>
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Reference No.</th><th>Status</th></tr>
            </thead>
            <tbody>
              {p.history.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td style={{ fontWeight: 700, color: "var(--success)" }}>{h.amount}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{h.reference}</td>
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
