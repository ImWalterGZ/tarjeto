import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificacion from "./pages/Verify-email";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import NegocioDashboard from "./pages/dashboards/negocio/NegocioDashboard";
import ClientDashboard from "./pages/dashboards/cliente/ClientDashboard";
import SetupProfile from "./pages/SetUpProfile";
import { useEffect } from "react";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { usuario, autentificado, revisandoAuth } = useAuthStore();

  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-primary"></div>
      </div>
    );
  }

  if (!autentificado) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public Route Component (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const { autentificado, usuario, revisandoAuth } = useAuthStore();

  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-primary"></div>
      </div>
    );
  }

  if (autentificado) {
    if (!usuario.verificado) {
      return <Navigate to="/verify-email" />;
    }
    if (!usuario.tipoUsuario) {
      return <Navigate to="/setup-profile" />;
    }
    return <Navigate to={`/${usuario.tipoUsuario.toLowerCase()}-dashboard`} />;
  }

  return children;
};

// Verification Route Component
const VerificationRoute = ({ children }) => {
  const { usuario, autentificado, revisandoAuth } = useAuthStore();

  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-primary"></div>
      </div>
    );
  }

  if (!autentificado) {
    return <Navigate to="/login" />;
  }

  if (usuario.verificado) {
    return <Navigate to="/setup-profile" />;
  }

  return children;
};

// Setup Profile Route Component
const SetupProfileRoute = ({ children }) => {
  const { usuario, autentificado, revisandoAuth } = useAuthStore();

  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-primary"></div>
      </div>
    );
  }

  if (!autentificado) {
    return <Navigate to="/login" />;
  }

  if (!usuario.verificado) {
    return <Navigate to="/verify-email" />;
  }

  if (usuario.tipoUsuario) {
    return <Navigate to={`/${usuario.tipoUsuario.toLowerCase()}-dashboard`} />;
  }

  return children;
};

function App() {
  const { revisarAuth } = useAuthStore();

  useEffect(() => {
    revisarAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Verification Route */}
        <Route
          path="/verify-email"
          element={
            <VerificationRoute>
              <EmailVerificacion />
            </VerificationRoute>
          }
        />

        {/* Setup Profile Route */}
        <Route
          path="/setup-profile"
          element={
            <SetupProfileRoute>
              <SetupProfile />
            </SetupProfileRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/negocio-dashboard"
          element={
            <ProtectedRoute>
              <NegocioDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente-dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
