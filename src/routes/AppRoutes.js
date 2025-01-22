// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../Components/layouts/PublicLayout";
import PrivateLayout from "../Components/layouts/PrivateLayout";

// Páginas Públicas
import Landing from "../pages/public/Landing";
import About from "../pages/public/About";
import Contact from "../pages/public/Contacto";
import Negocios from "../pages/public/Negocios";
import NotFound from "../pages/public/NotFound";

// Páginas Privadas (Dashboards)
import ClientDashboard from "../pages/dashboards/cliente/ClientDashboard";
import NegocioDashboard from "../pages/dashboards/negocio/NegocioDashboard";

// Componente de Protección de Rutas
import ProtectedRoute from "../Components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/negocios" element={<Negocios />} />
      </Route>

      {/* Rutas Privadas - Cliente */}
      <Route
        path="/cliente/*"
        element={
          <ProtectedRoute userType="client">
            <PrivateLayout>
              <ClientDashboard />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      {/* Rutas Privadas - Negocio */}
      <Route
        path="/negocio/*"
        element={
          <ProtectedRoute userType="business">
            <PrivateLayout>
              <NegocioDashboard />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
