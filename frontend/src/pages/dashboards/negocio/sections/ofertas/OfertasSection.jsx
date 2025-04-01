import React, { useState, useCallback, useEffect } from "react";
import PromoDrawer from "../../../../../components/promociones/PromoDrawer";
import PromoCreator from "../../../../../components/promociones/PromoCreator";
import PromoList from "../../../../../components/promociones/PromoList";
import apiClient from "../../../../../config/axios";
import { FiEye, FiPlusCircle } from "react-icons/fi";

// Stats View Component
const StatsView = ({ negocio, refreshTrigger }) => {
  const [stats, setStats] = useState({
    ofertasActivas: {
      promociones: 0,
      cupones: 0,
      recompensas: 0,
      eventos: 0,
    },
    tasaDeUso: {
      promociones: 0,
      cupones: 0,
    },
    ofertasQueExpiran: [],
    cupones: [],
    eventos: [],
    recompensas: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Reset state when refreshTrigger changes to ensure clean data
    setStats((prevStats) => ({ ...prevStats, loading: true, error: null }));

    const fetchStats = async () => {
      console.log("Starting to fetch stats with negocio:", negocio);

      // Validate negocio.publicID before attempting API calls
      if (!negocio?.publicID) {
        console.error("Missing negocio.publicID - cannot fetch stats");
        setStats((prevStats) => ({
          ...prevStats,
          loading: false,
          error: "No se puede cargar las estadísticas: falta ID del negocio",
        }));
        return;
      }

      try {
        // Fetch all data with proper error handling for each request
        console.log(
          "Fetching loyalty program for business ID:",
          negocio.publicID
        );
        let promocionesData = [];
        let statsData = null;
        let programaLealtadData = null;

        try {
          const programaLealtadResponse = await apiClient.get(
            `/programa-lealtad/negocio/${negocio.publicID}`
          );
          console.log(
            "Programa lealtad response:",
            programaLealtadResponse.data
          );

          // Validate the response format
          if (
            programaLealtadResponse.data &&
            programaLealtadResponse.data.success
          ) {
            programaLealtadData = programaLealtadResponse.data.data || {
              niveles: [],
            };

            // Extract promotions directly from loyalty program levels
            if (
              programaLealtadData.niveles &&
              Array.isArray(programaLealtadData.niveles)
            ) {
              promocionesData = [];

              // Get all promociones from all niveles
              programaLealtadData.niveles.forEach((nivel) => {
                if (
                  nivel.promocionesAsignadas &&
                  Array.isArray(nivel.promocionesAsignadas)
                ) {
                  nivel.promocionesAsignadas.forEach((promo) => {
                    if (promo.activa && promo.promocionID) {
                      // Add the nivel info to the promocion object
                      promocionesData.push({
                        ...promo.promocionID,
                        nivelAsignado: nivel.nivel,
                        nombreNivel: nivel.nombre,
                      });
                    }
                  });
                }
              });

              console.log(
                "Extracted promotions from programa lealtad:",
                promocionesData.length
              );
            }
          } else {
            console.warn(
              "Unexpected programa lealtad response format:",
              programaLealtadResponse.data
            );
            programaLealtadData = { niveles: [] };
          }
        } catch (lealtadError) {
          console.error("Error fetching loyalty program:", lealtadError);
          // Use default loyalty program data
          programaLealtadData = { niveles: [] };
        }

        // Fetch stats for this business if needed
        try {
          const statsResponse = await apiClient.get(
            `/promocion/stats/${negocio.publicID}`
          );
          console.log("Stats response:", statsResponse.data);

          // Validate the response format
          if (statsResponse.data && statsResponse.data.success) {
            statsData = statsResponse.data.data || {
              estadisticasUso: { totalVistas: 0, totalUsos: 0 },
            };
          } else {
            console.warn(
              "Unexpected stats response format:",
              statsResponse.data
            );
            statsData = { estadisticasUso: { totalVistas: 0, totalUsos: 0 } };
          }
        } catch (statsError) {
          console.error("Error fetching stats:", statsError);
          // Use default stats
          statsData = { estadisticasUso: { totalVistas: 0, totalUsos: 0 } };
        }

        console.log("Promotions data from loyalty program:", promocionesData);

        if (!Array.isArray(promocionesData)) {
          console.error("Promociones data is not an array:", promocionesData);
          promocionesData = [];
        }

        // Group promotions by type with validation
        const cupones = promocionesData.filter(
          (p) => p.tipoPromo && p.tipoPromo.tipo === "cupon"
        );
        const eventos = promocionesData.filter(
          (p) => p.tipoPromo && p.tipoPromo.tipo === "evento"
        );
        const recompensas = promocionesData.filter(
          (p) => p.tipoPromo && p.tipoPromo.tipo === "recompensa"
        );
        const promociones = promocionesData.filter(
          (p) =>
            (p.tipoPromo && p.tipoPromo.tipo === "promocion") ||
            (p.tipoPromo && p.tipoPromo.tipo === "PROGRAMA")
        );

        console.log("Grouped by type:", {
          cupones: cupones.length,
          eventos: eventos.length,
          recompensas: recompensas.length,
          promociones: promociones.length,
        });

        // Expiring soon (within 3 days) with validation
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        console.log("Looking for offers expiring before:", threeDaysFromNow);

        const ofertasQueExpiran = promocionesData.filter((p) => {
          if (
            p.tipoPromo &&
            p.tipoPromo.periodo &&
            p.tipoPromo.periodo.fechaFin
          ) {
            try {
              const fechaFin = new Date(p.tipoPromo.periodo.fechaFin);
              return fechaFin <= threeDaysFromNow;
            } catch (e) {
              console.error(
                "Invalid date format for fechaFin:",
                p.tipoPromo.periodo.fechaFin
              );
              return false;
            }
          }
          return false;
        });

        console.log("Offers expiring soon:", ofertasQueExpiran);

        // Calculate usage rates with safe division
        let promocionesUsageRate = 0;
        let cuponesUsageRate = 0;

        if (
          statsData &&
          statsData.estadisticasUso &&
          statsData.estadisticasUso.totalVistas > 0
        ) {
          promocionesUsageRate = Math.round(
            (statsData.estadisticasUso.totalUsos /
              statsData.estadisticasUso.totalVistas) *
              100
          );
        }

        if (cupones.length > 0) {
          const totalCuponViews = cupones.reduce(
            (sum, c) => sum + (c.analitica?.vistas || 0),
            0
          );

          if (totalCuponViews > 0) {
            cuponesUsageRate = Math.round(
              (cupones.reduce((sum, c) => sum + (c.analitica?.usos || 0), 0) /
                totalCuponViews) *
                100
            );
          }
        }

        console.log("Calculated usage rates:", {
          promociones: promocionesUsageRate,
          cupones: cuponesUsageRate,
        });

        // Prepare statistics about loyalty program levels
        const nivelStats = {};
        if (
          programaLealtadData.niveles &&
          Array.isArray(programaLealtadData.niveles)
        ) {
          programaLealtadData.niveles.forEach((nivel) => {
            const activePromos = nivel.promocionesAsignadas
              ? nivel.promocionesAsignadas.filter((p) => p.activa).length
              : 0;

            nivelStats[nivel.nivel] = {
              nombre: nivel.nombre,
              nivel: nivel.nivel,
              promocionesActivas: activePromos,
              visitasRequeridas: nivel.visitasRequeridas,
              clientesActuales: nivel.clientesActuales || 0,
            };
          });
        }

        const newStats = {
          ofertasActivas: {
            promociones: promociones.length,
            cupones: cupones.length,
            recompensas: recompensas.length,
            eventos: eventos.length,
          },
          tasaDeUso: {
            promociones: promocionesUsageRate,
            cupones: cuponesUsageRate,
          },
          ofertasQueExpiran,
          cupones: cupones.sort(
            (a, b) => (a.nivelReq || 0) - (b.nivelReq || 0)
          ),
          eventos,
          recompensas: recompensas.sort(
            (a, b) => (a.nivelReq || 0) - (b.nivelReq || 0)
          ),
          promociones: promociones,
          niveles: programaLealtadData?.niveles || [],
          nivelStats,
          temporadaActual: programaLealtadData?.temporadaActual,
          loading: false,
          error: null,
        };

        console.log("Setting stats to:", newStats);
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching offer stats:", error);
        console.error("Error details:", error.response?.data || error.message);
        setStats((prevStats) => ({
          ...prevStats,
          loading: false,
          error:
            error.response?.data?.message || "Error al cargar las estadísticas",
        }));
      }
    };

    fetchStats();
  }, [negocio, refreshTrigger]);

  console.log("Rendering StatsView with stats:", stats);

  if (stats.loading) {
    console.log("StatsView is in loading state");
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-primary mx-auto mb-2"></div>
        <div>Cargando estadísticas de ofertas...</div>
      </div>
    );
  }

  if (stats.error) {
    console.log("StatsView encountered an error:", stats.error);
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        <div className="font-bold mb-2">Error</div>
        <div>{stats.error}</div>
        <button
          onClick={() =>
            setStats((prevStats) => ({
              ...prevStats,
              loading: true,
              error: null,
            }))
          }
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Helper function to get nivel nombre
  const getNivelName = (nivelReq) => {
    const nivelMap = {
      0: "Todos",
      1: "Bronce",
      2: "Plata",
      3: "Oro",
      4: "Rubí",
    };
    return nivelMap[nivelReq] || "Desconocido";
  };

  // Helper to get day name from day number
  const getDayName = (dayNumber) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[dayNumber] || "Día desconocido";
  };

  // Helper to get nivel count by nivelReq
  const getNivelCount = (items, nivel) => {
    if (!Array.isArray(items)) return 0;

    // First check if we have the precomputed stats
    if (stats.nivelStats && stats.nivelStats[nivel]) {
      return stats.nivelStats[nivel].promocionesActivas;
    }

    // Fall back to the old count method
    const count = items.filter(
      (item) => item && item.nivelReq === nivel
    ).length;
    console.log(`getNivelCount for level ${nivel}:`, count);
    return count;
  };

  console.log(
    "StatsView rendering content with cupones:",
    stats.cupones.length
  );
  console.log(
    "StatsView rendering content with recompensas:",
    stats.recompensas.length
  );
  console.log(
    "StatsView rendering content with eventos:",
    stats.eventos.length
  );

  return (
    <div className="flex flex-col w-full gap-4 pb-8 ">
      <div className="flex flex-row w-full gap-6">
        {/* LEFT COLUMN */}
        <div className="w-1/2 flex flex-col gap-4 ">
          {/* Todas tus ofertas activas */}
          <div className="bg-gray-background rounded-xl p-4 shadow">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-xl">
                <div className="rounded-full bg-red-primary p-3 mb-2">
                  <FiPlusCircle className="text-white text-xl" />
                </div>
                <span className="text-lg font-bold">Crear promo</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-xl">
                <div className="rounded-full bg-red-primary p-3 mb-2">
                  <FiPlusCircle className="text-white text-xl" />
                </div>
                <span className="text-lg font-bold">Crear cupón</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-xl">
                <div className="rounded-full bg-red-primary p-3 mb-2">
                  <FiPlusCircle className="text-white text-xl" />
                </div>
                <span className="text-lg font-bold">Crear recompensa</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-xl">
                <div className="rounded-full bg-red-primary p-3 mb-2">
                  <FiPlusCircle className="text-white text-xl" />
                </div>
                <span className="text-lg font-bold">Crear evento</span>
              </div>
            </div>
          </div>

          {/* Resumen section */}
          <h3 className="text-xl font-semibold text-red-primary">Resumen</h3>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="grid grid-cols-3 gap-4">
              {/* Ofertas activas por tipo */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Ofertas activas por tipo</h4>
                <ul>
                  <li className="flex items-center gap-2 py-1">
                    <span className="flex-shrink-0 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      ⊕
                    </span>
                    <span>Promociones:</span>
                    <span className="font-semibold ml-auto">
                      {stats.ofertasActivas.promociones}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 py-1">
                    <span className="flex-shrink-0 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      ⊕
                    </span>
                    <span>Cupones:</span>
                    <span className="font-semibold ml-auto">
                      {stats.ofertasActivas.cupones}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 py-1">
                    <span className="flex-shrink-0 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      ⊕
                    </span>
                    <span>Recompensas:</span>
                    <span className="font-semibold ml-auto">
                      {stats.ofertasActivas.recompensas}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 py-1">
                    <span className="flex-shrink-0 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      ⊕
                    </span>
                    <span>Eventos:</span>
                    <span className="font-semibold ml-auto">
                      {stats.ofertasActivas.eventos}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tasa de uso */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Tasa de uso de ofertas</h4>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Promociones</span>
                    <span className="text-red-600 font-bold">
                      {stats.tasaDeUso.promociones}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${stats.tasaDeUso.promociones}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Cupones</span>
                    <span className="text-red-600 font-bold">
                      {stats.tasaDeUso.cupones}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${stats.tasaDeUso.cupones}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Ofertas que expiran pronto */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Ofertas que expiran pronto</h4>
                {stats.ofertasQueExpiran.length === 0 ? (
                  <p className="text-gray-500">
                    No hay ofertas que expiren próximamente
                  </p>
                ) : (
                  <div>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.ofertasQueExpiran.length}
                    </p>
                    <p>Ofertas expiran en los próximos 3 días.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Eventos section */}
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-red-600">
                Eventos ({stats.eventos.length})
              </h3>
              <button className="text-sm text-red-600 hover:text-red-800 rounded-full border border-red-600 px-4 py-1">
                Ver todos
              </button>
            </div>

            {stats.eventos.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">No hay eventos programados</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h5 className="font-medium mb-2">
                      {stats.eventos[0].titulo || "Event name"}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {stats.eventos[0].descripcion || "Event description"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                      </svg>
                    </button>
                    <button className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium w-max mt-2">
                  {stats.eventos[0].tipoPromo?.periodo?.fechaInicio
                    ? `${new Date(
                        stats.eventos[0].tipoPromo.periodo.fechaInicio
                      ).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}, ${
                        stats.eventos[0].tipoPromo?.periodo?.horaInicio || ""
                      } - ${stats.eventos[0].tipoPromo?.periodo?.horaFin || ""}`
                    : "Fecha no disponible"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Ofertas para cada nivel */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Ofertas para cada nivel
            </h3>

            <div className="flex flex-row gap-2 bg-gray-50 p-4 rounded-lg">
              {stats.niveles &&
                stats.niveles.map((nivel, index) => (
                  <div key={index} className="text-center p-2 flex-1">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-2 ${
                        nivel.nivel === 1
                          ? "bg-amber-800 text-white"
                          : nivel.nivel === 2
                          ? "bg-gray-400 text-white"
                          : nivel.nivel === 3
                          ? "bg-yellow-500 text-white"
                          : nivel.nivel === 4
                          ? "bg-red-700 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <span>★</span>
                    </div>
                    <span>{nivel.nombre}</span>
                    <div className="text-2xl font-bold text-red-600">
                      {nivel.promocionesAsignadas?.filter((p) => p.activa)
                        .length || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      {nivel.clientesActuales || 0} clientes
                    </div>
                  </div>
                ))}
              {(!stats.niveles || stats.niveles.length === 0) && (
                <div className="text-center p-2 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 mx-auto mb-2">
                    <span className="text-gray-700">★</span>
                  </div>
                  <span>Sin niveles</span>
                  <div className="text-2xl font-bold text-red-600">0</div>
                </div>
              )}
            </div>
          </div>

          {/* Temporada Actual section */}
          {stats.temporadaActual && (
            <div className="bg-white rounded-xl p-4 shadow mb-4">
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Temporada Actual
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Periodo</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        stats.temporadaActual.fechaInicio
                      ).toLocaleDateString("es-ES")}{" "}
                      -{" "}
                      {new Date(
                        stats.temporadaActual.fechaFin
                      ).toLocaleDateString("es-ES")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duración: {stats.temporadaActual.duracionMeses} meses
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Estadísticas</h4>
                    <p className="text-sm text-gray-600">
                      Visitas totales:{" "}
                      {stats.temporadaActual.estadisticas?.visitasTotales || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Promociones canjeadas:{" "}
                      {stats.temporadaActual.estadisticas
                        ?.promocionesCanjeadas || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cupones */}
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-red-600">
                Cupones ({stats.cupones.length})
              </h3>
              <button className="text-sm text-red-600 hover:text-red-800 rounded-full border border-red-600 px-4 py-1">
                Ver todos
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.cupones.slice(0, 4).map((cupon, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-medium">{cupon.titulo || "Cupón"}</h5>
                    <div className="flex gap-2">
                      <button className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                        </svg>
                      </button>
                      <button className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {cupon.descripcion || "Sin descripción"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        (cupon.nivelAsignado || cupon.nivelReq) === 0
                          ? "bg-gray-200 text-gray-800"
                          : (cupon.nivelAsignado || cupon.nivelReq) === 1
                          ? "bg-amber-100 text-amber-800"
                          : (cupon.nivelAsignado || cupon.nivelReq) === 2
                          ? "bg-gray-200 text-gray-700"
                          : (cupon.nivelAsignado || cupon.nivelReq) === 3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(cupon.nivelAsignado || cupon.nivelReq) === 0
                        ? "Para todos los usuarios"
                        : `Solo para usuarios ${
                            cupon.nombreNivel || getNivelName(cupon.nivelReq)
                          }`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {cupon.analitica?.usos || 0}/
                      {cupon.analitica?.limite ||
                        cupon.limiteDeUsos?.totalGlobal ||
                        50}
                    </span>
                  </div>
                </div>
              ))}

              {stats.cupones.length === 0 && (
                <div className="col-span-2 bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  No hay cupones activos
                </div>
              )}
            </div>
          </div>

          {/* Recompensas section */}
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-red-600">
                Recompensas ({stats.recompensas.length})
              </h3>
              <button className="text-sm text-red-600 hover:text-red-800 rounded-full border border-red-600 px-4 py-1">
                Ver todas
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.recompensas &&
                Array.isArray(stats.recompensas) &&
                stats.recompensas.slice(0, 4).map((recompensa, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium">
                        {recompensa.titulo || "Recompensa"}
                      </h5>
                      <div className="flex gap-2">
                        <button className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                          </svg>
                        </button>
                        <button className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {recompensa.descripcion || "Sin descripción"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          (recompensa.nivelAsignado || recompensa.nivelReq) ===
                          0
                            ? "bg-gray-200 text-gray-800"
                            : (recompensa.nivelAsignado ||
                                recompensa.nivelReq) === 1
                            ? "bg-amber-100 text-amber-800"
                            : (recompensa.nivelAsignado ||
                                recompensa.nivelReq) === 2
                            ? "bg-gray-200 text-gray-700"
                            : (recompensa.nivelAsignado ||
                                recompensa.nivelReq) === 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(recompensa.nivelAsignado || recompensa.nivelReq) === 0
                          ? "Para todos los usuarios"
                          : `Solo para usuarios ${
                              recompensa.nombreNivel ||
                              getNivelName(recompensa.nivelReq)
                            }`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {recompensa.analitica?.usos || 0}/
                        {recompensa.analitica?.limite ||
                          recompensa.limiteDeUsos?.totalGlobal ||
                          50}
                      </span>
                    </div>
                  </div>
                ))}

              {(!stats.recompensas || !stats.recompensas.length) && (
                <div className="col-span-2 bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  No hay recompensas activas
                </div>
              )}
            </div>
          </div>
          {/* Promociones section */}
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-red-600">
                Promociones ({stats.ofertasActivas.promociones})
              </h3>
              <button className="text-sm text-red-600 hover:text-red-800 rounded-full border border-red-600 px-4 py-1">
                Ver todas
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {stats.promociones &&
                stats.promociones.slice(0, 3).map((promo, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h5 className="font-medium mb-2">
                          {promo.titulo || "Promoción"}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {promo.nivelAsignado === 0
                            ? "Para todos los usuarios"
                            : `Solo para usuarios ${
                                promo.nombreNivel ||
                                getNivelName(promo.nivelReq)
                              }`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                          </svg>
                        </button>
                        <button className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium w-max mt-2">
                      {promo.tipoPromo?.periodo?.fechaFin
                        ? `Termina el ${new Date(
                            promo.tipoPromo.periodo.fechaFin
                          ).toLocaleDateString("es-ES")}`
                        : promo.tipoPromo?.programa?.diaSemana !== undefined
                        ? `${getDayName(promo.tipoPromo.programa.diaSemana)}: ${
                            promo.tipoPromo.programa.horaInicio || ""
                          } - ${promo.tipoPromo.programa.horaFin || ""}`
                        : "Promoción permanente"}
                    </div>
                  </div>
                ))}

              {(!stats.promociones || stats.promociones.length === 0) && (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  No hay promociones activas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OfertasSection({ negocio }) {
  const [viewMode, setViewMode] = useState("view"); // "view" or "create"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the promotion list
  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Function to handle when a promotion is successfully created
  const handlePromoCreated = useCallback(
    (newPromotion) => {
      handleRefresh();
    },
    [handleRefresh]
  );

  // Function to handle when a promotion is selected for editing
  const handleEditPromo = useCallback((promo) => {
    setSelectedPromo(promo);
    setIsDrawerOpen(true);
  }, []);

  // Reset state and trigger refresh when switching views
  const handleViewModeChange = useCallback(
    (mode) => {
      setViewMode(mode);
      if (mode === "view") {
        // Force refresh when switching to view mode
        handleRefresh();
      }
    },
    [handleRefresh]
  );

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold text-red-primary">
          Ofertas y Promociones
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewModeChange("view")}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              viewMode === "view"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiEye />
            Ver
          </button>
          <button
            onClick={() => handleViewModeChange("create")}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              viewMode === "create"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiPlusCircle />
            Crear
          </button>
        </div>
      </div>

      {viewMode === "view" ? (
        <div className="flex-1 overflow-auto">
          <StatsView negocio={negocio} refreshTrigger={refreshTrigger} />
        </div>
      ) : (
        /* Main content with side-by-side layout */
        <div className="flex flex-row gap-4 h-full overflow-hidden">
          {/* Left Side: Promo Creator (4/6 width) */}
          <div className="w-4/6 h-full overflow-auto">
            <PromoCreator negocio={negocio} onSuccess={handlePromoCreated} />
          </div>

          {/* Right Side: Promo List (2/6 width) */}
          <div className="w-2/6 h-full overflow-auto">
            <PromoList
              negocio={negocio}
              onEdit={handleEditPromo}
              onRefresh={handleRefresh}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      )}

      {/* Drawer for editing promotions */}
      <PromoDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedPromo(null);
        }}
        promotion={selectedPromo}
        onSave={handleRefresh}
      />
    </div>
  );
}
