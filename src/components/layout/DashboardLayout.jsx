import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, ListChecks, PlusCircle, Users, Star,
  Activity, CreditCard, CheckCircle, TrendingUp, FileText,
  BookOpen, Settings, LogOut, Bell, ChevronDown, Menu, X,
  AlertCircle, Inbox, BarChart2, CheckCheck
} from "lucide-react";
import { useNotifications, markNotificationRead, markAllNotificationsRead } from "../../lib/store";

const govNav = [
  { label: "Main", items: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/government/dashboard" },
    { icon: ListChecks, label: "Challenges", path: "/government/challenges" },
    { icon: PlusCircle, label: "Create Challenge", path: "/government/create-challenge" },
  ]},
  { label: "Process", items: [
    { icon: Inbox, label: "Applications", path: "/government/applications" },
    { icon: Star, label: "Evaluation", path: "/government/evaluation" },
    { icon: Activity, label: "Pilots", path: "/government/pilots" },
    { icon: CreditCard, label: "Payments", path: "/government/payments" },
    { icon: CheckCircle, label: "Validation", path: "/government/validation" },
    { icon: TrendingUp, label: "Procurement / Scale-up", path: "/government/procurement" },
  ]},
  { label: "Admin", items: [
    { icon: BarChart2, label: "Reports", path: "/government/reports" },
    { icon: BookOpen, label: "Resources", path: "/government/resources" },
    { icon: Settings, label: "Settings", path: "/government/settings" },
  ]},
];

const startupNav = [
  { label: "Main", items: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/startup/dashboard" },
    { icon: ListChecks, label: "Discover Challenges", path: "/startup/challenges" },
    { icon: Inbox, label: "My Applications", path: "/startup/applications" },
  ]},
  { label: "Pilots", items: [
    { icon: Activity, label: "My Pilots", path: "/startup/pilots" },
    { icon: CreditCard, label: "Payments", path: "/startup/payments" },
    { icon: Star, label: "Validation", path: "/startup/validation" },
  ]},
  { label: "Account", items: [
    { icon: FileText, label: "Documents", path: "/startup/documents" },
    { icon: Users, label: "Startup Profile", path: "/startup/profile" },
    { icon: Settings, label: "Settings", path: "/startup/settings" },
  ]},
];

const evaluatorNav = [
  { label: "Main", items: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/evaluator/dashboard" },
    { icon: ListChecks, label: "Assigned Evaluations", path: "/evaluator/evaluations" },
    { icon: FileText, label: "Scorecards", path: "/evaluator/scorecards" },
  ]},
  { label: "Post-Pilot", items: [
    { icon: CheckCircle, label: "Validation", path: "/evaluator/validation" },
    { icon: BarChart2, label: "Reports", path: "/evaluator/reports" },
  ]},
];

const navMap = { government: govNav, startup: startupNav, evaluator: evaluatorNav };

const notifIconColor = {
  application: { bg: "#dbeafe", color: "#2563eb" },
  evaluation: { bg: "#ede9fe", color: "#7c3aed" },
  shortlist: { bg: "#dcfce7", color: "#16a34a" },
  milestone: { bg: "#dcfce7", color: "#16a34a" },
  payment: { bg: "#fef3c7", color: "#d97706" },
  validation: { bg: "#dcfce7", color: "#16a34a" },
  scale: { bg: "#fee2e2", color: "#dc2626" },
  challenge: { bg: "#dbeafe", color: "#2563eb" },
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const nav = navMap[user?.role] || govNav;
  const notifs = useNotifications(user?.role);
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleNotifClick = (n) => {
    markNotificationRead(user.role, n.id);
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">SS</div>
          <div>
            <div className="sidebar-logo-text">Sahyog-Setu</div>
            <span className="sidebar-logo-sub">Government Innovation Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section">{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item${active ? " active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.avatar}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role === "government" ? user?.department : user?.role === "startup" ? user?.company : user?.organization}</div>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="dropdown-wrapper">
            <button className="notif-btn" onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>
            {notifOpen && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">
                  Notifications
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {unreadCount > 0 && <span className="badge badge-danger">{unreadCount} new</span>}
                    {notifs.length > 0 && (
                      <button className="btn btn-ghost btn-sm" style={{ padding: "2px 6px" }} onClick={() => markAllNotificationsRead(user.role)}>
                        <CheckCheck size={13} /> Mark all read
                      </button>
                    )}
                  </span>
                </div>
                {notifs.length === 0 && (
                  <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No notifications yet
                  </div>
                )}
                {notifs.map(n => {
                  const colors = notifIconColor[n.type] || { bg: "#dbeafe", color: "#2563eb" };
                  return (
                    <div key={n.id} className={`notif-item${!n.read ? " unread" : ""}`} onClick={() => handleNotifClick(n)} style={{ cursor: "pointer" }}>
                      <div className="notif-icon" style={{ background: colors.bg, color: colors.color }}>
                        <AlertCircle size={14} />
                      </div>
                      <div className="notif-text">
                        <div className="notif-message">{n.message}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sidebar-avatar" style={{ width: 34, height: 34, background: "var(--primary)" }}>{user?.avatar}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{user?.name}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{user?.role}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout} style={{ gap: 4, marginLeft: 4 }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        <main className="page-content" onClick={() => notifOpen && setNotifOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
}
