import React from "react";
const LocalImage = "/images/Local.webp";

const features = [
  {
    title: "Local",
    image: LocalImage,
    description: "Encuentra negocios cercanos que usan Tarjeto",
  },
];

const benefits = [
  "Conectamos a clientes con negocios locales.",
  "Recompensas únicas en cada lugar.",
  "Una app fácil, práctica y hecha para ti.",
  "Herramienta para que los negocios crezcan.",
];

const BenefitsSection = () => {
  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden bg-white px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Porque lo local es lo que importa.
        </h2>

        <img
          src={features[0].image}
          alt={features[0].title}
          className="w-5/6 max-w-xs mx-auto my-6"
        />

        <p className="text-gray-700 text-center mb-6">
          En Tarjeto, no solo se trata de puntos y recompensas. Se trata de{" "}
          <span className="text-red-600">apoyar a los negocios</span> que son
          parte de tu día a día, de descubrir nuevos lugares y de obtener algo a
          cambio por tu lealtad.
        </p>

        <ul className="relative pl-10 mb-4">
          {/* Línea roja */}
          <div className="absolute left-4 top-5 bottom-1 w-[2px] bg-red-500"></div>

          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="relative flex items-start gap-3 mb-4 mt-6"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
              <div>
                <span className="text-red-500 font-bold">{benefit}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:flex flex-row items-center justify-between bg-white px-8 py-12 max-w-5xl mx-auto">
        {/* Texto a la izquierda */}
        <div className="max-w-lg">
          <h2 className="text-5xl font-semibold text-gray-800 mb-6">
            Porque lo local es lo que importa.
          </h2>
          <p className="text-gray-700 font-medium mb-5">
            En Tarjeto, no solo se trata de puntos y recompensas. Se trata de{" "}
            <span className="text-red-600">apoyar a los negocios</span> que son
            parte de tu día a día, de descubrir nuevos lugares y de obtener algo
            a cambio por tu lealtad. Cada visita cuenta, y aquí sí se nota.
          </p>

          <ul className="relative pl-10">
            {/* Línea roja */}
            <div className="absolute left-4 top-5 bottom-1 w-[2px] bg-red-500"></div>

            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="relative flex items-start gap-3 mb-4 mt-6"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
                <div>
                  <span className="text-red-500 font-bold">{benefit}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Imagen a la derecha */}
        <div className="mt-8 md:mt-0 md:w-1/2 justify-center">
          <img
            src={features[0].image}
            alt={features[0].title}
            className="max-w-xs md:max-w-md"
          />
        </div>
      </div>
    </>
  );
};

export default BenefitsSection;
