import React from "react";
import { Box, WifiOff } from "lucide-react";

export default function NexoSection({ negocio }) {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Nexo IoT</h2>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">
          Sin Dispositivos Conectados
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Esta sección permitirá la comunicación con dispositivos IoT.
          Funcionalidad en desarrollo.
        </p>
      </div>
    </div>
  );
}
