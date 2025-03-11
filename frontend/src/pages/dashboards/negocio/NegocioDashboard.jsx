import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/isotipo-white.png";
import NavbarDashboard from "../cliente/cli-dash-comp/NavbarDash/NavbarDashboard";
import ResumenRapido from "./NegocioDashboard/ResumenRapido";
import PerfilNeg from "./NegocioDashboard/PerfilNeg";
import AccesosRapidos from "./NegocioDashboard/AccesosRapidos";
import OfertasActivas from "./NegocioDashboard/OfertasComp/OfertasActivas";
import VisitasSemana from "./NegocioDashboard/EstadisticasComp/VisitasSemana";
import { useAuthStore } from "../../../store/authStore";
import apiClient from "../../../config/axios";

function NegocioDashboard() {
  const { usuario } = useAuthStore();
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

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando datos del negocio...</p>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{dashboardData.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-red-primary flex flex-col w-screen h-screen">
      <img src={logo} className="self-center w-32 py-2 my-2" />
      <div className="flex flex-row w-full h-full">
        {" "}
        <NavbarDashboard estilo="Negocio" />
        <div className="flex flex-row gap-4 justify-between w-11/12 h-full p-10 bg-white rounded-tl-2xl rounded-tr-2xl md:flex-row p">
          <div id="leftPane" className="w-1/2 flex flex-col  gap-4">
            <ResumenRapido negocio={dashboardData.negocio} usuario={usuario} />
            <VisitasSemana negocio={dashboardData.negocio} />
          </div>
          <div id="rightPane" className="w-1/2 flex flex-col gap-3">
            <AccesosRapidos negocio={dashboardData.negocio} />

            <div className="h-full">
              <OfertasActivas negocio={dashboardData.negocio} />
            </div>
          </div>
        </div>
        <div className="w-3 h-full xl:w-.5 bg-red-primary"></div>
      </div>
    </div>
  );
}

export default NegocioDashboard;
