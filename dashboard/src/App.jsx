import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import Overview from "./pages/Overview";
import Tunnels from "./pages/Tunnels";
import Logs from "./pages/Logs";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Layout from "./components/layout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontFamily: "system-ui" }}>Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/auth"        element={<AuthPage />} />
          <Route path="/dashboard"   element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/dashboard/tunnels" element={<ProtectedRoute><Tunnels /></ProtectedRoute>} />
          <Route path="/dashboard/logs"    element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/dashboard/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}