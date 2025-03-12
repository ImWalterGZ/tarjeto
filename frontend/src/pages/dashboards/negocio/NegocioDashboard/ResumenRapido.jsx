import React, { useEffect, useState } from "react";
import Canjes from "./Iconos/canjes.png";
import Dart from "./Iconos/dart.png";
import PerfilNeg from "./PerfilNeg";
import apiClient from "../../../../config/axios";

export default function ResumenRapido({ negocio, usuario }) {
  const [stats, setStats] = useState({
    visitasUltimaSemana: 0,
    ofertasActivas: 0,
    canjesRealizados: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get dates for last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        // Fetch visits stats using negocio's publicID
        const visitasResponse = await apiClient.get(
          `/api/visita/stats/${negocio.publicID}`,
          {
            params: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          }
        );

        // Fetch active promotions
        const promocionesResponse = await apiClient.get("/api/promocion", {
          params: {
            negocioID: negocio.publicID,
            activo: true,
          },
        });

        console.log("Visitas response:", visitasResponse.data);
        console.log("Promociones response:", promocionesResponse.data);

        // Calculate total promotion usage from visits stats
        const totalCanjes = visitasResponse.data.data.reduce((acc, day) => {
          return acc + (day.promocionesUsadas || 0);
        }, 0);

        setStats({
          visitasUltimaSemana: visitasResponse.data.data.reduce(
            (acc, day) => acc + day.totalVisitasDia,
            0
          ),
          ofertasActivas: promocionesResponse.data.data.length,
          canjesRealizados: totalCanjes,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        console.error("Error details:", error.response?.data);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error:
            error.response?.data?.message || "Error al cargar las estadísticas",
        }));
      }
    };

    if (negocio?.publicID) {
      fetchStats();
    }
  }, [negocio]);

  if (stats.loading) {
    return (
      <div className="flex flex-col mb-2 align-middle gap-16">
        <PerfilNeg
          nombre={negocio?.nombreComercial || "Cargando..."}
          fotoPerfil={negocio?.fotoPerfil}
        />
        <div>Cargando estadísticas...</div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="flex flex-col mb-2 align-middle gap-16">
        <PerfilNeg
          nombre={negocio?.nombreComercial || "Error"}
          fotoPerfil={negocio?.fotoPerfil}
        />
        <div className="text-red-500">{stats.error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-2 align-middle gap-16">
      <PerfilNeg
        nombre={negocio.nombreComercial}
        fotoPerfil={negocio.fotoPerfil}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row px-4 justify-between">
          <h3 className="text-2xl font-bold text-red-primary">
            Resumen Rapido
          </h3>
          <h4 className="self-center hover:bg-red-primary hover:text-white  transition-all border border-solid rounded-full align-center middle px-3 py-1 text-red-primary font-semibold text-sm border-red-primary">
            Ver más detalles
          </h4>
        </div>

        <div className="w-full px-4 py-3 bg-gray-100 rounded-xl font-nunito">
          <div className="flex flex-row items-center justify-between w-full h-full px-6 py-3 bg-white rounded-md drop-shadow-lg ">
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Dart} alt="" className="w-10 h-10 aspect-square" />

              <div className="flex flex-col">
                <h4>Hasta ahora</h4>
                <p className="text-3xl font-extrabold text-red-primary">
                  {stats.visitasUltimaSemana} clientes
                </p>
                <h4> te han visitado</h4>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Dart} alt="" className="w-10 h-10 aspect-square" />

              <div className="flex flex-col">
                <p className="text-3xl font-extrabold text-red-primary">
                  {stats.ofertasActivas}
                </p>
                <h4>Ofertas activas</h4>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Canjes} alt="" className="w-10 h-10 aspect-square" />
              <div className="flex flex-col">
                <h4>Se han canjeado</h4>
                <p className="text-3xl font-bold text-red-primary">
                  {stats.canjesRealizados}
                </p>
                recompensas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
