import tresTarjetas from "../assets/tres-tarjetas.png";
import konga from "../assets/tarjetas/KONGA.png";
import caffenio from "../assets/tarjetas/CAFFENIO.png";
import shugu from "../assets/tarjetas/SHUGU.png";
import BotoneraHeroSection from "./BotoneraHeroSection";
export default function HeroSection() {
  return (
    <div className="px-12 w-screen">
      <div className="flex  flex-row overflow-hidden py-20 ">
        <div className="bg-red-primary   overflow-y-visible rounded-2xl h-[665px] flex flex-row justify-between items-center left-1">
          <div className="flex flex-col w-5/12 m-16 gap-10">
            <div className="text-white h-4/6">
              <p className="font-extrabold text-7xl text-left leading-snug">
                Con tarjeto, tus visitas cuentan.
              </p>
              <p className="text-left text-2xl font-medium block h-2/6 leading-relaxed font-poppins">
                Disfruta de descuentos, consigue promociones exclusivas y sube
                de nivel en los negocios que más te gustan.
              </p>
            </div>
            <div>
              <BotoneraHeroSection />
            </div>
          </div>

          <div className="relative w-6/12 2xl:w-4/12 flex flex-col max-w-screen">
            <img
              src={konga}
              className="absolute bottom-36 left-20 drop-shadow-2xl hover:bottom-40 hover:-translate-x-3 transition-all duration-300 ease-in-out   "
              alt=""
            />
            <img
              src={shugu}
              className="absolute drop-shadow-2xl hover:-translate-x-11 transition-all duration-300 ease-in-out "
              alt=""
            />
            <img
              src={caffenio}
              className="relative top-36 left-20 drop-shadow-2xl hover:-translate-x-3 hover:translate-y-4 transition-all duration-300 ease-in-out mb-10 "
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
