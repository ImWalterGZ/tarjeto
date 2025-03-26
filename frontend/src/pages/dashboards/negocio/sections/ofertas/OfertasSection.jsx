import React, { useState, useCallback, useEffect } from "react";
import PromoDrawer from "../../../../../components/promociones/PromoDrawer";
import PromoCreator from "../../../../../components/promociones/PromoCreator";
import PromoList from "../../../../../components/promociones/PromoList";
import apiClient from "../../../../../config/axios";
import { FiEye, FiPlusCircle } from "react-icons/fi";

// Stats View Component
const StatsView = ({ negocio, refreshTrigger }) => {
  const [stats, setStats] = useState({
    ofertasActivas: [],
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
    const fetchStats = async () => {
      console.log("Starting to fetch stats with negocio:", negocio);
      try {
        // Fetch all promotions for this business
        console.log("Fetching promotions for business ID:", negocio.publicID);
        const promocionesResponse = await apiClient.get(
          `/promocion/${negocio.publicID}`
        );
        console.log("Promociones response:", promocionesResponse.data);

        // Fetch stats for this business
        console.log("Fetching stats for business ID:", negocio.publicID);
        const statsResponse = await apiClient.get(
          `/promocion/stats/${negocio.publicID}`
        );
        console.log("Stats response:", statsResponse.data);

        // Fetch loyalty program to get level info
        console.log(
          "Fetching loyalty program for business ID:",
          negocio.publicID
        );
        const programaLealtadResponse = await apiClient.get(
          `/programa-lealtad/negocio/${negocio.publicID}`
        );
        console.log("Programa lealtad response:", programaLealtadResponse.data);

        const promociones = promocionesResponse.data.data;
        console.log("Raw promociones data:", promociones);

        // Process data for UI
        const ofertasActivas = promociones.filter((p) => p.activo);
        console.log("Filtered active offers:", ofertasActivas);

        // Group by type
        const cupones = ofertasActivas.filter(
          (p) => p.tipoPromo?.tipo === "cupon"
        );
        const eventos = ofertasActivas.filter(
          (p) => p.tipoPromo?.tipo === "evento"
        );
        const recompensas = ofertasActivas.filter(
          (p) => p.tipoPromo?.tipo === "recompensa"
        );

        console.log("Grouped by type:", {
          cupones: cupones.length,
          eventos: eventos.length,
          recompensas: recompensas.length,
          promociones: ofertasActivas.filter(
            (p) => p.tipoPromo?.tipo === "promocion"
          ).length,
        });

        // Expiring soon (within 3 days)
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        console.log("Looking for offers expiring before:", threeDaysFromNow);

        const ofertasQueExpiran = ofertasActivas.filter((p) => {
          if (p.tipoPromo?.periodo?.fechaFin) {
            const fechaFin = new Date(p.tipoPromo.periodo.fechaFin);
            return fechaFin <= threeDaysFromNow;
          }
          return false;
        });
        console.log("Offers expiring soon:", ofertasQueExpiran);

        // Calculate usage rates
        let promocionesUsageRate = 0;
        let cuponesUsageRate = 0;

        if (statsResponse.data.data.estadisticasUso.totalVistas > 0) {
          promocionesUsageRate = Math.round(
            (statsResponse.data.data.estadisticasUso.totalUsos /
              statsResponse.data.data.estadisticasUso.totalVistas) *
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

        const newStats = {
          ofertasActivas: {
            promociones: ofertasActivas.filter(
              (p) => p.tipoPromo?.tipo === "promocion"
            ).length,
            cupones: cupones.length,
            recompensas: recompensas.length,
            eventos: eventos.length,
          },
          tasaDeUso: {
            promociones: promocionesUsageRate,
            cupones: cuponesUsageRate,
          },
          ofertasQueExpiran,
          cupones: cupones.sort((a, b) => a.nivelReq - b.nivelReq),
          eventos,
          recompensas: recompensas.sort((a, b) => a.nivelReq - b.nivelReq),
          niveles: programaLealtadResponse.data.data.niveles,
          loading: false,
          error: null,
        };

        console.log("Setting stats to:", newStats);
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching offer stats:", error);
        console.error("Error details:", error.response?.data || error.message);
        setStats({
          ...stats,
          loading: false,
          error:
            error.response?.data?.message || "Error al cargar las estadísticas",
        });
      }
    };

    if (negocio?.publicID) {
      fetchStats();
    } else {
      console.warn("Cannot fetch stats - missing negocio.publicID");
    }
  }, [negocio, refreshTrigger]);

  console.log("Rendering StatsView with stats:", stats);

  if (stats.loading) {
    console.log("StatsView is in loading state");
    return (
      <div className="p-4 text-center">Cargando estadísticas de ofertas...</div>
    );
  }

  if (stats.error) {
    console.log("StatsView encountered an error:", stats.error);
    return <div className="p-4 text-center text-red-500">{stats.error}</div>;
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

  // Helper to get nivel count by nivelReq
  const getNivelCount = (items, nivel) => {
    const count = items.filter((item) => item.nivelReq === nivel).length;
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
                  Viernes 19 de enero, 7:00 PM - 10:00 PM
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
              <div className="text-center p-2 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 mx-auto mb-2">
                  <span className="text-gray-700">★</span>
                </div>
                <span>Todos</span>
                <div className="text-2xl font-bold text-red-600">
                  {getNivelCount(stats.cupones, 0) +
                    getNivelCount(stats.recompensas, 0)}
                </div>
              </div>
              <div className="text-center p-2 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-800 mx-auto mb-2">
                  <span className="text-white">★</span>
                </div>
                <span>Bronce</span>
                <div className="text-2xl font-bold text-red-600">
                  {getNivelCount(stats.cupones, 1) +
                    getNivelCount(stats.recompensas, 1)}
                </div>
              </div>
              <div className="text-center p-2 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 mx-auto mb-2">
                  <span className="text-white">★</span>
                </div>
                <span>Plata</span>
                <div className="text-2xl font-bold text-red-600">
                  {getNivelCount(stats.cupones, 2) +
                    getNivelCount(stats.recompensas, 2)}
                </div>
              </div>
              <div className="text-center p-2 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 mx-auto mb-2">
                  <span className="text-white">★</span>
                </div>
                <span>Oro</span>
                <div className="text-2xl font-bold text-red-600">
                  {getNivelCount(stats.cupones, 3) +
                    getNivelCount(stats.recompensas, 3)}
                </div>
              </div>
              <div className="text-center p-2 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-700 mx-auto mb-2">
                  <span className="text-white">★</span>
                </div>
                <span>Rubí</span>
                <div className="text-2xl font-bold text-red-600">
                  {getNivelCount(stats.cupones, 4) +
                    getNivelCount(stats.recompensas, 4)}
                </div>
              </div>
            </div>
          </div>

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
                        cupon.nivelReq === 0
                          ? "bg-gray-200 text-gray-800"
                          : cupon.nivelReq === 1
                          ? "bg-amber-100 text-amber-800"
                          : cupon.nivelReq === 2
                          ? "bg-gray-200 text-gray-700"
                          : cupon.nivelReq === 3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cupon.nivelReq === 0
                        ? "Para todos los usuarios"
                        : `Solo para usuarios ${getNivelName(cupon.nivelReq)}`}
                    </span>
                    <span className="text-xs text-gray-500">10/50</span>
                  </div>
                </div>
              ))}
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
              {stats.recompensas.slice(0, 4).map((recompensa, index) => (
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
                        recompensa.nivelReq === 0
                          ? "bg-gray-200 text-gray-800"
                          : recompensa.nivelReq === 1
                          ? "bg-amber-100 text-amber-800"
                          : recompensa.nivelReq === 2
                          ? "bg-gray-200 text-gray-700"
                          : recompensa.nivelReq === 3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recompensa.nivelReq === 0
                        ? "Para todos los usuarios"
                        : `Solo para usuarios ${getNivelName(
                            recompensa.nivelReq
                          )}`}
                    </span>
                    <span className="text-xs text-gray-500">10/50</span>
                  </div>
                </div>
              ))}
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
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h5 className="font-medium mb-2">Promo description</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Para todos los usuarios
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
                  Termina hoy
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h5 className="font-medium mb-2">Promo description</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Solo para usuarios BRONCE
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
                  Termina hoy
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h5 className="font-medium mb-2">Promo description</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Solo para usuarios PLATA
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
                  Termina hoy
                </div>
              </div>
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

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold text-red-primary">
          Ofertas y Promociones
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("view")}
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
            onClick={() => setViewMode("create")}
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
