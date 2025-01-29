import AccesoItem from "./AccesoItem";
import { Tag, Ticket, Gift, Calendar } from "lucide-react";

export default function AccesosRapidos() {
  const Accesos = [
    {
      icono: <Tag className="w-9" />,
      texto: "Crear Promo",
    },
    {
      icono: <Ticket className="w-9" />,
      texto: "Crear Cupon",
    },
    {
      icono: <Gift className="w-9" />,
      texto: "Crear Premio",
    },
    {
      icono: <Calendar className="w-9" />,
      texto: "Crear Evento",
    },
  ];

  return (
    <div className="flex flex-col mb-2 align-middle w-full">
      <h3 className="font-nunito font-bold text-red-primary text-xl">
        Accesos Rapidos
      </h3>
      <div className="h-32 grid xl:grid-cols-4 md:grid-cols-2 md:grid-rows-2 xl:grid-rows-1 px-4 py-3 gap-3 bg-gray-100 rounded-xl font-nunito text-red-primary font-semibold">
        {Accesos.map((item, index) => (
          <AccesoItem key={index} icono={item.icono} texto={item.texto} />
        ))}
      </div>
    </div>
  );
}
