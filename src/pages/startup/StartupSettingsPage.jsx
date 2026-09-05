import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { Bell, Shield, User, Briefcase, Check } from "lucide-react";

const NOTIF_PREFS = ["New challenge matches", "Application status updates", "Milestone approvals", "Payment disbursements", "Validation reports", "Scale-up decisions"];

export default function StartupSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [company, setCompany] = useState(user?.company || "");
  const [dpiit, setDpiit] = useState(user?.dpiit || "");
  const [gst, setGst] = useState(user?.gst || "");
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedCompany, setSavedCompany] = useState(false);
  const [toggles, setToggles] = useState(() => Object.fromEntries(NOTIF_PREFS.map(n => [n, true])));

  const saveProfile = () => {
    updateProfile({ name, email, phone });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  };
  const saveCompany = () => {
    updateProfile({ company, dpiit, gst });
    setSavedCompany(true);
    setTimeout(() => setSavedCompany(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Settings</h2><p>Manage your startup account, notifications and platform preferences.</p></div>
      <div className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><User size={20} color="var(--accent)" /><h3>Profile Settings</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group"><label className="form-label">Founder / Contact Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" /></div>
              <button className="btn btn-primary" onClick={saveProfile}>{savedProfile ? <><Check size={15} /> Saved!</> : "Save Changes"}</button>
            </div>
          </div>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><Briefcase size={20} color="var(--accent)" /><h3>Company Details</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group"><label className="form-label">Startup Name</label><input className="form-input" value={company} onChange={e => setCompany(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">DPIIT Recognition No.</label><input className="form-input" value={dpiit} onChange={e => setDpiit(e.target.value)} placeholder="DIPP234567" /></div>
              <div className="form-group"><label className="form-label">GST Number</label><input className="form-input" value={gst} onChange={e => setGst(e.target.value)} placeholder="29AABCT1234A1ZB" /></div>
              <button className="btn btn-primary" onClick={saveCompany}>{savedCompany ? <><Check size={15} /> Saved!</> : "Save Details"}</button>
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
