import React, { useEffect, useState } from "react";
import logo from "../../../assets/isotipo-white.png";
import NavbarDashboard from "../cliente/cli-dash-comp/NavbarDash/NavbarDashboard";
import { useAuthStore } from "../../../store/authStore";
import apiClient from "../../../config/axios";
import {
  InicioSection,
  OfertasSection,
  EstadisticasSection,
  NexoSection,
  MiNegocioSection,
  AjustesSection,
} from "./sections";

function NegocioDashboard() {
  const { usuario } = useAuthStore();
  const [activeSection, setActiveSection] = useState("Inicio");
  const [dashboardData, setDashboardData] = useState({
    negocio: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchNegocioData = async () => {
      if (!usuario) {
        setDashboardData({
          negocio: null,
          loading: false,
          error: "No se encontró información del usuario",
        });
        return;
      }

      try {
        // Fetch negocio profile - this endpoint uses the token to identify the user
        const negocioResponse = await apiClient.get("/api/negocio/profile");

        if (negocioResponse.data.success) {
          setDashboardData({
            negocio: negocioResponse.data.data,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(
            negocioResponse.data.message || "No se encontró el negocio asociado"
          );
        }
      } catch (error) {
        console.error("Error fetching negocio data:", error);
        setDashboardData({
          negocio: null,
          loading: false,
          error:
            error.response?.data?.message ||
            error.message ||
            "Error al cargar los datos del negocio",
        });
      }
    };

    fetchNegocioData();
  }, [usuario]);

  const renderSection = () => {
    if (dashboardData.loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p>Cargando datos del negocio...</p>
        </div>
      );
    }

    if (dashboardData.error) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{dashboardData.error}</p>
        </div>
      );
    }

    switch (activeSection) {
      case "Inicio":
        return (
          <InicioSection negocio={dashboardData.negocio} usuario={usuario} />
        );
      case "Ofertas":
        return <OfertasSection negocio={dashboardData.negocio} />;
      case "Estadísticas":
        return <EstadisticasSection negocio={dashboardData.negocio} />;
      case "Nexo":
        return <NexoSection negocio={dashboardData.negocio} />;
      case "Mi negocio":
        return <MiNegocioSection negocio={dashboardData.negocio} />;
      case "Ajustes":
        return <AjustesSection negocio={dashboardData.negocio} />;
      default:
        return (
          <InicioSection negocio={dashboardData.negocio} usuario={usuario} />
        );
    }
  };

  return (
    <div className="bg-red-primary flex flex-col w-screen h-screen">
      <img src={logo} className="self-center w-32 py-2 my-2" alt="Logo" />
      <div className="flex flex-row w-full h-full">
        <NavbarDashboard
          estilo="Negocio"
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex w-11/12 h-full p-10 bg-white rounded-tl-2xl rounded-tr-2xl">
          {renderSection()}
        </div>
        <div className="w-3 h-full xl:w-.5 bg-red-primary"></div>
      </div>
    </div>
  );
}

export default NegocioDashboard;
