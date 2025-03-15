import React from "react";
import BeneficiosImg from "/src/assets/landing/Beneficios.png";

const BenefitsSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-12 max-w-5xl mx-auto">
      {/* Texto a la izquierda */}
      <div className="max-w-lg">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
          Los beneficios van de la mano con tu lealtad...
        </h2>
        <p className="text-gray-700 font-medium mb-5">Beneficios destacados:</p>

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
              <span className="text-red-500 font-bold">Apoya lo local</span>
              <br />
              <span className="text-gray-600 text-sm">
                Al gastar tu dinero en negocios locales, contribuyes a la
                comunidad y la economía de tu zona.
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* Imagen a la derecha */}
      <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
        <img
          src={BeneficiosImg}
          alt="Beneficios"
          className="max-w-xs md:max-w-lg"
        />
      </div>
    </div>
  );
};

export default BenefitsSection;
