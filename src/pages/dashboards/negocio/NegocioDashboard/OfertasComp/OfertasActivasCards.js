import { ReactComponent as Trash } from "../Iconos/trash.svg";
import { ReactComponent as Lapiz } from "../Iconos/Lapiz.svg";
export default function OfertasActivasCards({ titulo, nivel, fecha }) {
  const nivelFlag = (nivel) => {
    switch (nivel) {
      case 0:
        return "Para todos los usuarios";
      case 1:
        return "Para clientes Bronce";
      case 2:
        return "Para clientes Plata";
      case 3:
        return "Para clientes Rubi";
      case 4:
        return "Para clientes Oro";
      default:
        return "Para todos los usuarios";
    }
  };

  const flagColor = () => {
    switch (nivel) {
      case 0:
        return "bg-gray-600 text-white";
      case 1:
        return "bg-bronce-cd text-white";
      case 2:
        return "bg-plata-cd";
      case 3:
        return "bg-red-primary text-white";
      case 4:
        return "bg-dorado-cd";
      default:
        return "bg-gray-600 text-white";
    }
  };
  return (
    <div className="h-full w-full bg-white shadow-md p-5 rounded-lg ">
      <h1 className="text-md">{titulo}</h1>
      <div className="w-full flex flex-row justify-between items-center">
        <h2
          className={`text-sm  inline px-2 py-.5 rounded-md font-semibold ${flagColor(
            nivel
          )}`}
        >
          {nivelFlag(nivel)}
        </h2>
        <div className="rounded-xl bg-white drop-shadow-md hover:drop-shadow-xl hover:bg-neutral-300 transition-all px-2 py-1 flex  justify-between divide-x-2  ">
          <div className="mr-1 flex-grow text-center">
            <Trash />
          </div>
          <div className="ml-1 flex-grow text-center">
            <Lapiz />
          </div>
        </div>
      </div>
    </div>
  );
}
