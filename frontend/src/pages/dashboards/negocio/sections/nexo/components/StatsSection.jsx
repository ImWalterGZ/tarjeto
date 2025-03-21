import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

export const StatsSection = ({ stats, error, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log("[NexoStats] Refresh button clicked");
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col w-full h-1/4 gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-primary">Estadísticas</h2>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
        <div className="flex w-full h-full bg-gray-background p-3 items-center justify-center rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-1/4 gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-red-primary">Estadísticas</h2>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-full transition-all"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-5 h-5 text-gray-600 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
      <div className="flex w-full h-full bg-gray-background p-3 gap-3 rounded-lg">
        <div className="bg-white w-1/3 h-full rounded-lg shadow-xl p-4">
          <p className="text-gray-500 text-sm">Visitas Registradas</p>
          <p className="text-2xl font-bold">{stats?.visitasRegistradas || 0}</p>
        </div>
        <div className="bg-white w-1/3 h-full rounded-lg shadow-xl p-4">
          <p className="text-gray-500 text-sm">Fecha Registro</p>
          <p className="text-sm font-medium">
            {stats?.fechaRegistro
              ? new Date(stats.fechaRegistro).toLocaleDateString()
              : "-"}
          </p>
        </div>
        <div className="bg-white w-1/3 h-full rounded-lg shadow-xl p-4">
          <p className="text-gray-500 text-sm">Último Uso</p>
          <p className="text-sm font-medium">
            {stats?.ultimoUso
              ? new Date(stats.ultimoUso).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
