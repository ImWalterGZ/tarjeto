import { Trash2, Edit3 } from "lucide-react";

export default function OfertasActivasCards({
  titulo,
  descripcion,
  nivel,
  nivelNombre,
}) {
  console.log(
    `OfertasActivasCards: Rendering card - "${titulo}" - level ${nivel} (${nivelNombre})`
  );

  const nivelFlag = (nivel, nivelNombre) => {
    if (nivelNombre) {
      return `Para clientes ${nivelNombre}`;
    }

    switch (nivel) {
      case 0:
        return "Para todos los usuarios";
      case 1:
        return "Para clientes Bronce";
      case 2:
        return "Para clientes Plata";
      case 3:
        return "Para clientes Oro";
      case 4:
        return "Para clientes Rubi";
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
        return "bg-dorado-cd";
      case 4:
        return "bg-red-primary text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const flagText = nivelFlag(nivel, nivelNombre);
  const colorClass = flagColor();
  console.log(
    `OfertasActivasCards: Flag text: "${flagText}", color class: "${colorClass}"`
  );

  return (
    <div className="h-full w-full bg-white shadow-md p-5 rounded-lg flex flex-col justify-between">
      <div>
        <h1 className="text-md font-semibold mb-2">{titulo}</h1>
        {descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {descripcion}
          </p>
        )}
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <h2
          className={`text-sm inline px-2 py-.5 rounded-md font-semibold ${colorClass}`}
        >
          {flagText}
        </h2>
        <div className="rounded-xl bg-white drop-shadow-md hover:drop-shadow-xl hover:bg-neutral-300 transition-all px-2 py-1 flex justify-between divide-x-2">
          <div className="mr-1 flex-grow text-center">
            <Trash2 size={18} />
          </div>
          <div className="ml-1 flex-grow text-center">
            <Edit3 size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
