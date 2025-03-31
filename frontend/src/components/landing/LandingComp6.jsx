import React from "react";

const testimonials = [
  {
    name: "María López",
    role: "dueña de Pastelería Dulce Hogar",
    image: "/images/maria.webp",
    text: "Con Tarjeto, mis clientes regresan más seguido y están felices con sus recompensas. ¡Es una maravilla!",
    textColor: "text-red-600",
  },
  {
    name: "Luis Herrera",
    role: "cliente frecuente",
    image: "/images/herrera.webp",
    text: "Siempre busco negocios con Tarjeto porque sé que mis visitas valen. Termino ahorrando y descubriendo lugares nuevos.",
    textColor: "text-gray-800",
  },
  {
    name: "Andrea Méndez",
    role: "dueña de Boutique La Bella",
    image: "/images/andrea.webp",
    text: "Ahora tengo una forma fácil de conectar con mis clientes más leales. Las visitas aumentaron desde que usamos Tarjeto.",
    textColor: "text-red-600",
  },
];

const TestimonialsSection = () => {
  return (
    <>
      {/* Mobile version - hidden on desktop */}
      <section className="md:hidden px-8">
        <div className="bg-red-600 rounded-2xl w-full p-6">
          {/* Título */}
          <h2 className="text-white text-2xl font-bold text-center mb-6">
            Ellos ya usan Tarjeto. Esto es lo que dicen:
          </h2>

          {/* Contenedor de testimonios */}
          <div className="flex flex-col gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-red-700 p-1.5 rounded-xl">
                <div className="bg-white rounded-lg p-4 text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mx-auto object-cover mb-3"
                  />
                  <h3
                    className={`font-semibold ${testimonial.textColor} text-sm`}
                  >
                    {testimonial.name},{" "}
                    <span className="font-normal">{testimonial.role}</span>
                  </h3>
                  <p className="text-gray-700 mt-2 text-sm">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop version - hidden on mobile */}
      <section className="hidden md:flex justify-center py-12 px-6">
        <div className="bg-red-600 rounded-2xl max-w-7xl w-full p-20 mt-20">
          {/* Título */}
          <h2 className="text-white text-4xl font-bold text-center mb-6">
            Ellos ya usan Tarjeto. Esto es lo que dicen:
          </h2>

          {/* Contenedor de testimonios */}
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-red-700 p-1.5 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-red-600"
              >
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover mb-4"
                  />
                  <h3 className={`font-semibold ${testimonial.textColor}`}>
                    {testimonial.name},{" "}
                    <span className="font-normal">{testimonial.role}</span>
                  </h3>
                  <p className="text-gray-700 mt-3">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
