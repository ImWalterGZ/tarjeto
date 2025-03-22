import React from "react";
import { Wifi, WifiOff } from "lucide-react";

export const ConnectionStatus = ({
  isConnected,
  onGenerateCode,
  isGeneratingCode,
  lastConnection,
  connectionCode,
}) => {
  // Format the last connection date if available
  const formatLastConnection = (date) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex w-full h-full bg-gray-background p-3 gap-3 rounded-lg">
      {/* Connection Status Panel */}
      <div className="bg-white w-1/2 h-full rounded-lg shadow-xl flex flex-col justify-center items-center p-4">
        {isConnected ? (
          <>
            <div className="rounded-full w-12 h-12 bg-green-100 flex justify-center items-center mb-2">
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-green-500 font-bold">Conectado</p>
          </>
        ) : (
          <>
            <div className="rounded-full w-12 h-12 bg-red-100 flex justify-center items-center mb-2">
              <WifiOff className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-500 font-bold">Desconectado</p>
          </>
        )}
      </div>

      {/* Action/Info Panel */}
      <div className="bg-white w-1/2 h-full rounded-lg shadow-xl flex flex-col justify-center items-center p-4">
        {isConnected ? (
          <>
            <p className="text-gray-600 text-sm mb-1">Última conexión</p>
            <p className="text-gray-800 font-semibold">
              {formatLastConnection(lastConnection)}
            </p>
          </>
        ) : connectionCode ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-sm mb-1">Código de conexión</p>
            <p className="text-2xl font-bold text-red-primary tracking-wider">
              {connectionCode}
            </p>
          </div>
        ) : (
          <button
            onClick={onGenerateCode}
            disabled={isGeneratingCode}
            className="bg-red-primary hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {isGeneratingCode ? "Generando..." : "Generar Código"}
          </button>
        )}
      </div>
    </div>
  );
};
