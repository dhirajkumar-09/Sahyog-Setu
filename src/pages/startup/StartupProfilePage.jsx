import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useApplications, usePilots, useValidations, fmtINR } from "../../lib/store";
import { MapPin, Users, Briefcase, Globe, Check } from "lucide-react";

const DEFAULT_ABOUT = "Tell government departments what your startup does — this shows up on your public profile.";
const DEFAULT_CAPABILITIES = ["Computer Vision", "IoT Sensor Networks", "Real-time Analytics", "Machine Learning"];

export default function StartupProfilePage() {
  const { user, updateProfile } = useAuth();
  const applications = useApplications();
  const pilots = usePilots();
  const validations = useValidations();

  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState(user?.location || "");
  const [team, setTeam] = useState(user?.team || "");
  const [founded, setFounded] = useState(user?.founded || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [about, setAbout] = useState(user?.about || DEFAULT_ABOUT);
  const [capabilitiesText, setCapabilitiesText] = useState((user?.capabilities || DEFAULT_CAPABILITIES).join(", "));
  const [saved, setSaved] = useState(false);

  const myApplications = applications.filter(a => a.startupName === user?.company);
  const myPilots = pilots.filter(p => p.startupName === user?.company);
  const myValidations = validations.filter(v => v.startupName === user?.company);
  const totalPilotValue = myPilots.reduce((s, p) => s + (p.contractValueNum || 0), 0);

  const handleSave = () => {
    updateProfile({
      location, team, founded, website, about,
      capabilities: capabilitiesText.split(",").map(s => s.trim()).filter(Boolean),
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const capabilities = user?.capabilities || DEFAULT_CAPABILITIES;

  return (
    <DashboardLayout>
      <div className="page-header"><h2>Startup Profile</h2><p>Your registered startup information on Sahyog-Setu.</p></div>
      <div className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded">
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, background: "var(--accent)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{user?.avatar}</div>
              <div>
                <h3>{user?.company}</h3>
                <p className="text-secondary text-sm">{user?.sector} {location && `· ${location}`}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span className="badge badge-success">DPIIT Recognised</span>
                  {user?.stage && <span className="badge badge-primary">{user.stage}</span>}
                </div>
              </div>
            </div>
            <div className="divider" />
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Bengaluru, Karnataka" /></div>
                <div className="form-group"><label className="form-label">Team Size</label><input className="form-input" value={team} onChange={e => setTeam(e.target.value)} placeholder="12 Members" /></div>
                <div className="form-group"><label className="form-label">Founded</label><input className="form-input" value={founded} onChange={e => setFounded(e.target.value)} placeholder="2021" /></div>
                <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={website} onChange={e => setWebsite(e.target.value)} placeholder="techvisionlabs.in" /></div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: MapPin, label: "Location", val: location || "Not set" },
                  { icon: Users, label: "Team Size", val: team || "Not set" },
                  { icon: Briefcase, label: "Founded", val: founded || "Not set" },
                  { icon: Globe, label: "Website", val: website || "Not set" },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Icon size={16} color="var(--accent)" style={{ marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{m.val}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card card-padded">
            <h4 style={{ marginBottom: 14 }}>About</h4>
            {editing ? (
              <textarea className="form-input form-textarea" rows={4} value={about} onChange={e => setAbout(e.target.value)} />
            ) : (
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.875rem" }}>{about}</p>
            )}
          </div>

          <div className="card card-padded">
            <h4 style={{ marginBottom: 14 }}>Core Capabilities</h4>
            {editing ? (
              <input className="form-input" value={capabilitiesText} onChange={e => setCapabilitiesText(e.target.value)} placeholder="Comma separated, e.g. Machine Learning, Cloud Infrastructure" />
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {capabilities.map(t => (
                  <span key={t} style={{ padding: "5px 12px", background: "#dbeafe", color: "var(--accent)", borderRadius: 20, fontSize: "0.8rem", fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card card-padded">
            <h4 style={{ marginBottom: 14 }}>Sahyog-Setu Activity</h4>
            {[
              { label: "Challenges Applied", val: myApplications.length },
              { label: "Active Pilots", val: myPilots.filter(p => p.status === "Active").length },
              { label: "Validations Completed", val: myValidations.length },
              { label: "Total Pilot Value", val: fmtINR(totalPilotValue) },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border-light)" : "none" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{m.label}</span>
                <span style={{ fontWeight: 700 }}>{m.val}</span>
              </div>
            ))}
          </div>

          <div className="card card-padded">
            <h4 style={{ marginBottom: 14 }}>DPIIT & Compliance</h4>
            {[
              { label: "DPIIT No.", val: user?.dpiit || "Not added" },
              { label: "GST No.", val: user?.gst || "Not added" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 1 ? "1px solid var(--border-light)" : "none" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{m.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 600 }}>{m.val}</span>
              </div>
            ))}
            <p className="text-sm text-secondary" style={{ marginTop: 10 }}>Update DPIIT/GST numbers from the Settings page.</p>
          </div>

          {editing ? (
            <button className="btn btn-primary btn-full" onClick={handleSave}>
              {saved ? <><Check size={15} /> Saved!</> : "Save Profile"}
            </button>
          ) : (
            <button className="btn btn-primary btn-full" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
