import React from "react";
import { ConnectionStatus } from "./ConnectionStatus";

export const StatusSection = ({
  isConnected,
  connectionCode,
  isGeneratingCode,
  timeLeft,
  onGenerateCode,
  error,
  lastConnection,
}) => {
  return (
    <div className="flex flex-col w-full h-1/4 gap-2">
      <h2 className="text-xl font-bold text-red-primary">Estado</h2>

      <ConnectionStatus
        isConnected={isConnected}
        onGenerateCode={onGenerateCode}
        isGeneratingCode={isGeneratingCode}
        lastConnection={lastConnection}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
