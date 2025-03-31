import React from "react";
import BotoneraHeroSection from "./BotoneraHeroSection";

const konga = "/images/tarjetas/KONGA.webp";
const caffenio = "/images/tarjetas/CAFFENIO.webp";
const shugu = "/images/tarjetas/SHUGU.webp";
const logo = "/images/isotipo-white.webp";
const wallet = "/images/wallet.webp";

export default function HeroSection() {
  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <div className="flex flex-col md:hidden min-h-screen w-screen">
        {/* Top white section */}
        <div className="bg-white"></div>

        {/* Main red section */}
        <div className="bg-red-primary flex flex-col gap-10 m-3 py-6 px-3 rounded-2xl items-center">
          {/* Logo */}
          <img src={logo} alt="Tarjeto" className="h-9 " />

          {/* Text Content */}
          <div className="text-white text-center">
            <h1 className="text-4xl font-extrabold mb-4">
              Todas tus tarjetas
              <br />
              de lealtad.
              <br />
              Un solo lugar.
            </h1>
            <p className="text-lg ">
              Disfruta de descuentos, consigue promociones exclusivas y sube de
              nivel en los negocios que más te gustan.
            </p>
          </div>

          {/* Wallet Image */}
          <img src={wallet} alt="Tarjetas" className="w-full " />

          {/* Spacer to push buttons to bottom */}
          <div className="flex flex-row bg-gray-background w-full p-2 rounded-full gap-2">
            {/* "Cómo funciona" button */}
            <div className="w-1/2">
              <button className="w-full bg-white text-black h-14 rounded-full font-bold text-md border border-gray-200 shadow-md">
                Cómo funciona
              </button>
            </div>

            {/* "Comenzar" button */}
            <div className="w-1/2">
              <button className="w-full bg-red-600 shadow-md text-white h-14 rounded-full font-bold text-md">
                Comenzar
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section with buttons */}
      </div>

      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block w-full px-12">
        <div className="flex flex-row py-20 overflow-hidden">
          <div className="bg-red-primary overflow-y-visible rounded-2xl h-[665px] flex flex-row justify-between items-center">
            <div className="flex flex-col w-5/12 m-16 gap-10">
              <div className="text-white h-4/6">
                <p className="font-extrabold leading-snug text-left text-7xl">
                  Con tarjeto, tus visitas cuentan.
                </p>
                <p className="block text-2xl font-medium leading-relaxed text-left h-2/6 font-poppins">
                  Disfruta de descuentos, consigue promociones exclusivas y sube
                  de nivel en los negocios que más te gustan.
                </p>
              </div>
              <div>
                <BotoneraHeroSection />
              </div>
            </div>

            <div className="relative flex flex-col w-6/12 2xl:w-4/12 max-w-screen">
              <img
                src={konga}
                className="absolute bottom-36 left-20 drop-shadow-2xl hover:bottom-40 hover:-translate-x-3 transition-all duration-300 ease-in-out"
                alt="Konga card"
              />
              <img
                src={shugu}
                className="absolute drop-shadow-2xl hover:-translate-x-11 transition-all duration-300 ease-in-out"
                alt="Shugu card"
              />
              <img
                src={caffenio}
                className="relative mb-10 top-36 left-20 drop-shadow-2xl hover:-translate-x-3 hover:translate-y-4 transition-all duration-300 ease-in-out"
                alt="Caffenio card"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
