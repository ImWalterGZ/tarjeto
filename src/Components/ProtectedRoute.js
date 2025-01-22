// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>; // Puedes crear un componente de loading más elaborado
  }

  if (!user) {
    // Redirigir a login y guardar la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType && user.type !== userType) {
    // Si el usuario no tiene el tipo correcto, redirigir a su dashboard correspondiente
    return (
      <Navigate
        to={user.type === "business" ? "/negocio" : "/cliente"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
