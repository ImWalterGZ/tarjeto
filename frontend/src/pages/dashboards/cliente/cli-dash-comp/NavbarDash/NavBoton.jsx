import {
  Home,
  MapPin,
  Award,
  Tag,
  Settings,
  BarChart2,
  Store,
} from "lucide-react";

const negocio = ["Home", "Ofertas", "Estadísticas", "Mi negocio", "Ajustes"];

export default function NavBoton({ texto }) {
  const SVG = () => {
    switch (texto) {
      case "Home":
        return <Home className="w-6 h-6 fill-white" />;
      case "Ofertas":
        return <Tag className="w-6 h-6 fill-current" />;
      case "Logros":
        return <Award className="w-6 h-6 fill-current" />;
      case "Lugares":
        return <MapPin className="w-6 h-6 fill-current" />;
      case "Ajustes":
        return <Settings className="w-6 h-6 fill-current" />;
      case "Estadísticas":
        return <BarChart2 className="w-6 h-6 fill-current" />;
      case "Mi negocio":
        return <Store className="w-6 h-6 fill-current" />;
      default:
        return null;
    }
  };

  return (
    <div className="nav-boton">
      <SVG />
      <span>{texto}</span>
    </div>
  );
}
