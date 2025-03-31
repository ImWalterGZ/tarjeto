import React from "react";
const Perlita = "/images/perlita.webp";
const Shugu = "/images/shugu.webp";
const Cuichi = "/images/cuichi.webp";
const Obregon = "/images/obregon.webp";
const Caffenio = "/images/caffenio.webp";

const businesses = [
  {
    name: "La Cuichi",
    address: "Barragán 6300, Fraccionamiento, 31124 Chihuahua, Chih.",
    image: Cuichi,
    link: "/cuichi",
  },
  {
    name: "Taquería Obregón",
    address:
      "Perif. de la Juventud 8705, Lomas Universidad, 31123 Chihuahua, Chih.",
    image: Obregon,
    link: "/obregon",
  },
  {
    name: "SHUGU",
    address:
      "Periférico de la Juventud 8109-3, Col. Jardines del Saucito, 31123 Chihuahua, Chih.",
    image: Shugu,
    link: "/shugu",
  },
  {
    name: "Perlita Zúñiga Joyería",
    address: "Av Francisco Villa 5911, Panamericana, 31210 Chihuahua, Chih.",
    image: Perlita,
    link: "/perlita",
  },
  {
    name: "Cafennio",
    address: "Av. Mirador 2303, Campestre-Lomas, 31205 Chihuahua, Chih.",
    image: Caffenio,
    link: "/cafe",
  },
];

const Carousel = () => {
  return (
    <div className="overflow-hidden w-full max-w-5xl mx-auto mt-20 px-4 relative">
      {/* Texto principal */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Más de 100 negocios locales ya están en Tarjeto.
          <span className="text-red-600"> ¿El tuyo, cuándo?</span>
        </h2>
        <p className="text-gray-600 mt-10">
          Desde tu taquería favorita hasta esa tienda de regalos donde
          encuentras de todo, Tarjeto conecta a los negocios con su gente.
          <span className="font-semibold">
            {" "}
            Únete al movimiento que hace más grande a los pequeños.
          </span>
        </p>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden w-full max-w-5xl mx-auto mt-10 relative">
        {/* Desenfoque a los lados */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-white  to-transparent " />
          <div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-white to-transparent" />
        </div>

        <div
          className="flex animate-carousel"
          style={{
            display: "flex",
            width: `${businesses.length * 4}%`, // Total ancho basado en el 4% por cada cuadro
          }}
        >
          {/* Duplicamos los elementos para crear el efecto infinito */}
          {[...businesses, ...businesses].map((business, i) => (
            <div
              key={i}
              className="min-w-[150%] flex flex-col items-center p-4"
            >
              <a href={business.link} className="w-full">
                <div className="bg-white rounded-lg shadow-md p-4 w-full h-56">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="text-xs font-semibold text-red-600 mt-2">
                    {business.name}
                  </h3>
                  <p className="text-gray-600 text-xs">{business.address}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Botón CTA */}
      <div className="flex justify-center mt-6">
        <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          Registra tu negocio y súmate al movimiento
        </button>
      </div>

      <style>
        {`
          @keyframes carousel {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${businesses.length * 150}%);
            }
          }
          .animate-carousel {
            animation: carousel 50s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Carousel;
