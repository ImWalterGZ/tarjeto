import React from "react";
const BeneficiosImg = "/images/Beneficios.webp";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Recompensas por cada visita",
      description: "Porque cada vez que compras, te lo agradecen.",
    },
    {
      title: "Promociones personalizadas",
      description: "Cada negocio ofrece algo único para ti.",
    },
    {
      title: "Niveles y beneficios especiales",
      description: "Cuanto más visitas, más ventajas desbloqueas.",
    },
  ];

  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden bg-white px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Los beneficios van de la mano con tu lealtad...
        </h2>

        <ul className="relative pl-10 ">
          {/* Línea roja */}
          <div className="absolute left-4 top-5 bottom-5 w-[2px] bg-red-500"></div>

          {benefits.map((benefit, index) => (
            <li key={index} className="relative flex items-start gap-3 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
              <div>
                <span className="text-red-500 font-bold">{benefit.title}</span>
                <br />
                <span className="text-gray-600 text-sm">
                  {benefit.description}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center">
          <img src={BeneficiosImg} alt="Beneficios" className="w-5/6 " />
        </div>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:flex flex-row items-center justify-between bg-white px-8 py-12 max-w-5xl mx-auto">
        {/* Texto a la izquierda */}
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
            Los beneficios van de la mano con tu lealtad...
          </h2>
          <p className="text-gray-700 font-medium mb-5">
            Beneficios destacados:
          </p>

          <ul className="relative pl-10">
            {/* Línea roja */}
            <div className="absolute left-4 top-5 bottom-16 w-[2px] bg-red-500"></div>

            {/* Beneficio 1 */}
            <li className="relative flex items-start gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
              <div>
                <span className="text-red-500 font-bold">
                  Recompensas por cada visita
                </span>
                <br />
                <span className="text-gray-600 text-sm">
                  Porque cada vez que compras, te lo agradecen.
                </span>
              </div>
            </li>

            {/* Beneficio 2 */}
            <li className="relative flex items-start gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
              <div>
                <span className="text-red-500 font-bold">
                  Promociones personalizadas
                </span>
                <br />
                <span className="text-gray-600 text-sm">
                  Cada negocio ofrece algo único para ti.
                </span>
              </div>
            </li>

            {/* Beneficio 3 */}
            <li className="relative flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
              <div>
                <span className="text-red-500 font-bold">
                  Niveles y beneficios especiales
                </span>
                <br />
                <span className="text-gray-600 text-sm">
                  Cuanto más visitas, más ventajas desbloqueas.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Imagen a la derecha */}
        <div className="mt-8 md:mt-0">
          <img src={BeneficiosImg} alt="Beneficios" className="max-w-md" />
        </div>
      </div>
    </>
  );
};

export default BenefitsSection;
