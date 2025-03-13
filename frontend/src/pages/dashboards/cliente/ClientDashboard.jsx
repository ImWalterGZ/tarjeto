import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/isotipo-white.png";
import RightPane from "./cli-dash-comp/rightPane/RightPane";
import LeftPane from "./cli-dash-comp/leftPane/LeftPane";
import NavbarDashboard from "./cli-dash-comp/NavbarDash/NavbarDashboard";
import { useAuthStore } from "../../../store/authStore";
import { Loader } from "lucide-react";

function ClientDashboard() {
  const navigate = useNavigate();
  const { usuario, autentificado, revisandoAuth } = useAuthStore();

  useEffect(() => {
    // Si no está revisando auth y no está autenticado, redirigir al login
    if (!revisandoAuth && !autentificado) {
      navigate("/login");
    }
  }, [autentificado, revisandoAuth, navigate]);

  // Mostrar loader mientras verifica la autenticación
  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-red-primary">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  // Si no hay usuario autenticado, no renderizar nada (la redirección se hará en el useEffect)
  if (!autentificado || !usuario) {
    return null;
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-red-primary">
      <div className="flex flex-row items-center justify-center px-6 py-2">
        <img src={logo} className="w-32" alt="Logo" />
      </div>
      <div className="flex flex-row items-center h-full">
        <NavbarDashboard estilo="cliente" />
        <div className="flex flex-col justify-between w-11/12 h-full py-5 bg-white rounded-tl-2xl rounded-tr-2xl md:flex-row">
          <LeftPane usuario={usuario} />
          <RightPane />
        </div>
        <div className="w-2 h-full bg-red-primary 2xl:w-1"></div>
      </div>
    </div>
  );
}

export default ClientDashboard;
