# Sahyog-Setu — Government × Startup Innovation Platform

Sahyog-Setu ("Bridge of Cooperation") is a web platform that connects **government departments** with **startups** to solve real-world public problems — end to end, from posting a challenge to scaling a validated solution.

> **Note:** This is a frontend-only demo build. There is no backend server — all data (users, applications, evaluations, pilots, payments, validations) is stored in the browser's `localStorage`. It's fully functional for demos, presentations and UI/UX testing, but data does not sync across devices or browsers.

---

## 🚀 The Journey

```
Problem Posted → Startup Applies → Expert Evaluation → Pilot Execution
     → Milestone Payments → Independent Validation → Procurement / Scale-up
```

Every stage above is wired together — moving an application forward automatically creates the next record (evaluation, pilot, payment schedule, validation) and notifies the right role.

---

## 👥 Three Portals

| Role | What they do |
|---|---|
| **Government** | Post challenges, review applications, assign/track evaluations, monitor pilots & KPIs, approve milestone payments, review validation reports, make the final scale-up/procurement decision. |
| **Startup** | Discover and apply to challenges, track application status, monitor pilot progress & KPIs, submit milestones for payment, view validation results, manage documents & profile. |
| **Evaluator** | Score assigned applications against weighted criteria, submit recommendations, certify independent pilot validation reports. |

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Government | `r.singh@bihar.gov.in` | `gov@123` |
| Startup | `ankit@techvisionlabs.in` | `start@123` |
| Evaluator | `priya.nair@iitd.ac.in` | `eval@123` |

You can also register new accounts from each role's login page.

---

## 🛠️ Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **React Router v7** — client-side routing
- **Recharts** — KPI trend charts
- **Lucide React** — icons
- **localStorage-based store** (`src/lib/store.js`) — acts as the app's "database"; every page reads/writes through this one module, so swapping in a real backend later only means editing this file.

## 📂 Project Structure

```
src/
├── components/layout/     # Sidebar, top bar, notifications dropdown
├── context/AuthContext.jsx  # Login/session state
├── data/dummyData.js      # Seed data (challenges, sample pilots, etc.)
├── lib/store.js           # Core data layer + business logic + React hooks
└── pages/
    ├── public/             # Homepage, challenge browsing (no login needed)
    ├── auth/                # Login pages per role
    ├── government/          # Government dashboard & workflow pages
    ├── startup/             # Startup dashboard & workflow pages
    └── evaluator/           # Evaluator dashboard & workflow pages
```

## ⚙️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the printed localhost URL in your browser
```

To build for production:

```bash
npm run build
npm run preview
```

## ✨ Key Features

- Full application lifecycle: **Applied → Screening → Expert Evaluation → Shortlisted → Pilot → Validated**
- Auto-generated milestone payment schedules tied to each pilot's contract value
- Live, editable KPI tracking on running pilots
- Independent validation reports computed from real pilot KPI data
- Government procurement/scale-up decision workflow
- Role-based, real-time notifications (click-through to the relevant page)
- Editable profile & settings for every role, with persisted changes
- Document vault with real upload/replace/delete for startups

## 📌 Roadmap Ideas

- Real backend + database (replace `src/lib/store.js` with API calls)
- File storage for actual document uploads (currently metadata-only)
- Email/SMS notifications
- Admin/super-admin role for platform oversight

---

Built with ❤️ for transparent, accountable Government–Startup collaboration.
