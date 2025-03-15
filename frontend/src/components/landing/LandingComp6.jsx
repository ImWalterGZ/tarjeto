import React from "react";

const testimonials = [
  {
    name: "María López",
    role: "dueña de Pastelería Dulce Hogar",
    image: new URL("../../assets/landing/maria.png", import.meta.url).href,
    text: "Con Tarjeto, mis clientes regresan más seguido y están felices con sus recompensas. ¡Es una maravilla!",
    textColor: "text-red-600",
  },
  {
    name: "Luis Herrera",
    role: "cliente frecuente",
    image: new URL("../../assets/landing/herrera.png", import.meta.url).href,
    text: "Siempre busco negocios con Tarjeto porque sé que mis visitas valen. Termino ahorrando y descubriendo lugares nuevos.",
    textColor: "text-gray-800",
  },
  {
    name: "Andrea Méndez",
    role: "dueña de Boutique La Bella",
    image: new URL("../../assets/landing/andrea.png", import.meta.url).href,
    text: "Ahora tengo una forma fácil de conectar con mis clientes más leales. Las visitas aumentaron desde que usamos Tarjeto.",
    textColor: "text-red-600",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="flex justify-center py-12 px-6">
      <div className="bg-red-600 rounded-2xl max-w-7xl w-full p-20 mt-20">
        {/* Título */}
        <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-6">
          Ellos ya usan Tarjeto. Esto es lo que dicen:
        </h2>

        {/* Contenedor de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-red-700 p-1.5 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-red-600" // Hover effects
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
  );
};

export default TestimonialsSection;
