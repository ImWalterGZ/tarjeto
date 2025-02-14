import { Routes, Route } from "react-router-dom";
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

const RedireccionarUsuarioAutentificado = ({ children }) => {
  const { usuario, autentificado, cargando } = useAuthStore();

  if (cargando) return <div>Cargando...</div>;
  if (!autentificado) return <Navigate to="/login" />;
  if (usuario.tipoUsuario === "Cliente") return <ClientDashboard />;
  if (usuario.tipoUsuario === "Negocio") return <NegocioDashboard />;
  return children;
};

function App() {
  const { revisandoAuth, revisarAuth } = useAuthStore();

  useEffect(() => {
    revisarAuth();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative
      overflow-hidden"
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="verify-email" element={<EmailVerificacion />} />
        <Route path="negocio-dashboard" element={<NegocioDashboard />} />
        <Route path="cliente-dashboard" element={<ClientDashboard />} />
        <Route path="setup-profile" element={<SetupProfile />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
