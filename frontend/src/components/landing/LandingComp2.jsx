import React from "react";
import { PlusCircle, MapPin, Trophy } from "lucide-react";

const StepsSection = () => {
  const steps = [
    {
      icon: <PlusCircle size={48} className="text-red-500 mb-4" />,
      title: "Paso 1",
      subtitle: "Regístrate en la app",
      description: "Hazlo en un par de minutos y ¡listo!",
    },
    {
      icon: <MapPin size={48} className="text-red-500 mb-4" />,
      title: "Paso 2",
      subtitle: "Visita tus lugares favoritos",
      description: "No te olvides de registrar tu visita.",
    },
    {
      icon: <Trophy size={48} className="text-red-500 mb-4" />,
      title: "Paso 3",
      subtitle: "Recibe recompensas",
      description: "Disfruta los beneficios de tu fidelidad.",
    },
  ];

  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden bg-white px-8 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
          Así de fácil, sin complicaciones.
        </h2>

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded-xl">
              <div className="flex flex-col items-center bg-white border shadow-lg rounded-xl p-5 text-center">
                {step.icon}
                <h3 className="text-xl font-bold text-red-500">{step.title}</h3>
                <p className="font-semibold text-gray-800">{step.subtitle}</p>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block text-center py-12 px-12 bg-white">
        {/* Título principal */}
        <h2 className="text-4xl font-semibold text-gray-800 mb-8">
          Así de fácil, sin complicaciones.
        </h2>

        {/* Contenedor de pasos */}
        <div className="flex flex-row justify-center gap-6">
          {steps.map((step, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded-xl">
              <div
                className="flex flex-col items-center bg-white border shadow-xl rounded-xl p-6 w-80 text-center 
                            transition-all hover:border-9 hover:border-red-500"
              >
                {step.icon}
                <h3 className="text-xl font-bold text-red-500">{step.title}</h3>
                <p className="font-semibold text-gray-800">{step.subtitle}</p>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StepsSection;
