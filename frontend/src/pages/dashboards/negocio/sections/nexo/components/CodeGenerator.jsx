import React from "react";
import { MessageCircleCode } from "lucide-react";

export const CodeGenerator = ({
  connectionCode,
  isGeneratingCode,
  isConnected,
  timeLeft,
  onGenerateCode,
}) => {
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "0:00";
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (connectionCode != null) {
    return (
      <div className="bg-white flex flex-col justify-center items-center w-1/2 rounded-lg shadow-xl">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <p className="font-bold text-xl">{connectionCode}</p>
          {timeLeft > 0 && (
            <p className="text-sm text-gray-500">
              Expira en: {formatTimeLeft()}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isGeneratingCode) {
    return (
      <div className="bg-red-primary flex flex-col justify-center items-center w-1/2 rounded-lg shadow-xl">
        <div className="flex flex-row w-full h-full justify-center items-center">
          <p className="text-white">Generando código...</p>
        </div>
      </div>
    );
  }

  return (
    <button
      className="bg-white hover:shadow-md transition-all flex flex-col justify-center items-center w-1/2 rounded-lg shadow-xl"
      onClick={onGenerateCode}
      disabled={isConnected}
    >
      <MessageCircleCode className="text-red-primary" />
      <p className="text-red-primary font-bold">Generar código</p>
    </button>
  );
};
