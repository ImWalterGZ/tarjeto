import React from 'react';

const SectionHeader = () => {
  return (
    <div className="relative w-full h-[400px]">
      {/* Div principal con borde redondeado en la parte inferior, sombra y centrado de texto */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-b-[29px] flex justify-center items-center h-full pt-20 pb-20 z-20 shadow-lg">
        <h2 className="text-red-500 text-3xl font-bold text-center">
          Porque cada visita puede ser la mejor.
        </h2>
      </div>
    </div>
  );
};

export default SectionHeader;
