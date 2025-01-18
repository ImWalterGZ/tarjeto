import { ReactComponent as HomeIcon } from "./Icons/home.svg";
import { ReactComponent as LocationIcon } from "./Icons/location.svg";
import { ReactComponent as LogrosIcon } from "./Icons/logros.svg";
import { ReactComponent as OfertaIcon } from "./Icons/oferta.svg";
import { ReactComponent as SettingsIcon } from "./Icons/settings.svg";
import { ReactComponent as StatisticsIcon } from "./Icons/statistics.svg";
import { ReactComponent as NegocioIcon } from "./Icons/store.svg";
const negocio = ["Home", "Ofertas", "Estadísticas", "Mi negocio", "Ajustes"];

export default function NavBoton({ texto }) {
  const SVG = () => {
    switch (texto) {
      case "Home":
        return <HomeIcon className="w-6 h-6 fill-white" />;
      case "Ofertas":
        return <OfertaIcon className="w-6 h-6 fill-current" />;
      case "Logros":
        return <LogrosIcon className="w-6 h-6 fill-current" />;
      case "Lugares":
        return <LocationIcon className="w-6 h-6 fill-current" />;
      case "Ajustes":
        return <SettingsIcon className="w-6 h-6 fill-current" />;
      case "Estadísticas":
        return <StatisticsIcon className="w-6 h-6 fill-current" />;
      case "Mi negocio":
        return <NegocioIcon className="w-6 h-6 fill-current" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-5/6 h-12 ">
      <div className="flex flex-col items-center px-4 py-1 bg-white bg-opacity-25 rounded-3xl ">
        {SVG()}
      </div>
      <p className="text-white">{texto}</p>
    </div>
  );
}
