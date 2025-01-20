import AccesoItem from "./AccesoItem";
import { ReactComponent as CrearPromo } from "./Iconos/crearPromo.svg";
import { ReactComponent as CrearCupon } from "./Iconos/crearCupon.svg";
import { ReactComponent as CrearRecompensa } from "./Iconos/CrearRecompensa.svg";
import { ReactComponent as CrearEvento } from "./Iconos/crearEvento.svg";
export default function AccesosRapidos() {
  const Accesos = [
    {
      icono: <CrearPromo className="w-9" />,
      texto: "Crear Promo",
    },
    {
      icono: <CrearCupon className="w-9" />,
      texto: "Crear Cupon",
    },
    { icono: <CrearRecompensa className="w-9" />, texto: "Crear Premio" },
    { icono: <CrearEvento className="w-9" />, texto: "Crear Evento" },
  ];
  return (
    <div className="flex flex-col mb-2 align-middle w-full">
      <h3 className="font-nunito font-bold text-red-primary text-xl">
        Accesos Rapidos
      </h3>
      <div
        className="h-32 grid xl:grid-cols-4 md:grid-cols-2 md:grid-rows-2 xl:grid-rows-1 px-4 py-3 gap-3 bg-gray-100  rounded-xl font-nunito text-red-primary
      font-semibold"
      >
        {Accesos.map((item) => (
          <AccesoItem key={item.id} icono={item.icono} texto={item.texto} />
        ))}
      </div>
    </div>
  );
}
