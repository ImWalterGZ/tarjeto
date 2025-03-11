import React, { useState } from "react";
import AccesoItem from "./AccesoItem";
import { Tag, Ticket, Gift, Calendar, Plus } from "lucide-react";
import PromoDrawer from "../../../../components/promociones/PromoDrawer";

const AccesosRapidos = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const Accesos = [
    {
      title: "Crear Promoción",
      description: "Crea una nueva promoción para tu negocio",
      icon: Plus,
      onClick: () => setIsDrawerOpen(true),
    },
    {
      title: "Crear Promo",
      description: "Crea una promoción especial",
      icon: Tag,
      onClick: () => {},
    },
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Accesos Rápidos</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Accesos.map((acceso, index) => (
          <AccesoItem key={index} {...acceso} />
        ))}
      </div>

      <PromoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default AccesosRapidos;
