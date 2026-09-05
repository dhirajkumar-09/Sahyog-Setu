// ─── SAHYOG-SETU LOCAL DATA STORE ──────────────────────────────────────────
// This is a browser-only "database" built on localStorage. There is no
// server — every visitor's data lives only in their own browser. That's
// enough to make the ENTIRE workflow behave like a real product: login,
// signup, applying to a challenge, expert evaluation, pilot execution,
// milestone payments and independent validation all read/write here and
// stay in sync (via a custom event) across every open tab/component.
// If you later add a real backend, this file is the one place you'd swap
// out for real API calls — every page already talks only to this module.

import {
  challenges as seedChallenges,
  applications as seedApplications,
  evaluations as seedEvaluations,
  pilots as seedPilots,
  payments as seedPayments,
  validationReport as seedValidationReport,
  notifications as seedNotifications,
} from "../data/dummyData";

const KEYS = {
  USERS: "ss_users_v1",
  SESSION: "ss_session_v1",
  CHALLENGES: "ss_challenges_v1",
  APPLICATIONS: "ss_applications_v1",
  EVALUATIONS: "ss_evaluations_v2",
  PILOTS: "ss_pilots_v2",
  PAYMENTS: "ss_payments_v2",
  VALIDATIONS: "ss_validations_v2",
  NOTIFICATIONS: "ss_notifications_v1",
  DOCUMENTS: "ss_documents_v1",
};

const EVENT = "ss-store-update";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  } catch {
    // localStorage unavailable (private browsing / quota) — fail silently
  }
  return value;
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "U";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtINR(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

// ── Demo accounts (seeded once, editable/extendable through Register) ──────
const DEMO_USERS = [
  {
    id: "u-gov-demo",
    role: "government",
    name: "Rajesh Kumar Singh",
    department: "Urban Development Department",
    designation: "Deputy Secretary",
    email: "r.singh@bihar.gov.in",
    password: "gov@123",
    avatar: "RK",
  },
  {
    id: "u-startup-demo",
    role: "startup",
    name: "Ankit Sharma",
    company: "TechVision Labs",
    sector: "AI/ML",
    email: "ankit@techvisionlabs.in",
    password: "start@123",
    avatar: "AS",
  },
  {
    id: "u-eval-demo",
    role: "evaluator",
    name: "Dr. Priya Nair",
    expertise: "Technology & Innovation",
    organization: "IIT Delhi",
    email: "priya.nair@iitd.ac.in",
    password: "eval@123",
    avatar: "PN",
  },
];

export const DEMO_CREDENTIALS = {
  government: { email: DEMO_USERS[0].email, password: DEMO_USERS[0].password },
  startup: { email: DEMO_USERS[1].email, password: DEMO_USERS[1].password },
  evaluator: { email: DEMO_USERS[2].email, password: DEMO_USERS[2].password },
};

// ── Users ───────────────────────────────────────────────────────────────
export function getUsers() {
  let users = read(KEYS.USERS, null);
  if (!users) {
    users = DEMO_USERS;
    write(KEYS.USERS, users);
  }
  return users;
}

export function findUserByEmail(email) {
  const target = email.trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === target);
}

export function registerUser({ role, name, email, password, ...extra }) {
  if (!name?.trim() || !email?.trim() || !password) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (findUserByEmail(email)) {
    return { ok: false, error: "An account with this email already exists. Try logging in instead." };
  }
  const user = {
    id: `u-${Date.now()}`,
    role,
    name: name.trim(),
    email: email.trim(),
    password,
    avatar: initials(name),
    ...extra,
  };
  write(KEYS.USERS, [...getUsers(), user]);
  return { ok: true, user };
}

export function authenticate(email, password, expectedRole) {
  if (!email?.trim() || !password) {
    return { ok: false, error: "Please enter both email and password." };
  }
  const user = findUserByEmail(email);
  if (!user) {
    return { ok: false, error: "No account found with this email. Check the address or register first." };
  }
  if (user.password !== password) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }
  if (expectedRole && user.role !== expectedRole) {
    return { ok: false, error: `This email is registered as a ${user.role} account. Use the ${user.role} login instead.` };
  }
  return { ok: true, user };
}

export function updateProfile(userId, patch) {
  const users = getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
  write(KEYS.USERS, users);
  return users.find((u) => u.id === userId);
}

// ── Session ─────────────────────────────────────────────────────────────
export function getSession() {
  const session = read(KEYS.SESSION, null);
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) || null;
}

export function setSession(user) {
  write(KEYS.SESSION, { userId: user.id });
}

export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: KEYS.SESSION }));
  } catch {
    // ignore
  }
}

// ── Challenges ──────────────────────────────────────────────────────────
export function getChallenges() {
  let list = read(KEYS.CHALLENGES, null);
  if (!list) {
    list = seedChallenges;
    write(KEYS.CHALLENGES, list);
  }
  return list;
}

export function getChallengeById(id) {
  return getChallenges().find((c) => String(c.id) === String(id));
}

export function addChallenge(data) {
  const list = getChallenges();
  const id = nextId(list);
  const challenge = {
    id,
    status: "Open",
    stage: "Open",
    applications: 0,
    color: ["#3b82f6", "#8b5cf6", "#06b6d4", "#16a34a", "#dc2626", "#d97706"][id % 6],
    ...data,
  };
  write(KEYS.CHALLENGES, [challenge, ...list]);
  return challenge;
}

export function updateChallenge(id, patch) {
  const list = getChallenges().map((c) => (c.id === id ? { ...c, ...patch } : c));
  write(KEYS.CHALLENGES, list);
  return list.find((c) => c.id === id);
}

// ── Applications ────────────────────────────────────────────────────────
export function getApplications() {
  let list = read(KEYS.APPLICATIONS, null);
  if (!list) {
    list = seedApplications;
    write(KEYS.APPLICATIONS, list);
  }
  return list;
}

export function getApplicationById(id) {
  return getApplications().find((a) => String(a.id) === String(id));
}

export function hasApplied(challengeId, startupName) {
  return getApplications().some((a) => a.challengeId === challengeId && a.startupName === startupName);
}

export function addApplication({ challengeId, challengeTitle, department, startupName }) {
  const list = getApplications();
  const id = nextId(list);
  const today = todayISO();
  const app = {
    id,
    challengeId,
    challengeTitle,
    department,
    startupName,
    appliedDate: today,
    currentStage: "Applied",
    lastUpdate: today,
    status: "Applied",
    stageIndex: 0,
    matchScore: Math.floor(70 + Math.random() * 25),
  };
  write(KEYS.APPLICATIONS, [app, ...list]);

  const challenges = getChallenges().map((c) =>
    c.id === challengeId ? { ...c, applications: (c.applications || 0) + 1 } : c
  );
  write(KEYS.CHALLENGES, challenges);

  pushNotification("government", {
    type: "application",
    message: `New application received for ${challengeTitle} from ${startupName}`,
    link: "/government/applications",
  });

  return app;
}

function updateApplication(id, patch) {
  const list = getApplications().map((a) =>
    String(a.id) === String(id) ? { ...a, ...patch, lastUpdate: todayISO() } : a
  );
  write(KEYS.APPLICATIONS, list);
  return list.find((a) => String(a.id) === String(id));
}

const STAGE_INDEX = {
  Applied: 0,
  "Eligibility Screening": 1,
  "Expert Evaluation": 2,
  Shortlisted: 3,
  Pilot: 4,
  Validated: 5,
};

// Government (or the system) moves an application to the next stage of the
// pipeline. Moving an application into "Expert Evaluation" auto-creates the
// evaluation record so an evaluator has something to pick up.
export function advanceApplicationStage(applicationId, stage, status) {
  const app = getApplicationById(applicationId);
  if (!app) return null;
  const updated = updateApplication(applicationId, {
    currentStage: stage,
    status: status || stage,
    stageIndex: STAGE_INDEX[stage] ?? app.stageIndex,
  });
  if (stage === "Expert Evaluation") {
    const evalRecord = assignEvaluation(applicationId);
    if (evalRecord) {
      pushNotification("evaluator", {
        type: "evaluation",
        message: `New evaluation assigned: ${app.challengeTitle} — ${app.startupName}`,
        link: `/evaluator/evaluations/${evalRecord.id}`,
      });
    }
  }
  return updated;
}

// ── Evaluations ─────────────────────────────────────────────────────────
const DEFAULT_CRITERIA = [
  { name: "Innovation", weight: 20, description: "Novelty and creativity of the solution" },
  { name: "Technical Feasibility", weight: 25, description: "Technical soundness and implementation viability" },
  { name: "Cost Effectiveness", weight: 20, description: "Value for money and ROI" },
  { name: "Scalability", weight: 20, description: "Ability to scale across geographies" },
  { name: "Team Capability", weight: 15, description: "Team experience and capability" },
];

function seedEvaluationList() {
  // Normalize the dummy evaluations into the same shape createEvaluation() produces.
  return seedEvaluations.map((e) => ({
    evaluatorName: "Dr. Priya Nair",
    comments: "",
    strengths: "",
    risks: "",
    completedDate: e.status === "Completed" ? e.deadline : null,
    recommendation: e.recommendation === "Shortlist" ? "Shortlist" : e.recommendation || "",
    ...e,
    criteria: e.criteria.map((c) => ({ ...c })),
  }));
}

export function getEvaluations() {
  let list = read(KEYS.EVALUATIONS, null);
  if (!list) {
    list = seedEvaluationList();
    write(KEYS.EVALUATIONS, list);
  }
  return list;
}

export function getEvaluationById(id) {
  return getEvaluations().find((e) => String(e.id) === String(id));
}

// Creates a Pending evaluation for an application, if one doesn't exist yet.
export function assignEvaluation(applicationId) {
  const list = getEvaluations();
  const existing = list.find((e) => String(e.applicationId) === String(applicationId));
  if (existing) return existing;

  const app = getApplicationById(applicationId);
  if (!app) return null;
  const evaluator = getUsers().find((u) => u.role === "evaluator") || DEMO_USERS[2];
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 10);

  const evalRecord = {
    id: nextId(list),
    applicationId: app.id,
    challengeId: app.challengeId,
    challengeTitle: app.challengeTitle,
    department: app.department,
    startupName: app.startupName,
    evaluatorId: evaluator.id,
    evaluatorName: evaluator.name,
    status: "Pending",
    deadline: deadline.toISOString().slice(0, 10),
    criteria: DEFAULT_CRITERIA.map((c) => ({ ...c, score: null })),
    comments: "",
    strengths: "",
    risks: "",
    recommendation: "",
    totalScore: null,
    completedDate: null,
  };
  write(KEYS.EVALUATIONS, [evalRecord, ...list]);
  return evalRecord;
}

// Evaluator submits scores + recommendation. Automatically pushes the linked
// application forward: Shortlist -> "Shortlisted", Waitlist -> stays in
// evaluation, Reject -> "Not Selected".
export function submitEvaluation(evaluationId, { criteria, comments, strengths, risks, recommendation }) {
  const list = getEvaluations();
  const ev = list.find((e) => String(e.id) === String(evaluationId));
  if (!ev) return { ok: false, error: "Evaluation not found." };

  const totalScore = criteria.reduce((sum, c) => sum + (Number(c.score) || 0), 0);
  const updated = {
    ...ev,
    criteria,
    comments: comments || "",
    strengths: strengths || "",
    risks: risks || "",
    recommendation,
    totalScore,
    status: "Completed",
    completedDate: todayISO(),
  };
  write(KEYS.EVALUATIONS, list.map((e) => (String(e.id) === String(evaluationId) ? updated : e)));

  if (ev.applicationId) {
    if (recommendation === "Shortlist") {
      advanceApplicationStage(ev.applicationId, "Shortlisted", "Shortlisted");
      pushNotification("startup", {
        type: "shortlist",
        message: `Great news! Your application for ${ev.challengeTitle} has been shortlisted (score: ${totalScore}/100)`,
        link: "/startup/applications",
      });
    } else if (recommendation === "Waitlist") {
      updateApplication(ev.applicationId, { status: "Waitlisted" });
      pushNotification("startup", {
        type: "shortlist",
        message: `Your application for ${ev.challengeTitle} has been waitlisted`,
        link: "/startup/applications",
      });
    } else if (recommendation === "Reject") {
      updateApplication(ev.applicationId, { status: "Not Selected" });
      pushNotification("startup", {
        type: "shortlist",
        message: `Your application for ${ev.challengeTitle} was not selected this time`,
        link: "/startup/applications",
      });
    }
  }
  pushNotification("government", {
    type: "evaluation",
    message: `Evaluation completed for ${ev.challengeTitle} — ${ev.startupName} (${totalScore}/100, ${recommendation})`,
    link: "/government/evaluation",
  });
  return { ok: true, evaluation: updated };
}

// ── Pilots ──────────────────────────────────────────────────────────────
const PILOT_MILESTONE_TEMPLATE = [
  "Contract Signed",
  "Infrastructure Deployment",
  "Milestone 1 — Initial Integration",
  "Milestone 2 — Mid-Pilot Review",
  "Milestone 3 — Final Data Collection",
  "Independent Validation",
  "Scale-up Decision",
];

function seedPilotList() {
  return seedPilots.map((p) => ({ ...p, kpis: p.kpis.map((k) => ({ ...k })), milestones: p.milestones.map((m) => ({ ...m })) }));
}

export function getPilots() {
  let list = read(KEYS.PILOTS, null);
  if (!list) {
    list = seedPilotList();
    write(KEYS.PILOTS, list);
  }
  return list;
}

export function getPilotById(id) {
  return getPilots().find((p) => String(p.id) === String(id));
}

function seedPaymentList() {
  return seedPayments.map((p) => ({ ...p, milestones: p.milestones.map((m) => ({ ...m })), history: p.history.map((h) => ({ ...h })) }));
}

export function getPayments() {
  let list = read(KEYS.PAYMENTS, null);
  if (!list) {
    list = seedPaymentList();
    write(KEYS.PAYMENTS, list);
  }
  return list;
}

export function getPaymentByPilotId(pilotId) {
  return getPayments().find((p) => String(p.pilotId) === String(pilotId));
}

// Government approves a completed/shortlisted evaluation and converts it
// into a running pilot, with a milestone timeline, live KPIs (seeded from the
// challenge's own KPI targets) and a matching 4-part payment schedule.
export function approveForPilot(evaluationId) {
  const evaluations = getEvaluations();
  const ev = evaluations.find((e) => String(e.id) === String(evaluationId));
  if (!ev) return { ok: false, error: "Evaluation not found." };

  const pilots = getPilots();
  const already = pilots.find((p) => String(p.applicationId) === String(ev.applicationId));
  if (already) return { ok: true, pilot: already };

  const challenge = getChallengeById(ev.challengeId);
  const budgetNum = challenge?.budgetNum || 1000000;
  const pilotDays = parseInt(challenge?.pilotDuration) || 60;
  const end = new Date();
  end.setDate(end.getDate() + pilotDays);

  const pilot = {
    id: nextId(pilots),
    applicationId: ev.applicationId,
    challengeId: ev.challengeId,
    title: `${ev.challengeTitle} Pilot`,
    startupName: ev.startupName,
    department: ev.department,
    location: challenge?.location || "—",
    status: "Active",
    progress: 0,
    currentDay: 0,
    totalDays: pilotDays,
    startDate: todayISO(),
    endDate: end.toISOString().slice(0, 10),
    contractValue: fmtINR(budgetNum),
    contractValueNum: budgetNum,
    kpis: (challenge?.kpis || []).map((k) => ({
      name: k.name,
      target: parseFloat(String(k.target).replace(/[^\d.]/g, "")) || 0,
      actual: 0,
      unit: String(k.target).includes("%") ? "%" : "",
      passed: false,
      lowerIsBetter: false,
    })),
    milestones: PILOT_MILESTONE_TEMPLATE.map((name, i) => ({
      name,
      status: i === 0 ? "completed" : i === 1 ? "active" : "upcoming",
      date: i === 0 ? todayISO() : null,
    })),
  };
  write(KEYS.PILOTS, [pilot, ...pilots]);

  // Build a matching 4-part milestone payment schedule off the same contract value.
  const split = [0.2, 0.3, 0.2, 0.3];
  const milestoneNames = [
    "Milestone 1 — Contract & Deployment",
    "Milestone 2 — Mid-Pilot Review",
    "Milestone 3 — Final Data Collection",
    "Milestone 4 — Validation & Scale-up",
  ];
  const payment = {
    pilotId: pilot.id,
    pilotTitle: pilot.title,
    startupName: pilot.startupName,
    totalContract: fmtINR(budgetNum),
    totalContractNum: budgetNum,
    milestones: milestoneNames.map((name, i) => ({
      id: i + 1,
      name,
      amountNum: Math.round(budgetNum * split[i]),
      amount: fmtINR(Math.round(budgetNum * split[i])),
      status: i === 0 ? "Paid" : "Upcoming",
      date: i === 0 ? todayISO() : null,
      description: i === 0 ? "Contract signed, initial infrastructure deployed" : "",
    })),
    history: [
      { date: todayISO(), amount: fmtINR(Math.round(budgetNum * split[0])), reference: `SS-PAY-${Date.now()}`, status: "Success" },
    ],
  };
  write(KEYS.PAYMENTS, [payment, ...getPayments()]);

  advanceApplicationStage(ev.applicationId, "Pilot", "Active");

  pushNotification("startup", {
    type: "milestone",
    message: `🎉 ${ev.challengeTitle} approved for pilot! Contract value: ${fmtINR(budgetNum)}`,
    link: "/startup/pilots",
  });

  return { ok: true, pilot };
}

export function updateMilestoneStatus(pilotId, index, status) {
  const list = getPilots().map((p) => {
    if (String(p.id) !== String(pilotId)) return p;
    const milestones = p.milestones.map((m, i) => {
      if (i === index) return { ...m, status, date: status === "completed" ? todayISO() : m.date };
      if (i === index + 1 && status === "completed" && m.status === "upcoming") return { ...m, status: "active" };
      return m;
    });
    const completed = milestones.filter((m) => m.status === "completed").length;
    const progress = Math.round((completed / milestones.length) * 100);
    const currentDay = Math.min(p.totalDays, Math.round((progress / 100) * p.totalDays));
    const allDone = milestones.every((m) => m.status === "completed");
    return { ...p, milestones, progress, currentDay, status: allDone ? "Completed" : p.status };
  });
  write(KEYS.PILOTS, list);
  return list.find((p) => String(p.id) === String(pilotId));
}

export function updateKpiActual(pilotId, kpiIndex, actual) {
  const list = getPilots().map((p) => {
    if (String(p.id) !== String(pilotId)) return p;
    const kpis = p.kpis.map((k, i) => {
      if (i !== kpiIndex) return k;
      const numActual = parseFloat(actual) || 0;
      const passed = k.lowerIsBetter ? numActual <= k.target : numActual >= k.target;
      return { ...k, actual: numActual, passed };
    });
    return { ...p, kpis };
  });
  write(KEYS.PILOTS, list);
  return list.find((p) => String(p.id) === String(pilotId));
}

// ── Payments ────────────────────────────────────────────────────────────
// Startup marks a milestone as delivered -> moves into government's
// verification queue.
export function requestMilestonePayment(pilotId, milestoneId) {
  const list = getPayments().map((p) => {
    if (String(p.pilotId) !== String(pilotId)) return p;
    return {
      ...p,
      milestones: p.milestones.map((m) =>
        m.id === milestoneId && m.status === "Upcoming" ? { ...m, status: "Verification Pending" } : m
      ),
    };
  });
  write(KEYS.PAYMENTS, list);
  const updatedPayment = list.find((p) => String(p.pilotId) === String(pilotId));
  const milestone = updatedPayment?.milestones.find((m) => m.id === milestoneId);
  if (milestone) {
    pushNotification("government", {
      type: "payment",
      message: `${updatedPayment.startupName} submitted "${milestone.name}" for payment verification`,
      link: "/government/payments",
    });
  }
  return updatedPayment;
}

// Government approves a pending milestone -> paid, logged to history.
export function approveMilestonePayment(pilotId, milestoneId) {
  const list = getPayments().map((p) => {
    if (String(p.pilotId) !== String(pilotId)) return p;
    let paidMilestone = null;
    const milestones = p.milestones.map((m) => {
      if (m.id === milestoneId && m.status === "Verification Pending") {
        paidMilestone = { ...m, status: "Paid", date: todayISO() };
        return paidMilestone;
      }
      return m;
    });
    const history = paidMilestone
      ? [{ date: todayISO(), amount: paidMilestone.amount, reference: `SS-PAY-${Date.now()}`, status: "Success" }, ...p.history]
      : p.history;
    return { ...p, milestones, history };
  });
  write(KEYS.PAYMENTS, list);
  const updatedPayment = list.find((p) => String(p.pilotId) === String(pilotId));
  const milestone = updatedPayment?.milestones.find((m) => m.id === milestoneId);
  if (milestone && milestone.status === "Paid") {
    pushNotification("startup", {
      type: "payment",
      message: `${milestone.name} payment of ${milestone.amount} processed successfully`,
      link: "/startup/payments",
    });
  }
  return updatedPayment;
}

// ── Validations ─────────────────────────────────────────────────────────
function seedValidationList() {
  const p = getPilots()[0];
  return [
    {
      id: 1,
      pilotId: p ? p.id : 1,
      ...seedValidationReport,
      procurementStatus: null,
      procurementReason: "",
    },
  ];
}

export function getValidations() {
  let list = read(KEYS.VALIDATIONS, null);
  if (!list) {
    list = seedValidationList();
    write(KEYS.VALIDATIONS, list);
  }
  return list;
}

export function getValidationByPilotId(pilotId) {
  return getValidations().find((v) => String(v.pilotId) === String(pilotId));
}

// Evaluator/government submits the independent validation report for a
// completed pilot, comparing each KPI's live target/actual.
export function submitValidation(pilotId, { validatorName, observations, recommendation }) {
  const pilot = getPilotById(pilotId);
  if (!pilot) return { ok: false, error: "Pilot not found." };

  const kpiResults = pilot.kpis.map((k) => ({
    name: k.name,
    target: k.target,
    actual: k.actual,
    unit: k.unit,
    lowerIsBetter: k.lowerIsBetter,
    passed: k.passed,
  }));
  const passedCount = kpiResults.filter((k) => k.passed).length;
  const overallScore = kpiResults.length ? Math.round((passedCount / kpiResults.length) * 100) : 0;

  const list = getValidations();
  const record = {
    id: nextId(list),
    pilotId: pilot.id,
    pilotTitle: pilot.title,
    startupName: pilot.startupName,
    department: pilot.department,
    location: pilot.location,
    validatedOn: todayISO(),
    validatorName: validatorName || "Independent Validator",
    overallScore,
    status: overallScore >= 70 ? "Validated" : "Not Validated",
    kpiResults,
    observations: observations || "",
    recommendation: recommendation || (overallScore >= 70 ? "Recommend for Scale-up" : "Not Recommended"),
    procurementStatus: null,
    procurementReason: "",
  };
  write(KEYS.VALIDATIONS, [record, ...list.filter((v) => String(v.pilotId) !== String(pilotId))]);
  const milestoneIndex = pilot.milestones.findIndex((m) => m.name === "Independent Validation");
  if (milestoneIndex >= 0) updateMilestoneStatus(pilotId, milestoneIndex, "completed");

  pushNotification("government", {
    type: "validation",
    message: `Validation report available for ${pilot.title} — Score: ${overallScore}/100`,
    link: "/government/validation",
  });
  pushNotification("startup", {
    type: "validation",
    message: `Independent validation completed for ${pilot.title} — Score: ${overallScore}/100 (${record.status})`,
    link: "/startup/validation",
  });

  return { ok: true, validation: record };
}

// Government's final procurement / scale-up decision on a validation report.
export function recordProcurementDecision(validationId, decision, reason) {
  const list = getValidations().map((v) =>
    String(v.id) === String(validationId) ? { ...v, procurementStatus: decision, procurementReason: reason || "" } : v
  );
  write(KEYS.VALIDATIONS, list);
  const updated = list.find((v) => String(v.id) === String(validationId));
  if (updated) {
    const messages = {
      approved: `🎉 Scale-up approved for ${updated.pilotTitle}! Procurement process will begin shortly.`,
      "more-evidence": `Government has requested more evidence for ${updated.pilotTitle} before a scale-up decision.`,
      reject: `Decision: ${updated.pilotTitle} will not be scaled up at this time.`,
    };
    pushNotification("startup", { type: "scale", message: messages[decision] || `Procurement decision recorded for ${updated.pilotTitle}`, link: "/startup/validation" });
  }
  return updated;
}

// ── Notifications ───────────────────────────────────────────────────────
// A tiny per-role inbox. Every meaningful pipeline event (someone applies,
// an evaluation is scored, a milestone gets paid, a pilot gets validated...)
// pushes a real notification here, so the bell icon actually reflects what
// just happened instead of showing static copy.
function seedNotificationState() {
  return {
    government: seedNotifications.government.map((n) => ({ ...n, link: null })),
    startup: seedNotifications.startup.map((n) => ({ ...n, link: null })),
    evaluator: [],
  };
}

export function getNotifications() {
  let state = read(KEYS.NOTIFICATIONS, null);
  if (!state) {
    state = seedNotificationState();
    write(KEYS.NOTIFICATIONS, state);
  }
  return state;
}

function timeAgoLabel() {
  return "Just now";
}

export function pushNotification(role, { type, message, link }) {
  const state = getNotifications();
  const list = state[role] || [];
  const notif = { id: Date.now() + Math.random(), type, message, link: link || null, time: timeAgoLabel(), read: false };
  const updated = { ...state, [role]: [notif, ...list].slice(0, 30) };
  write(KEYS.NOTIFICATIONS, updated);
  return notif;
}

export function markNotificationRead(role, id) {
  const state = getNotifications();
  const updated = { ...state, [role]: (state[role] || []).map((n) => (n.id === id ? { ...n, read: true } : n)) };
  write(KEYS.NOTIFICATIONS, updated);
  return updated[role];
}

export function markAllNotificationsRead(role) {
  const state = getNotifications();
  const updated = { ...state, [role]: (state[role] || []).map((n) => ({ ...n, read: true })) };
  write(KEYS.NOTIFICATIONS, updated);
  return updated[role];
}

// ── Documents ───────────────────────────────────────────────────────────
const SEED_DOCUMENTS = [
  { name: "Certificate of Incorporation", status: "Verified", date: "2024-07-01", type: "PDF" },
  { name: "DPIIT Startup Recognition Certificate", status: "Verified", date: "2024-07-01", type: "PDF" },
  { name: "GST Registration Certificate", status: "Verified", date: "2024-07-01", type: "PDF" },
  { name: "Cancelled Cheque / Bank Account Proof", status: "Verified", date: "2024-07-10", type: "PDF" },
  { name: "Pilot Contract — Smart Water Monitoring", status: "Signed", date: "2024-06-28", type: "PDF" },
  { name: "Milestone 1 Completion Report", status: "Submitted", date: "2024-08-01", type: "PDF" },
  { name: "Milestone 2 Completion Report", status: "Verified", date: "2024-08-28", type: "PDF" },
  { name: "Milestone 3 Completion Report", status: "Pending", date: null, type: null },
];

function seedDocumentList() {
  return SEED_DOCUMENTS.map((d, i) => ({ id: i + 1, startupName: "TechVision Labs", ...d }));
}

export function getDocuments() {
  let list = read(KEYS.DOCUMENTS, null);
  if (!list) {
    list = seedDocumentList();
    write(KEYS.DOCUMENTS, list);
  }
  return list;
}

export function addDocument(startupName, { name, type }) {
  const list = getDocuments();
  const doc = { id: nextId(list), startupName, name, type: type || "PDF", status: "Submitted", date: todayISO() };
  write(KEYS.DOCUMENTS, [doc, ...list]);
  return doc;
}

// Fills in a placeholder "Pending" document row (e.g. a milestone report
// that hasn't been submitted yet) once the startup uploads it.
export function fulfillDocument(id, { name, type }) {
  const list = getDocuments().map((d) =>
    d.id === id ? { ...d, name: name || d.name, type: type || "PDF", status: "Submitted", date: todayISO() } : d
  );
  write(KEYS.DOCUMENTS, list);
  return list.find((d) => d.id === id);
}

export function deleteDocument(id) {
  write(KEYS.DOCUMENTS, getDocuments().filter((d) => d.id !== id));
}

// ── React hooks: keep components in sync with the store ────────────────
import { useState, useEffect, useCallback } from "react";

function useLiveValue(getter, watchKey) {
  const [value, setValue] = useState(getter);

  const refresh = useCallback(() => setValue(getter()), [getter]);

  useEffect(() => {
    const handler = (e) => {
      if (!watchKey || !e.detail || e.detail === watchKey) refresh();
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [refresh, watchKey]);

  return value;
}

export function useChallenges() {
  return useLiveValue(getChallenges, KEYS.CHALLENGES);
}

export function useApplications() {
  return useLiveValue(getApplications, KEYS.APPLICATIONS);
}

export function useEvaluations() {
  return useLiveValue(getEvaluations, KEYS.EVALUATIONS);
}

export function usePilots() {
  return useLiveValue(getPilots, KEYS.PILOTS);
}

export function usePayments() {
  return useLiveValue(getPayments, KEYS.PAYMENTS);
}

export function useValidations() {
  return useLiveValue(getValidations, KEYS.VALIDATIONS);
}

export function useNotifications(role) {
  const state = useLiveValue(getNotifications, KEYS.NOTIFICATIONS);
  return state[role] || [];
}

export function useDocuments() {
  return useLiveValue(getDocuments, KEYS.DOCUMENTS);
}
