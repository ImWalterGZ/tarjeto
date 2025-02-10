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

export default function NavBoton({ texto, active }) {
  const SVG = () => {
    const commonClasses = "w-6 h-6";
    
    switch (texto) {
      case "Home":
        return <Home className={commonClasses} />;
      case "Ofertas":
        return <Tag className={commonClasses} />;
      case "Logros":
        return <Award className={commonClasses} />;
      case "Lugares":
        return <MapPin className={commonClasses} />;
      case "Ajustes":
        return <Settings className={commonClasses} />;
      case "Estadísticas":
        return <BarChart2 className={commonClasses} />;
      case "Mi negocio":
        return <Store className={commonClasses} />;
      default:
        return null;
    }
  };

  return (
    <div className={`
      flex flex-col items-center justify-center cursor-pointer transition-all duration-200
      p-3 rounded-xl text
      
    `}>
      <SVG />
      <span className={`mt-1 text-xs text-center ${active ? 'text-white' : 'text-gray-300'}`}>
        {texto}
      </span>
    </div>
  );
}
