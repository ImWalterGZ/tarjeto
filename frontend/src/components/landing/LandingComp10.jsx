import React from "react";

const SectionHeader = () => {
  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden relative w-full h-[200px]">
        {/* Div principal con borde redondeado en la parte inferior, sombra y centrado de texto */}
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-b-[20px] flex justify-center items-center h-full pt-10 pb-10 z-20 shadow-md">
          <h2 className="text-red-500 text-xl font-bold text-center px-4">
            Porque cada visita puede ser la mejor.
          </h2>
        </div>
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block relative w-full h-[400px]">
        {/* Div principal con borde redondeado en la parte inferior, sombra y centrado de texto */}
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-b-[29px] flex justify-center items-center h-full pt-20 pb-20 z-20 shadow-lg">
          <h2 className="text-red-500 text-3xl font-bold text-center">
            Porque cada visita puede ser la mejor.
          </h2>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
