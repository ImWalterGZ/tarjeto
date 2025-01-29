import konga from "../../assets/tarjetas/KONGA.png";
import caffenio from "../../assets/tarjetas/CAFFENIO.png";
import shugu from "../../assets/tarjetas/SHUGU.png";
import BotoneraHeroSection from "./BotoneraHeroSection";
export default function HeroSection() {
  return (
    <div className="w-screen px-12">
      <div className="flex flex-row py-20 overflow-hidden ">
        <div className="bg-red-primary   overflow-y-visible rounded-2xl h-[665px] flex flex-row justify-between items-center left-1">
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
              className="absolute bottom-36 left-20 drop-shadow-2xl hover:bottom-40 hover:-translate-x-3 transition-all duration-300 ease-in-out "
              alt=""
            />
            <img
              src={shugu}
              className="absolute drop-shadow-2xl hover:-translate-x-11 transition-all duration-300 ease-in-out "
              alt=""
            />
            <img
              src={caffenio}
              className="relative mb-10 top-36 left-20 drop-shadow-2xl hover:-translate-x-3 hover:translate-y-4 transition-all duration-300 ease-in-out "
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
