import React from "react";
import { PlusCircle, MapPin, Trophy } from "lucide-react";

const StepsSection = () => {
  return (
    <div className="text-center py-12 bg-white">
      {/* Título principal */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        Así de fácil, sin complicaciones.
      </h2>

      {/* Contenedor de pasos */}
      <div className="flex flex-col md:flex-row justify-center gap-10 gap-x-4">
        {/* Tarjeta 1 */}

        <div className="p-2 bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center bg-white border shadow-xl rounded-xl p-6 w-80 h-full text-center 
                          transition-all hover:border-9 hover:border-red-500">
            <PlusCircle size={50} className="text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500">Paso 1</h3>
            <p className="font-semibold text-red-500 mt-4 text-xl" >Regístrate en la app.</p>
            <p className="text-lg mt-4 font-semibold">Hazlo en un par de minutos y ¡listo!</p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="p-2 bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center bg-white border shadow-xl rounded-xl p-6 w-80 h-full text-center 
                          transition-all hover:border-9 hover:border-red-500">
            <MapPin size={50} className="text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500">Paso 2</h3>
            <p className="font-semibold text-red-500 mt-4 text-xl">Visita tus lugares favoritos.</p>
            <p className="text-lg mt-4 font-semibold">No te olvides de registrar tu visita.</p>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="p-2 bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center bg-white border shadow-md rounded-xl p-6 w-80 h-full text-center 
                          transition-all hover:border-9 hover:border-red-500">
            <Trophy size={50} className="text-red-500 mb-4 max-w-5xl" />
            <h3 className="text-2xl font-bold text-red-500">Paso 3</h3>
            <p className="font-semibold text-red-500 mt-4 text-xl">Gana puntos y disfruta.</p>
            <p className="text-lg mt-4 font-semibold">Acumula puntos y gana recompensas.</p>
          </div>

        </div>
      </div>

      {/* Texto final */}
      <p className="mt-10 text-gray-700 text-2xl font-semibold max-w-5xl mx-auto">
        Con Tarjeto, las visitas repetidas no son solo parte de tu rutina,{" "}
        <strong className="text-black font-bold">
          ¡también son parte de tu recompensa!
        </strong>
      </p>
    </div>
  );
};

export default StepsSection;
