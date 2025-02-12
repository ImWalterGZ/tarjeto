import React, { useState } from "react";

const promotions = [
  {
    business: "Joyería Perlita Zuriaga",
    description: "Recibe 10% de descuento al acumular 5 visitas.",
    tag: "Para todos los usuarios",
    tagColor: "bg-red-600", // Color rojo
    borderColor: "border-red-600", // Borde rojo
    image: "/images/joyeria.png",
    position: "top-8 left-0",
    zIndex: "z-30",
  },
  {
    business: "Papelería Estudiante Estrella",
    description: "Descuento de $100 en compras mayores a $500 después de 8 visitas.",
    tag: "Solo usuarios PLATA o superior",
    tagColor: "bg-slate-500", // Color plata
    borderColor: "border-slate-500", // Borde plata
    image: "/images/papeleria.png",
    position: "top-36 left-64",
    zIndex: "z-20",
  },
  {
    business: "Mantel Rojo",
    description: "1 taco gratis por cada 10 visitas registradas.",
    tag: "Solo usuarios ORO",
    tagColor: "bg-yellow-500", // Color oro
    borderColor: "border-yellow-500", // Borde oro
    image: "/images/mantelrojo.png",
    position: "top-64 left-0",
    zIndex: "z-10",
  },
];

const PromotionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-8 mt-20">
      {/* Sección de promociones a la izquierda */}
      <div className="md:w-3/5 relative h-96">
        {promotions.map((promo, index) => (
          <div
            key={index}
            className={`absolute w-96 p-4 rounded-lg bg-white flex items-center gap-4 transition-all transform 
              border-2 shadow-md shadow-gray-300
              ${hoveredIndex === index ? promo.borderColor : "border-transparent"}
              ${promo.position} ${promo.zIndex}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Imagen del negocio */}
            <img src={promo.image} alt={promo.business} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h3 className="text-gray-800 font-semibold">{promo.business}</h3>
              <p className="text-gray-600 text-sm">{promo.description}</p>
              <span className={`text-white text-xs px-3 py-1 rounded-md mt-2 inline-block ${promo.tagColor}`}>
                {promo.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de texto a la derecha */}
      <div className="md:w-2/5 text-left pl-10">
        <h2 className="text-5xl font-bold text-gray-800 leading-tight">
          Las promos que la <span className="text-red-500">están rompiendo</span> ahora.
        </h2>
        <p className="text-gray-600 mt-6">
          Descubre las mejores promociones activas en los negocios afiliados a Tarjeto.
          <span className="font-bold"> ¿Qué esperas para aprovecharlas?</span>
        </p>
        <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          Ver las promociones activas
        </button>
      </div>
    </div>
  );
};

export default PromotionsSection;
