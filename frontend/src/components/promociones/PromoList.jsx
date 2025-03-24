import React, { useState, useEffect } from "react";
import apiClient from "../../config/axios";

const PromoList = ({ negocio, onEdit, onRefresh, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promotions, setPromotions] = useState([]);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      console.log("📢 PromoList: Fetching promotions...");

      if (!negocio?.publicID) {
        console.log("❌ PromoList: No negocio ID available, skipping fetch");
        return;
      }

      console.log(`🔍 PromoList: Using negocioID: ${negocio.publicID}`);
      const requestUrl = `/api/promocion/${negocio.publicID}`;
      console.log(`🌐 PromoList: Making request to: ${requestUrl}`);

      setLoading(true);
      try {
        console.log("🔄 PromoList: API request started");
        const response = await apiClient.get(requestUrl);
        console.log("✅ PromoList: API response received", response);

        const promotionsData = response.data.data || [];
        console.log(
          `📋 PromoList: Loaded ${promotionsData.length} promotions`,
          promotionsData
        );

        setPromotions(promotionsData);
        setError("");
        console.log("✅ PromoList: State updated with promotions");
      } catch (err) {
        console.error("❌ PromoList: Error fetching promotions:", err);
        console.log(
          "❌ PromoList: Error details:",
          err.response?.data || err.message
        );
        setError("No se pudieron cargar las promociones");
        console.log("❌ PromoList: Error state set");
      } finally {
        setLoading(false);
        console.log("🏁 PromoList: Loading state set to false");
      }
    };

    console.log(
      "🔄 PromoList: Effect triggered with ID:",
      negocio?.publicID,
      "and refreshTrigger:",
      refreshTrigger
    );
    fetchPromotions();
  }, [negocio?.publicID, refreshTrigger]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get promotion type display text
  const getPromoTypeText = (promo) => {
    if (!promo.tipoPromo) return "No definido";

    switch (promo.tipoPromo.tipo) {
      case "PROGRAMA":
        const dias = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];
        return `${dias[promo.tipoPromo.programa.diaSemana]}: ${
          promo.tipoPromo.programa.horaInicio
        }-${promo.tipoPromo.programa.horaFin}`;
      case "PERIODO":
        return `Del ${formatDate(
          promo.tipoPromo.periodo.fechaInicio
        )} al ${formatDate(promo.tipoPromo.periodo.fechaFin)}`;
      case "EXCLUSIVO":
        return `${promo.tipoPromo.exclusivo.restantes}/${promo.tipoPromo.exclusivo.totalInicial} disponibles`;
      default:
        return promo.tipoPromo.tipo;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return status ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Activa
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        Inactiva
      </span>
    );
  };

  // Get level badge
  const getLevelBadge = (level) => {
    const levels = {
      0: { bg: "bg-gray-100", text: "text-gray-800", label: "Todos" },
      1: { bg: "bg-amber-100", text: "text-amber-800", label: "Bronce" },
      2: { bg: "bg-gray-200", text: "text-gray-800", label: "Plata" },
      3: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Oro" },
      4: { bg: "bg-red-100", text: "text-red-800", label: "Rubi" },
    };

    const levelInfo = levels[level] || levels[0];

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${levelInfo.bg} ${levelInfo.text}`}
      >
        {levelInfo.label}
      </span>
    );
  };

  console.log("🖥️ PromoList: Rendering with", promotions.length, "promotions");

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Promociones</h3>
        <button
          onClick={() => {
            console.log("🔄 PromoList: Refresh button clicked");
            onRefresh && onRefresh();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-primary"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay promociones activas
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                console.log(
                  "👆 PromoList: Promotion clicked for editing",
                  promo
                );
                onEdit && onEdit(promo);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{promo.titulo}</h4>
                {getStatusBadge(promo.status || promo.activo)}
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {promo.descripcion}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>Nivel:</span>
                  {getLevelBadge(promo.nivelReq)}
                </div>

                <div className="flex items-center gap-1">
                  <span>Tipo:</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {promo.tipoPromo ? getPromoTypeText(promo) : "No definido"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoList;
