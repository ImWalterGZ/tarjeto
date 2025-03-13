import React from "react";
import Local from "../../assets/Landing/Local.png";

const BenefitsSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white py-12 max-w-5xl mx-auto">
      {/* Texto a la izquierda */}
      <div className="max-w-lg">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10">
          Porque lo local es lo que importa.
        </h2>
        <p className="text-gray-700 text-xl font-semibold mb-5">En Tarjeto, no solo se trata de puntos y recompensas. Se trata de <span className="text-red-600">apoyar a los negocios</span> que son parte de tu día a día, de descubrir nuevos lugares y de obtener algo a cambio por tu lealtad. Cada visita cuenta, y aquí sí se nota.</p>

        <ul className="relative pl-10">
          {/* Línea roja */}
          <div className="absolute left-4 top-5 bottom-12 w-[2px] bg-red-500"></div>

          {/* Beneficio 1 */}
          <li className="relative flex items-start gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
            <div>
              <span className="text-red-500 text-2xl font-bold mt-10">Conectamos a clientes con negocios locales.</span><br />
            </div>
          </li>

          {/* Beneficio 2 */}
          <li className="relative flex items-start gap-3 mb-4 mt-6">
            <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
            <div>
              <span className="text-red-500 text-2xl font-bold">Recompensas únicas en cada lugar.</span><br />
            </div>
          </li>

          {/* Beneficio 3 */}
          <li className="relative flex items-start gap-3 mt-6">
            <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
            <div>
              <span className="text-red-500 text-2xl font-bold">Una app fácil, práctica y hecha para ti.</span><br />
            </div>
          </li>

          {/* Beneficio 3 */}
          <li className="relative flex items-start gap-3 mt-6">
            <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-[29px] top-2"></div>
            <div>
              <span className="text-red-500 text-2xl font-bold">Herramienta para que los negocios crezcan.</span><br />
            </div>
          </li>
        </ul>
      </div>

      {/* Imagen a la derecha */}
      <div className="mt-12 md:mt-2 md:w-1/2 justify-center">
        <img 
          src={Local} 
          alt="Local" 
          className="max-w-xs md:max-w-md ml-32"
        />
      </div>
    </div>
  );
};

export default BenefitsSection;
