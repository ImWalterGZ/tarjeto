import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import apiClient from "../../../../../config/axios.js";
import { StatusSection } from "./components/StatusSection";
import { QuickActions } from "./components/QuickActions";
import { NexoDetails } from "./components/NexoDetails";
import { StatsSection } from "./components/StatsSection";

export default function NexoSection({ negocio, nexoData, nexoError }) {
  // Add detailed logging of props
  console.log("NexoSection Props:", {
    negocio: negocio,
    nexoData: nexoData,
    nexoError: nexoError,
  });

  // Combine related state into a single object
  const [nexoState, setNexoState] = useState({
    nexoData: nexoData,
    selectedEstablishment: negocio?.establecimientos[0],
    isConnected: false,
    isGeneratingCode: false,
    isWaitingForCode: false,
    isUnpairing: false,
    connectionCode: null,
    timeLeft: 0,
    error: nexoError || null,
  });

  // Add state change logging
  useEffect(() => {
    console.log("NexoState Updated:", nexoState);
  }, [nexoState]);

  // Update state based on pre-fetched nexoData
  useEffect(() => {
    console.log("Updating state from nexoData:", nexoData);
    if (nexoData) {
      setNexoState((prevState) => {
        const newState = {
          ...prevState,
          nexoData: nexoData,
          connectionCode: nexoData.connectionCode || null,
          isWaitingForCode: !!nexoData.connectionCode,
          timeLeft: nexoData.expiresIn || 0,
        };
        console.log("New state after nexoData update:", newState);
        return newState;
      });
    }
  }, [nexoData, negocio]);

  // Set error from props
  useEffect(() => {
    if (nexoError) {
      setNexoState((prevState) => ({
        ...prevState,
        error: nexoError,
      }));
    }
  }, [nexoError]);

  // Update connection status based on nexoData
  useEffect(() => {
    if (nexoData?._id) {
      setNexoState((prev) => ({
        ...prev,
        isConnected: true,
        nexoData: nexoData,
      }));
    }
  }, [nexoData]);

  // Improve polling logic
  useEffect(() => {
    let pollingInterval;

    if (nexoState.isWaitingForCode && !nexoState.isConnected) {
      console.log("Starting connection polling");

      pollingInterval = setInterval(async () => {
        console.log("Polling for connection...");
        const connected = await checkNexoConnection();
        if (connected) {
          console.log("Connection established during polling");
          clearInterval(pollingInterval);
          setNexoState((prevState) => ({
            ...prevState,
            isConnected: true,
          }));
        }
      }, 3000);

      // Add timeout to stop polling
      const timeoutId = setTimeout(() => {
        if (pollingInterval) {
          console.log("Polling timeout reached");
          clearInterval(pollingInterval);
          setNexoState((prevState) => ({
            ...prevState,
            isWaitingForCode: false,
          }));
        }
      }, 300000); // 5 minutes timeout

      return () => {
        clearInterval(pollingInterval);
        clearTimeout(timeoutId);
      };
    }
  }, [nexoState.isWaitingForCode, nexoState.isConnected]);

  useEffect(() => {
    let timer;
    if (nexoState.isWaitingForCode && nexoState.timeLeft > 0) {
      timer = setInterval(() => {
        setNexoState((prevState) => {
          if (prevState.timeLeft <= 1000) {
            clearInterval(timer);
            return {
              ...prevState,
              timeLeft: 0,
            };
          }
          return {
            ...prevState,
            timeLeft: prevState.timeLeft - 1000,
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [nexoState.isWaitingForCode, nexoState.timeLeft]);

  const refreshNexoStats = async () => {
    console.log("[NexoStats] Manual refresh triggered");
    if (nexoState.isConnected && nexoState.selectedEstablishment?.nexoID) {
      try {
        const response = await apiClient.get(
          `/nexo/${nexoState.selectedEstablishment.nexoID}/stats`
        );
        console.log("[NexoStats] Refresh response:", response.data);

        // Update nexoData in nexoState instead
        setNexoState((prevState) => ({
          ...prevState,
          nexoData: response.data.data,
        }));
      } catch (error) {
        console.error("[NexoStats] Refresh error:", error);
        setNexoState((prevState) => ({
          ...prevState,
          error: "Error al actualizar estadísticas del Nexo",
        }));
      }
    }
  };

  const generateCode = async () => {
    setNexoState((prevState) => ({
      ...prevState,
      isGeneratingCode: true,
      error: null,
    }));

    try {
      const response = await apiClient.post("/establecimiento/generate-code", {
        establecimientoID: nexoState.selectedEstablishment.establecimientoID,
      });

      setNexoState((prevState) => ({
        ...prevState,
        connectionCode: response.data.data.code,
        isWaitingForCode: true,
        timeLeft: response.data.data.expiresIn,
        isGeneratingCode: false,
      }));
    } catch (error) {
      console.error("Error generating code:", error);

      setNexoState((prevState) => ({
        ...prevState,
        error: error.response?.data?.message || "Error al generar código",
        isGeneratingCode: false,
      }));
    }
  };

  const handleUnpair = async () => {
    console.log("Starting unpairing process");
    setNexoState((prevState) => ({
      ...prevState,
      isUnpairing: true,
      error: null,
    }));

    try {
      await apiClient.post(
        `/establecimiento/${nexoState.selectedEstablishment._id}/unpair`
      );

      console.log("Successfully unpaired device");
      const updatedEstablishment = {
        ...nexoState.selectedEstablishment,
        nexoID: null,
      };

      setNexoState((prevState) => ({
        ...prevState,
        selectedEstablishment: updatedEstablishment,
        isConnected: false,
        isUnpairing: false,
      }));

      console.log("Clearing nexo stats after unpairing");
    } catch (error) {
      console.error("Error during unpairing:", error);
      setNexoState((prevState) => ({
        ...prevState,
        error: "Error al desvincular dispositivo",
        isUnpairing: false,
      }));
    }
  };

  if (!negocio || !negocio.establecimientos) {
    return (
      <div className="flex flex-col w-full h-full gap-4 items-center justify-center p-8">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
        <p className="text-gray-700">No hay información disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-full gap-4">
      <div className="flex flex-col w-1/2 h-full gap-4">
        <div className="flex flex-col justify-between items-start">
          <h2 className="text-2xl font-bold text-red-primary">Dispositivos</h2>
          <h5 className="text-gray-500">Administra tu Nexo desde aquí</h5>
        </div>
        <div className="flex flex-col w-full h-full justify-around">
          <StatusSection
            isConnected={nexoState.isConnected}
            connectionCode={nexoState.connectionCode}
            isGeneratingCode={nexoState.isGeneratingCode}
            timeLeft={nexoState.timeLeft}
            onGenerateCode={generateCode}
            error={nexoState.error}
            lastConnection={nexoState.nexoData?.ultimoUso}
          />

          {nexoState.isConnected && (
            <StatsSection
              stats={nexoState.nexoData}
              error={nexoState.error}
              onRefresh={refreshNexoStats}
            />
          )}

          <QuickActions
            isUnpairing={nexoState.isUnpairing}
            onUnpair={handleUnpair}
          />
        </div>
      </div>
      <NexoDetails
        isConnected={nexoState.isConnected}
        nexoID={nexoState.selectedEstablishment?.nexoID}
      />
    </div>
  );
}
