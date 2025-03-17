import React, { useState, useEffect } from "react";
import { Box, WifiOff, Wifi } from "lucide-react";
import apiClient from "../../../../../config/axios";

export default function NexoSection({ negocio }) {
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [connectionCode, setConnectionCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  const generateCode = async (establecimientoID) => {
    console.log("=== Generate Code Frontend Debug Logs ===");
    console.log("1. Received establecimientoID:", establecimientoID);
    console.log("2. Full negocio object:", negocio);

    setIsGeneratingCode(true);
    setError(null);
    try {
      console.log("3. Making API request with ID:", establecimientoID);
      const response = await apiClient.post("/establecimiento/generate-code", {
        establecimientoID,
      });
      console.log("4. API Response:", response.data);
      setConnectionCode(response.data.data.code);
      setTimeLeft(180); // 3 minutes in seconds
    } catch (error) {
      console.error("5. API Error:", error.response || error);
      setError(error.response?.data?.message || "Error al generar código");
    }
    setIsGeneratingCode(false);
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && connectionCode) {
      setConnectionCode(null);
    }
  }, [timeLeft]);

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dispositivos</h2>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center gap-4">
        {negocio?.establecimientos?.[0]?.nexoID ? (
          // Connected state
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Dispositivo Conectado
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              El dispositivo Nexo está conectado y funcionando correctamente.
            </p>
          </>
        ) : (
          // Not connected state
          <>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <WifiOff className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Sin Dispositivos Conectados
            </h3>
            {connectionCode ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {connectionCode}
                </p>
                <p className="text-sm text-gray-500">
                  Expira en {formatTimeLeft()}
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-center max-w-md">
                  Conecta tu dispositivo Nexo generando un código de conexión.
                </p>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                  onClick={() =>
                    generateCode(negocio.establecimientos[0].establecimientoID)
                  }
                  disabled={isGeneratingCode}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 
                           disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingCode ? "Generando..." : "Generar Código"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
