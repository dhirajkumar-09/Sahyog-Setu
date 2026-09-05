import React, { useRef, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDocuments, addDocument, fulfillDocument, deleteDocument } from "../../lib/store";
import { FileText, Upload, CheckCircle, Clock, Trash2 } from "lucide-react";

const statusBadge = { Verified: "badge-success", Signed: "badge-primary", Submitted: "badge-warning", Pending: "badge-neutral" };

export default function StartupDocumentsPage() {
  const { user } = useAuth();
  const allDocs = useDocuments();
  const docs = allDocs.filter(d => d.startupName === (user?.company || "TechVision Labs"));
  const fileInputRef = useRef(null);
  const [fulfillTarget, setFulfillTarget] = useState(null);

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
    if (fulfillTarget) {
      fulfillDocument(fulfillTarget, { name: file.name, type: ext });
      setFulfillTarget(null);
    } else {
      addDocument(user?.company || "TechVision Labs", { name: file.name, type: ext });
    }
    e.target.value = "";
  };

  const triggerUpload = (targetId = null) => {
    setFulfillTarget(targetId);
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChosen} />

      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h2>Documents</h2><p>Manage all required documents for your applications and pilots.</p></div>
        <button className="btn btn-primary" onClick={() => triggerUpload(null)}><Upload size={15} /> Upload Document</button>
      </div>

      <div className="card">
        <div className="card-header"><h3>Document Vault</h3></div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.length === 0 && <p className="text-secondary text-sm">No documents yet — upload your first one above.</p>}
          {docs.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <FileText size={20} color={d.status === "Pending" ? "var(--text-muted)" : "var(--accent)"} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{d.name}</div>
                {d.date && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Uploaded: {d.date}</div>}
              </div>
              {d.type && <span className="badge badge-neutral">{d.type}</span>}
              <span className={`badge ${statusBadge[d.status] || "badge-neutral"}`}>
                {d.status === "Verified" && <CheckCircle size={11} />}
                {d.status === "Pending" && <Clock size={11} />}
                {d.status}
              </span>
              {d.status === "Pending"
                ? <button className="btn btn-primary btn-sm" onClick={() => triggerUpload(d.id)}><Upload size={13} /> Upload</button>
                : <button className="btn btn-secondary btn-sm" disabled>View</button>}
              <button className="btn btn-ghost btn-sm" onClick={() => deleteDocument(d.id)} title="Remove"><Trash2 size={14} color="var(--danger)" /></button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
