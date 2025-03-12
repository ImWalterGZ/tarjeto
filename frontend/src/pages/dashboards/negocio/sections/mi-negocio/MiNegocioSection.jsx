import React from "react";
import { Building2, Globe, Boxes, Palette } from "lucide-react";

export default function MiNegocioSection({ negocio }) {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mi Negocio</h2>
        <button className="px-4 py-2 bg-red-primary text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Información Básica */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Información Básica
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500">
              Formulario de información básica (por implementar)
            </p>
          </div>
        </div>

        {/* Sitio Web y Redes Sociales */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Sitio Web y Redes Sociales
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500">
              Formulario de redes sociales (por implementar)
            </p>
          </div>
        </div>

        {/* Marca */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Boxes className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">Marca</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500">
              Gestión de logo y marca (por implementar)
            </p>
          </div>
        </div>

        {/* Personalización */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Personalización
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500">
              Selector de colores y estilos (por implementar)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
