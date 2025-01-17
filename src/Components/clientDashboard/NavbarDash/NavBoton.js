import HomeSVG from "./Icons/home.svg";
import LocationSVG from "./Icons/location.svg";
import LogrosSVG from "./Icons/logros.svg";
import OfertaSVG from "./Icons/oferta.svg";
import SettingsSVG from "./Icons/settings.svg";

export default function NavBoton({ texto }) {
  const SVG = () => {
    switch (texto) {
      case "Home":
        return HomeSVG;
      case "Ofertas":
        return OfertaSVG;
      case "Logros":
        return LogrosSVG;
      case "Lugares":
        return LocationSVG;
      case "Ajustes":
        return SettingsSVG;
    }
  };

  return (
    <div className=" h-12 w-5/6 flex flex-col items-center justify-center">
      <div className="bg-white bg-opacity-25 px-4 flex flex-col items-center rounded-3xl py-1">
        <img src={SVG()} alt="" className="w-10/12 " />
      </div>
      <p className="text-white">{texto}</p>
    </div>
  );
}
