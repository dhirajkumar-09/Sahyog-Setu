import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FileText, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const myScores = [
  { challenge: "Waste Mgmt", score: 82, avg: 76 },
  { challenge: "Health Records", score: 79, avg: 74 },
];

export default function EvaluatorReportsPage() {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h2>Evaluation Reports</h2><p>Summary of your evaluation activity and score distribution.</p></div>
        <button className="btn btn-secondary"><Download size={15} /> Export</button>
      </div>

      <div className="card card-padded" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>My Scores vs. Panel Average</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={myScores} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="challenge" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="score" fill="#2563eb" name="My Score" radius={[4,4,0,0]} />
            <Bar dataKey="avg" fill="#94a3b8" name="Panel Average" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><h3>Evaluation History</h3></div>
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr><th>Challenge</th><th>Startup</th><th>Date</th><th>Score</th><th>Recommendation</th><th>Action</th></tr>
            </thead>
            <tbody>
              {[
                { id: 2, challenge: "Smart Waste Management", startup: "GreenSolve Technologies", date: "2024-08-20", score: 82, rec: "Shortlist" },
                { id: 4, challenge: "Digital Health Records", startup: "DataBridge Analytics", date: "2024-10-01", score: 79, rec: "Shortlist" },
              ].map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.challenge}</td>
                  <td>{e.startup}</td>
                  <td style={{ fontSize: "0.82rem" }}>{e.date}</td>
                  <td style={{ fontWeight: 800, color: "var(--success)" }}>{e.score}/100</td>
                  <td><span className="badge badge-success">{e.rec}</span></td>
                  <td><button className="btn btn-secondary btn-sm"><FileText size={13} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
