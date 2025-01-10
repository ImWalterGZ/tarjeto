import React from "react";

const BotoneraHeroSection = () => {
  return (
    <div className="w-full bg-[#f2f2f2] h-24 rounded-full flex flex-row items-center justify-around font-bold text-2xl">
      <div className="bg-red-primary h-2/3 w-5/12 rounded-full flex items-center justify-center drop-shadow-xl hover:scale-105 transition-all duration-300 hover:drop-shadow-2xl">
        <p className="text-white ">Únete ahora</p>
      </div>
      <div className="bg-white h-2/3 w-5/12 rounded-full flex items-center justify-center drop-shadow-xl hover:scale-105 transition-all duration-300 hover:drop-shadow-2xl">
        <p>Cómo funciona</p>
      </div>
    </div>
  );
};

export default BotoneraHeroSection;
