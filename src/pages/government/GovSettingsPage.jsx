import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { Settings, Bell, Shield, User, Check } from "lucide-react";

const NOTIF_PREFS = ["New applications", "Evaluation updates", "Pilot milestones", "Payment approvals", "Validation reports"];

export default function GovSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState(() => Object.fromEntries(NOTIF_PREFS.map(n => [n, true])));

  const handleSave = () => {
    updateProfile({ name, email, designation, department });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Settings</h2><p>Manage your account, notifications and department preferences.</p></div>
      <div className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><User size={20} color="var(--accent)" /><h3>Profile Settings</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Official Email</label><input className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Designation</label><input className="form-input" value={designation} onChange={e => setDesignation(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={department} onChange={e => setDepartment(e.target.value)} /></div>
              <button className="btn btn-primary" onClick={handleSave}>
                {saved ? <><Check size={15} /> Saved!</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><Bell size={20} color="var(--accent)" /><h3>Notification Preferences</h3></div>
            {NOTIF_PREFS.map(n => (
              <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.875rem" }}>{n}</span>
                <div
                  onClick={() => setToggles(t => ({ ...t, [n]: !t[n] }))}
                  style={{ width: 44, height: 24, background: toggles[n] ? "var(--success)" : "var(--border)", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.15s" }}
                >
                  <div style={{ position: "absolute", left: toggles[n] ? 23 : 3, top: 3, width: 18, height: 18, background: "#fff", borderRadius: "50%", transition: "left 0.15s" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}><Shield size={20} color="var(--accent)" /><h3>Security</h3></div>
            <button className="btn btn-secondary btn-full">Change Password</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
