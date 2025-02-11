import React from "react";

const LoyaltyLevels = () => {
  const levels = [
    {
      name: "Bronce",
      description: "Comienza tu recorrido con recompensas básicas y accesibles.",
      color: "from-[#A04F52] to-[#3A1D1E]",
      hoverColor: "hover:border-[#A04F52]", // Color del borde para Bronce
    },
    {
      name: "Plata",
      description: "Obtén promociones especiales por alcanzar un compromiso con el negocio.",
      color: "from-[#90C1DB] to-[#4D6775]",
      hoverColor: "hover:border-[#90C1DB]", // Color del borde para Plata
    },
    {
      name: "Oro",
      description: "Acceso a descuentos más atractivos y promociones personalizadas.",
      color: "from-[#F9F930] to-[#B7900F]",
      hoverColor: "hover:border-[#F9F930]", // Color del borde para Oro
    },
    {
      name: "Rubí",
      description: "El nivel más alto, con beneficios VIP, promociones premium y ofertas limitadas solo para los clientes más leales.",
      color: "from-[#98151B] to-[#E3030D]",
      hoverColor: "hover:border-[#98151B]", // Color del borde para Rubí
    },
  ];

  return (
    <div className="bg-white px-8 py-12 max-w-6xl mx-auto">
      {/* Título */}
      <h2 className="text-3xl md:text-5xl font-semibold text-center text-gray-800">
        <span className="text-red-500 font-bold">... y como tu lealtad cuenta</span>, aquí se premia.
      </h2>

      {/* Subtítulo */}
      <p className="text-center text-gray-700 mt-3 max-w-3xl mx-auto">
        Cada visita te lleva más alto. En Tarjeto avanzas de <b className="text-red-800">Bronce</b> a{" "}
        <b className="text-slate-400">Plata</b>, <b className="text-yellow-400">Oro</b>, y{" "}
        <b className="text-red-600">Rubí</b> según tus visitas y rachas en cada negocio.{" "}
        <span className="font-bold text-gray-800">
          Mientras más subes, mejores recompensas obtienes:
        </span>{" "}
        desde descuentos básicos hasta beneficios VIP.
      </p>

      {/* Tarjetas de niveles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        {levels.map((level, index) => (
          <div key={index} className="p-3 bg-gray-100 rounded-xl">
            <div
              className={`bg-gradient-to-b ${level.color} text-white p-8 rounded-2xl shadow-md text-center flex flex-col items-center justify-center h-80 transition-all transform hover:scale-105 hover:shadow-xl ${level.hoverColor} border-2`}
            >
              <h3 className="text-xl font-bold mb-8">{level.name}</h3>
              <p className="text-md">{level.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyLevels;
