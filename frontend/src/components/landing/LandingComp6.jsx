import React from "react";
import Maria from "../../assets/Landing/maria.png";
import Herrera from "../../assets/Landing/herrera.png";
import Andrea from "../../assets/Landing/andrea.png";

const testimonials = [
  {
    name: "María López",
    role: "dueña de Pastelería Dulce Hogar",
    image: Maria,
    text: "Con Tarjeto, mis clientes regresan más seguido y están felices con sus recompensas. ¡Es una maravilla!",
    textColor: "text-red-600",
  },
  {
    name: "Luis Herrera",
    role: "cliente frecuente",
    image: Herrera,
    text: "Siempre busco negocios con Tarjeto porque sé que mis visitas valen. Termino ahorrando y descubriendo lugares nuevos.",
    textColor: "text-red-600",
  },
  {
    name: "Andrea Méndez",
    role: "dueña de Boutique La Bella",
    image: Andrea,
    text: "Ahora tengo una forma fácil de conectar con mis clientes más leales. Las visitas aumentaron desde que usamos Tarjeto.",
    textColor: "text-red-600",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="flex justify-center py-12 px-6">
      <div className="bg-red-600 rounded-2xl max-w-7xl w-full h-full p-20 mt-20">
        {/* Título */}
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-12">
          Ellos ya usan Tarjeto. Esto es lo que dicen:
        </h2>

        {/* Contenedor de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-red-700 p-2 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg " // Hover effects
            >
              <div className="bg-white rounded-lg p-6 text-center shadow-md flex flex-col h-full">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className=" w-16 h-16 rounded-full mx-auto object-cover mb-6"
                />
                <h3 className={`text-xl font-bold ${testimonial.textColor}`}>
                  {testimonial.name},{" "}
                  <span className="font-normal">{testimonial.role}</span>
                </h3>
                <p className="text-lg font-semibold mt-6">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
