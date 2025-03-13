import React from "react";
import Fidelity from "../../assets/Fidelity.png";

const LandingComp1 = () => {
    return (
      <div className="flex items-center justify-center p-6 bg-white">
        <div className="flex items-center gap-12">
          {/* Left side with image */}
          <div className="mr-4">
            <img 
              src={Fidelity}
              alt="Fidelidad" 
              className="w-[32rem] object-contain mt-[-2rem]" // Solo se aplica el margen superior a la imagen
            />
          </div>
  
          {/* Right side with text */}
          <div className="max-w-xl mt-[1rem]">
            <h1 className="text-5xl md:text-5xl font-bold text-gray-800 mb-4">
              Tu <span className="text-red-500">app de fidelidad</span> para 
              tus lugares favoritos.
            </h1>
            <p className="text-base md:text-2xl">
                <br />
              <br />Con Tarjeto, cada visita a tu negocio favorito cuenta.{' '}
              <span className="font-bold">Registra tus visitas y acumula puntos</span>{' '}
              que se transforman en descuentos, promociones y ofertas exclusivas. 
              Cada negocio tiene sus propias recompensas, y tú{' '}
              <span className="text-red-500 font-bold">
                las desbloqueas con tu lealtad
              </span>.
            </p>
          </div>
        </div>
      </div>
    );
};

export default LandingComp1;
