import React from "react";
import { Unlink } from "lucide-react";

export const QuickActions = ({ isUnpairing, onUnpair }) => {
  return (
    <div className="flex flex-col w-full h-1/4 gap-2">
      <h2 className="text-xl font-bold text-red-primary">Acciones rápidas</h2>
      <div className="flex w-full h-full bg-gray-background p-3 gap-3 rounded-lg">
        <div className="bg-white w-1/2 h-full rounded-lg shadow-xl">
          <p>Dispositivo</p>
        </div>
        <button
          className="bg-white hover:shadow-md transition-all w-1/2 flex flex-col justify-center items-center h-full rounded-lg shadow-xl"
          onClick={onUnpair}
        >
          <div className="rounded-full w-8 h-8 bg-red-primary flex justify-center items-center">
            <Unlink className="w-5 h-5 text-white" />
          </div>
          <p className="text-red-primary font-bold">
            {isUnpairing ? "Desvinculando..." : "Desvincular Nexo"}
          </p>
        </button>
      </div>
    </div>
  );
};
