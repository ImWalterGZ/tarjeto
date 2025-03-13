import React, { useState } from "react";
import AccesoItem from "./AccesoItem";
import { Tag, Ticket, Gift, Calendar, Plus } from "lucide-react";
import PromoDrawer from "../../../../components/promociones/PromoDrawer";

const AccesosRapidos = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const Accesos = [
    {
      title: "Crear Cupón",
      description: "Crea un cupón de descuento",
      icon: Ticket,
      onClick: () => {},
    },
    {
      title: "Crear Premio",
      description: "Crea un premio para tus clientes",
      icon: Gift,
      onClick: () => {},
    },
    {
      title: "Crear Evento",
      description: "Crea un evento especial",
      icon: Calendar,
      onClick: () => {},
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-900">Accesos Rápidos</h2>
      <div className="grid grid-cols-4 grid-rows-1 rounded-xl ">
        <div className="p-2 h-full w-full rounded-xl">
          <div className="">
            <AccesoItem
              title="Crear Promoción"
              icon={Plus}
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </div>
        <div className="col-span-3 col-start-2 flex flex-col gap-4 justify-center">
          <div className="flex flex-col gap-4  justify-center bg-gray-background rounded-xl p-2">
            <div className="flex flex-row gap-2 h-full">
              {Accesos.map((acceso, index) => (
                <AccesoItem key={index} {...acceso} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <PromoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default AccesosRapidos;
