import React from "react";

export const NexoDetails = ({ isConnected, nexoID }) => {
  return (
    <div className="flex flex-col w-1/2 h-full">
      <h3 className="text-2xl font-bold text-red-primary">Tu Nexo</h3>
      <div className="flex flex-col bg-gray-50 rounded-xl w-full h-full p-4">
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-col w-1/2 h-full">
            <h4 className="font-semibold">Estado</h4>
            <p className={isConnected ? "text-green-500" : "text-red-500"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </p>
            {isConnected && nexoID && (
              <>
                <h4 className="font-semibold mt-4">ID del Dispositivo</h4>
                <p>{nexoID}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
