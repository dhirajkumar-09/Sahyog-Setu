import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Compass } from "lucide-react";

// Public
const HomePage = lazy(() => import("./pages/public/HomePage"));
const ChallengeDetailsPage = lazy(() => import("./pages/public/ChallengeDetailsPage"));
const PublicChallengesPage = lazy(() => import("./pages/public/PublicChallengesPage"));
const JourneyPreviewPage = lazy(() => import("./pages/public/JourneyPreviewPage"));

// Auth
const GovernmentLoginPage = lazy(() => import("./pages/auth/GovernmentLoginPage"));
const StartupLoginPage = lazy(() => import("./pages/auth/StartupLoginPage"));
const EvaluatorLoginPage = lazy(() => import("./pages/auth/EvaluatorLoginPage"));

// Government
const GovDashboard = lazy(() => import("./pages/government/GovDashboard"));
const GovChallengesPage = lazy(() => import("./pages/government/GovChallengesPage"));
const CreateChallengePage = lazy(() => import("./pages/government/CreateChallengePage"));
const GovApplicationsPage = lazy(() => import("./pages/government/GovApplicationsPage"));
const GovEvaluationPage = lazy(() => import("./pages/government/GovEvaluationPage"));
const GovPilotsPage = lazy(() => import("./pages/government/GovPilotsPage"));
const GovPaymentsPage = lazy(() => import("./pages/government/GovPaymentsPage"));
const GovValidationPage = lazy(() => import("./pages/government/GovValidationPage"));
const GovProcurementPage = lazy(() => import("./pages/government/GovProcurementPage"));
const GovReportsPage = lazy(() => import("./pages/government/GovReportsPage"));
const GovResourcesPage = lazy(() => import("./pages/government/GovResourcesPage"));
const GovSettingsPage = lazy(() => import("./pages/government/GovSettingsPage"));

// Startup
const StartupDashboard = lazy(() => import("./pages/startup/StartupDashboard"));
const StartupChallengesPage = lazy(() => import("./pages/startup/StartupChallengesPage"));
const StartupApplicationsPage = lazy(() => import("./pages/startup/StartupApplicationsPage"));
const StartupPilotsPage = lazy(() => import("./pages/startup/StartupPilotsPage"));
const StartupPaymentsPage = lazy(() => import("./pages/startup/StartupPaymentsPage"));
const StartupValidationPage = lazy(() => import("./pages/startup/StartupValidationPage"));
const StartupDocumentsPage = lazy(() => import("./pages/startup/StartupDocumentsPage"));
const StartupProfilePage = lazy(() => import("./pages/startup/StartupProfilePage"));
const StartupSettingsPage = lazy(() => import("./pages/startup/StartupSettingsPage"));

// Evaluator
const EvaluatorDashboard = lazy(() => import("./pages/evaluator/EvaluatorDashboard"));
const EvaluationScreen = lazy(() => import("./pages/evaluator/EvaluationScreen"));
const EvaluatorValidationPage = lazy(() => import("./pages/evaluator/EvaluatorValidationPage"));
const EvaluatorScorecardsPage = lazy(() => import("./pages/evaluator/EvaluatorScorecardsPage"));
const EvaluatorReportsPage = lazy(() => import("./pages/evaluator/EvaluatorReportsPage"));

function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="page-loader-spinner" />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, background: "#dbeafe", color: "#2563eb",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
      }}>
        <Compass size={32} />
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>404 — Page Not Found</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, maxWidth: 420 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, ready } = useAuth();
  if (!ready) return <PageLoader />;
  if (!user) return <Navigate to={`/login/${role}`} replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/public-challenges" element={<PublicChallengesPage />} />
        <Route path="/challenge/:id" element={<ChallengeDetailsPage />} />
        <Route path="/journey" element={<JourneyPreviewPage />} />

        {/* Auth */}
        <Route path="/login/government" element={<GovernmentLoginPage />} />
        <Route path="/login/startup" element={<StartupLoginPage />} />
        <Route path="/login/evaluator" element={<EvaluatorLoginPage />} />

        {/* Government */}
        <Route path="/government/dashboard" element={<ProtectedRoute role="government"><GovDashboard /></ProtectedRoute>} />
        <Route path="/government/challenges" element={<ProtectedRoute role="government"><GovChallengesPage /></ProtectedRoute>} />
        <Route path="/government/create-challenge" element={<ProtectedRoute role="government"><CreateChallengePage /></ProtectedRoute>} />
        <Route path="/government/applications" element={<ProtectedRoute role="government"><GovApplicationsPage /></ProtectedRoute>} />
        <Route path="/government/evaluation" element={<ProtectedRoute role="government"><GovEvaluationPage /></ProtectedRoute>} />
        <Route path="/government/pilots" element={<ProtectedRoute role="government"><GovPilotsPage /></ProtectedRoute>} />
        <Route path="/government/payments" element={<ProtectedRoute role="government"><GovPaymentsPage /></ProtectedRoute>} />
        <Route path="/government/validation" element={<ProtectedRoute role="government"><GovValidationPage /></ProtectedRoute>} />
        <Route path="/government/procurement" element={<ProtectedRoute role="government"><GovProcurementPage /></ProtectedRoute>} />
        <Route path="/government/reports" element={<ProtectedRoute role="government"><GovReportsPage /></ProtectedRoute>} />
        <Route path="/government/resources" element={<ProtectedRoute role="government"><GovResourcesPage /></ProtectedRoute>} />
        <Route path="/government/settings" element={<ProtectedRoute role="government"><GovSettingsPage /></ProtectedRoute>} />

        {/* Startup */}
        <Route path="/startup/dashboard" element={<ProtectedRoute role="startup"><StartupDashboard /></ProtectedRoute>} />
        <Route path="/startup/challenges" element={<ProtectedRoute role="startup"><StartupChallengesPage /></ProtectedRoute>} />
        <Route path="/startup/applications" element={<ProtectedRoute role="startup"><StartupApplicationsPage /></ProtectedRoute>} />
        <Route path="/startup/pilots" element={<ProtectedRoute role="startup"><StartupPilotsPage /></ProtectedRoute>} />
        <Route path="/startup/milestones" element={<ProtectedRoute role="startup"><StartupPilotsPage /></ProtectedRoute>} />
        <Route path="/startup/payments" element={<ProtectedRoute role="startup"><StartupPaymentsPage /></ProtectedRoute>} />
        <Route path="/startup/validation" element={<ProtectedRoute role="startup"><StartupValidationPage /></ProtectedRoute>} />
        <Route path="/startup/documents" element={<ProtectedRoute role="startup"><StartupDocumentsPage /></ProtectedRoute>} />
        <Route path="/startup/profile" element={<ProtectedRoute role="startup"><StartupProfilePage /></ProtectedRoute>} />
        <Route path="/startup/settings" element={<ProtectedRoute role="startup"><StartupSettingsPage /></ProtectedRoute>} />

        {/* Evaluator */}
        <Route path="/evaluator/dashboard" element={<ProtectedRoute role="evaluator"><EvaluatorDashboard /></ProtectedRoute>} />
        <Route path="/evaluator/evaluations" element={<ProtectedRoute role="evaluator"><EvaluatorDashboard /></ProtectedRoute>} />
        <Route path="/evaluator/evaluations/:id" element={<ProtectedRoute role="evaluator"><EvaluationScreen /></ProtectedRoute>} />
        <Route path="/evaluator/scorecards" element={<ProtectedRoute role="evaluator"><EvaluatorScorecardsPage /></ProtectedRoute>} />
        <Route path="/evaluator/validation" element={<ProtectedRoute role="evaluator"><EvaluatorValidationPage /></ProtectedRoute>} />
        <Route path="/evaluator/reports" element={<ProtectedRoute role="evaluator"><EvaluatorReportsPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
