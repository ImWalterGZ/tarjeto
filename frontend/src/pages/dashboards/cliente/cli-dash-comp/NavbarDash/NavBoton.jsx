import {
  Home,
  MapPin,
  Award,
  Tag,
  Settings,
  BarChart2,
  Store,
  Box,
} from "lucide-react";

export default function NavBoton({ texto, active, onClick }) {
  const SVG = () => {
    const commonClasses = `w-6 h-6 ${
      active ? "text-red-primary" : "text-white"
    }`;

    switch (texto) {
      case "Inicio":
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
      case "Nexo":
        return <Box className={commonClasses} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 w-20"
    >
      <div
        className={`
          px-4 py-2 rounded-full
          transition-all duration-200 ease-in-out
          ${
            active
              ? "bg-white hover:bg-gray-50"
              : "bg-[#F75D63] hover:bg-[#FF6B71]"
          }
        `}
      >
        <SVG />
      </div>
      <span className="text-xs font-medium text-white">{texto}</span>
    </button>
  );
}
