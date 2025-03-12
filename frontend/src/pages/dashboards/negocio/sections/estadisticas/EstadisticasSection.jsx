import React, { useEffect, useState } from "react";
import apiClient from "../../../../../config/axios";

export default function EstadisticasSection({ negocio }) {
  const [stats, setStats] = useState({
    visitasSemana: null,
    promociones: null,
    niveles: null,
    horasPico: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          visitasResponse,
          promocionesResponse,
          nivelesResponse,
          traficoResponse,
        ] = await Promise.all([
          apiClient.get(`/api/visita/stats/${negocio.publicID}`),
          apiClient.get(`/api/promocion/stats/${negocio.publicID}`),
          apiClient.get(`/api/programaLealtad/negocio/${negocio.publicID}`),
          apiClient.get(`/api/visita/trafico/${negocio.publicID}`),
        ]);

        setStats({
          visitasSemana: visitasResponse.data,
          promociones: promocionesResponse.data,
          niveles: nivelesResponse.data,
          horasPico: traficoResponse.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
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
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
        </div>
        <div className="flex items-center justify-center h-full">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
        </div>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{stats.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Visitas por Semana
          </h3>
          <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
            {stats.visitasSemana ? (
              <div>
                {/* Add visualization component here */}
                <p>Total de visitas: {stats.visitasSemana.totalVisitas}</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Uso de Promociones
          </h3>
          <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
            {stats.promociones ? (
              <div>
                {/* Add visualization component here */}
                <p>Promociones canjeadas: {stats.promociones.totalCanjes}</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Clientes por Nivel
          </h3>
          <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
            {stats.niveles ? (
              <div>
                {/* Add visualization component here */}
                <p>Distribución de niveles disponible</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Horas Pico
          </h3>
          <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
            {stats.horasPico ? (
              <div>
                {/* Add visualization component here */}
                <p>Datos de tráfico horario disponibles</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
