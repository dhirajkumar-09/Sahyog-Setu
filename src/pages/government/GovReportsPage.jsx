import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BarChart2, FileText, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const barData = [
  { month: "Jun", applications: 18, pilots: 2 },
  { month: "Jul", applications: 24, pilots: 3 },
  { month: "Aug", applications: 31, pilots: 3 },
  { month: "Sep", applications: 22, pilots: 4 },
];
const pieData = [
  { name: "Open", value: 5, color: "#3b82f6" },
  { name: "Evaluation", value: 2, color: "#7c3aed" },
  { name: "Pilot", value: 3, color: "#06b6d4" },
  { name: "Completed", value: 2, color: "#16a34a" },
];

export default function GovReportsPage() {
  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h2>Reports</h2><p>Comprehensive reports on challenge performance, pilot outcomes and financial data.</p></div>
        <button className="btn btn-secondary"><Download size={15} /> Export Report</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card card-padded">
          <h3 style={{ marginBottom: 16 }}>Applications & Pilots by Month</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applications" fill="#3b82f6" name="Applications" radius={[4,4,0,0]} />
              <Bar dataKey="pilots" fill="#16a34a" name="Pilots" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-padded">
          <h3 style={{ marginBottom: 16 }}>Challenges by Stage</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Available Reports</h3></div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { title: "Challenge Performance Summary — Q3 2024", type: "PDF", date: "2024-09-01" },
            { title: "Startup Application Analysis — August 2024", type: "XLSX", date: "2024-09-01" },
            { title: "Pilot KPI Tracking Report — Smart Water Monitoring", type: "PDF", date: "2024-09-20" },
            { title: "Payment Disbursement Report — FY 2024-25", type: "XLSX", date: "2024-09-15" },
            { title: "Independent Validation Report — TechVision Labs", type: "PDF", date: "2024-09-20" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <FileText size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{r.date}</div>
              </div>
              <span className="badge badge-neutral">{r.type}</span>
              <button className="btn btn-secondary btn-sm"><Download size={13} /> Download</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
