import React from "react";
const Fidelity = "/images/Fidelity.webp";

const LandingComp1 = () => {
  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden bg-white px-8 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800  text-center">
            Tu <span className="text-red-500">app de fidelidad</span> para tus
            lugares favoritos.
          </h1>

          <img
            src={Fidelity}
            alt="Fidelidad"
            className="w-5/6 max-w-xs object-contain "
          />

          <p className="text-gray-500 text-base text-center">
            Con Tarjeto, cada visita a tu negocio favorito cuenta.{" "}
            <span className="font-semibold">
              Registra tus visitas y acumula puntos
            </span>{" "}
            que se transforman en descuentos, promociones y ofertas exclusivas.
            Cada negocio tiene sus propias recompensas, y tú{" "}
            <span className="text-red-500 font-semibold">
              las desbloqueas con tu lealtad
            </span>
            .
          </p>
        </div>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:flex items-center justify-center py-6 px-12 bg-white">
        <div className="flex items-center gap-12">
          {/* Left side with image */}
          <div className="mr-4">
            <img
              src={Fidelity}
              alt="Fidelidad"
              className="w-[32rem] object-contain mt-[-2rem]"
            />
          </div>

          {/* Right side with text */}
          <div className="max-w-xl mt-[1rem]">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Tu <span className="text-red-500">app de fidelidad</span> para tus
              lugares favoritos.
            </h1>
            <p className="text-gray-500 text-base md:text-2xl">
              <br />
              <br />
              Con Tarjeto, cada visita a tu negocio favorito cuenta.{" "}
              <span className="font-semibold">
                Registra tus visitas y acumula puntos
              </span>{" "}
              que se transforman en descuentos, promociones y ofertas
              exclusivas. Cada negocio tiene sus propias recompensas, y tú{" "}
              <span className="text-red-500 font-semibold">
                las desbloqueas con tu lealtad
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingComp1;
