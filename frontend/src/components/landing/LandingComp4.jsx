import React from "react";

const LoyaltyLevels = () => {
  const levels = [
    {
      name: "BRONCE",
      description:
        "El primer nivel. Recibe descuentos básicos y acceso a promociones estándar.",
      color: "from-amber-800 to-amber-600",
      hoverColor: "hover:shadow-brown-300",
    },
    {
      name: "PLATA",
      description:
        "Cliente frecuente. Desbloquea ofertas especiales y descuentos mejorados.",
      color: "from-gray-500 to-gray-400",
      hoverColor: "hover:shadow-gray-300",
    },
    {
      name: "ORO",
      description:
        "Cliente habitual. Consigue acceso a promociones exclusivas y eventos especiales.",
      color: "from-yellow-600 to-yellow-400",
      hoverColor: "hover:shadow-yellow-300",
    },
    {
      name: "RUBÍ",
      description:
        "Nuestro cliente más fiel. Disfruta de los máximos beneficios y trato VIP.",
      color: "from-red-800 to-red-600",
      hoverColor: "hover:shadow-red-300",
    },
  ];

  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden bg-white px-8 py-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          <span className="text-red-500 font-bold">
            ... y como tu lealtad cuenta
          </span>
          , aquí se premia.
        </h2>

        <p className="text-center text-gray-700 text-sm mb-8">
          Cada visita te lleva más alto. En Tarjeto avanzas de{" "}
          <b className="text-red-800">Bronce</b> a{" "}
          <b className="text-slate-400">Plata</b>,{" "}
          <b className="text-yellow-400">Oro</b>, y{" "}
          <b className="text-red-600">Rubí</b> según tus visitas. Mientras más
          subes, mejores recompensas.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {levels.map((level, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded-xl">
              <div
                className={`bg-gradient-to-b ${level.color} text-white p-6 rounded-2xl shadow-md text-center flex flex-col items-center h-auto py-6 ${level.hoverColor} border-2`}
              >
                <h3 className="text-lg font-bold mb-2">{level.name}</h3>
                <p className="text-sm">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block bg-white px-8 py-12 max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-5xl font-semibold text-center text-gray-800">
          <span className="text-red-500 font-bold">
            ... y como tu lealtad cuenta
          </span>
          , aquí se premia.
        </h2>

        {/* Subtítulo */}
        <p className="text-center text-gray-700 mt-3 max-w-3xl mx-auto">
          Cada visita te lleva más alto. En Tarjeto avanzas de{" "}
          <b className="text-red-800">Bronce</b> a{" "}
          <b className="text-slate-400">Plata</b>,{" "}
          <b className="text-yellow-400">Oro</b>, y{" "}
          <b className="text-red-600">Rubí</b> según tus visitas y rachas en
          cada negocio.{" "}
          <span className="font-bold text-gray-800">
            Mientras más subes, mejores recompensas obtienes:
          </span>{" "}
          desde descuentos básicos hasta beneficios VIP.
        </p>

        {/* Tarjetas de niveles */}
        <div className="grid grid-cols-4 gap-6 mt-10">
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
    </>
  );
};

export default LoyaltyLevels;
