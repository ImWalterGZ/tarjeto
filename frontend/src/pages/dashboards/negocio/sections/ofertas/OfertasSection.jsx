import React, { useState } from "react";
import PromoDrawer from "../../../../../components/promociones/PromoDrawer";

export default function OfertasSection({ negocio }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("view"); // view or create

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ofertas y Promociones
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMode("view")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeMode === "view"
                ? "bg-red-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Ver Promociones
          </button>
          <button
            onClick={() => setActiveMode("create")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeMode === "create"
                ? "bg-red-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Crear Promoción
          </button>
        </div>
      </div>

      {/* Content based on mode */}
      <div className="flex-1">
        {activeMode === "view" ? (
          <div className="bg-gray-50 rounded-lg p-4 h-full">
            <p className="text-gray-500">
              Lista de promociones (por implementar)
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 h-full">
            <p className="text-gray-500">
              Formulario de creación (por implementar)
            </p>
          </div>
        )}
      </div>

      {/* Keep the drawer for now, we'll integrate it properly later */}
      <PromoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
