import React from "react";
import { PlusCircle, MapPin, Trophy } from "lucide-react";

const StepsSection = () => {
  return (
    <div className="text-center py-12 bg-white">
      {/* Título principal */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8">
        Así de fácil, sin complicaciones.
      </h2>

      {/* Contenedor de pasos */}
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {/* Tarjeta 1 */}
        <div className="flex flex-col items-center bg-white border shadow-md rounded-xl p-6 w-80 text-center 
                        transition-all hover:shadow-xl hover:border-2 hover:border-red-500 hover:shadow-red-300">
          <PlusCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-500">Paso 1</h3>
          <p className="font-semibold text-gray-800">Regístrate en la app</p>
          <p className="text-gray-600 text-sm">Hazlo en un par de minutos y ¡listo!</p>
        </div>

        {/* Tarjeta 2 */}
        <div className="flex flex-col items-center bg-white border shadow-md rounded-xl p-6 w-80 text-center 
                        transition-all hover:shadow-xl hover:border-2 hover:border-red-500 hover:shadow-red-300">
          <MapPin size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-500">Paso 2</h3>
          <p className="font-semibold text-gray-800">Visita tus lugares favoritos.</p>
          <p className="text-gray-600 text-sm">No te olvides de registrar tu visita.</p>
        </div>

        {/* Tarjeta 3 */}
        <div className="flex flex-col items-center bg-white border shadow-md rounded-xl p-6 w-80 text-center 
                        transition-all hover:shadow-xl hover:border-2 hover:border-red-500 hover:shadow-red-300">
          <Trophy size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-500">Paso 3</h3>
          <p className="font-semibold text-gray-800">Gana puntos y disfruta.</p>
          <p className="text-gray-600 text-sm">Acumula puntos y gana recompensas.</p>
        </div>
      </div>

      {/* Texto final */}
      <p className="mt-8 text-gray-700 text-lg max-w-2xl mx-auto">
        Con Tarjeto, las visitas repetidas no son solo parte de tu rutina,{" "}
        <strong className="text-black">¡también son parte de tu recompensa!</strong>
      </p>
    </div>
  );
};

export default StepsSection;
