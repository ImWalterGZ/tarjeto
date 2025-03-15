import React from "react";
const Porcentage = "/images/porcentage.png";

const RegistrationPromo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-14">
      {/* Contenedor flex para la imagen y el texto, desplazado un poco a la izquierda */}
      <div className="flex flex-col md:flex-row items-start gap-8 -ml-24">
        {/* Lado Izquierdo - Imagen */}
        <div className="w-[500px] flex-shrink-0">
          <img src={Porcentage} alt="Porcentage" className="w-full h-auto" />
        </div>

        {/* Lado Derecho - Texto y Botones */}
        <div className="flex-1 mt-32">
          <h1 className="text-4xl font-bold mb-6">
            Ya somos muchos.{" "}
            <span className="text-red-500">Solo faltas tú.</span>
          </h1>
          <p className="text-gray-600 text-base mb-4">
            Unirte es fácil, y aprovechar tus compras aún más. Haz que cada peso
            cuente,{" "}
            <span className="font-semibold">
              haz que cada visita valga la pena.
            </span>
          </p>

          {/* Contenedor de botones con fondo gris */}
          <div className="flex justify-center mt-6 gap-x-6">
            <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 hover:shadow-lg w-full max-w-[200px] whitespace-nowrap">
              Regístrate gratis
            </button>
            <button className="mt-6 bg-white text-base px-12 py-3 rounded-full font-semibold shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_-4px_6px_rgba(0,0,0,0.1)] transition-transform transform hover:scale-105 hover:shadow-xl w-full max-w-[300px] whitespace-nowrap">
              Descubre todos los negocios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPromo;
