import React from "react";
const Facebook = "/images/facebook.webp";
const Ig = "/images/ig.webp";
const Tiktok = "/images/tiktok.webp";
const X = "/images/X.webp";
const TarjetoSlogan = "/images/tarjeto-slogan.webp";

const Footer = () => {
  return (
    <>
      {/* Mobile Footer - hidden on desktop */}
      <div className="md:hidden bg-white w-full relative z-4">
        <footer className="bg-red-600 text-white py-8 px-4 mt-[-20px]">
          <div className="mx-auto grid grid-cols-2 gap-6 text-sm">
            {/* Sobre Tarjeto */}
            <div>
              <h3 className="font-bold text-lg mb-2">Sobre tarjeto</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    ¿Qué es Tarjeto?
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Noticias
                  </a>
                </li>
              </ul>
            </div>

            {/* Usuarios */}
            <div>
              <h3 className="font-bold text-lg mb-2">Usuarios</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Descargar app
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Negocios */}
            <div>
              <h3 className="font-bold text-lg mb-2">Negocios</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Registra tu negocio
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Planes y precios
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="font-bold text-lg mb-2">Contáctanos</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="mailto:contacto@tarjeto.com"
                    className="no-underline hover:text-gray-200"
                  >
                    contacto@tarjeto.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:8001234567"
                    className="no-underline hover:text-gray-200"
                  >
                    800-123-4567
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Logo and Newsletter */}
          <div className="mt-8 flex flex-col items-center">
            <img src={TarjetoSlogan} alt="Tarjeto" className="h-16 mb-4" />

            <h3 className="font-bold text-lg mb-1">Newsletter</h3>
            <p className="text-xs mb-3 text-center">
              Suscríbete para recibir noticias y promociones.
            </p>
            <div className="w-full relative">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="p-2 w-full rounded-full text-black text-sm focus:outline-none"
              />
              <button className="bg-red-600 text-sm px-3 py-1 rounded-full font-bold absolute top-1 right-1 border border-white">
                Enviar
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-6 flex justify-center gap-4">
            <a href="#" className="h-8 w-8">
              <img
                src={Facebook}
                alt="Facebook"
                className="h-full w-full object-cover"
              />
            </a>
            <a href="#" className="h-8 w-8">
              <img
                src={Ig}
                alt="Instagram"
                className="h-full w-full object-cover"
              />
            </a>
            <a href="#" className="h-8 w-8">
              <img
                src={Tiktok}
                alt="Tiktok"
                className="h-full w-full object-cover"
              />
            </a>
            <a href="#" className="h-8 w-8">
              <img src={X} alt="X" className="h-full w-full object-cover" />
            </a>
          </div>

          {/* Derechos reservados */}
          <div className="mt-6 text-center text-[10px] text-gray-200">
            <p>© 2024 Tarjeto. Todos los derechos reservados.</p>
            <p className="mt-1">
              Los beneficios y promociones son responsabilidad de los negocios
              afiliados.
            </p>
          </div>
        </footer>
      </div>

      {/* Desktop Footer - hidden on mobile */}
      <div className="hidden md:block bg-white w-full relative z-4">
        <footer className="bg-red-600 text-white py-10 px-6 mt-[-20px]">
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 text-sm justify-items-center items-center">
            {/* Sobre Tarjeto */}
            <div className="text-center mt-8">
              <h3 className="font-bold text-2xl">Sobre tarjeto</h3>
              <ul className="mt-3 space-y-4">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    ¿Qué es Tarjeto?
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Noticias y novedades
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Historias de éxito
                  </a>
                </li>
              </ul>
            </div>

            {/* Usuarios */}
            <div className="text-center mt-8">
              <h3 className="font-bold text-2xl">Usuarios</h3>
              <ul className="mt-3 space-y-4">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Descargar la app
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Beneficios para ti
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Preguntas frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Promociones exclusivas
                  </a>
                </li>
              </ul>
            </div>

            {/* Negocios */}
            <div className="text-center mt-8">
              <h3 className="font-bold text-2xl">Negocios</h3>
              <ul className="mt-3 space-y-4">
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Registra tu negocio
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Planes y precios
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Soporte técnico
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="text-center mt-8">
              <h3 className="font-bold text-2xl">Contáctanos</h3>
              <ul className="mt-3 space-y-4">
                <li>
                  <a
                    href="mailto:contacto@tarjeto.com"
                    className="no-underline hover:text-gray-200"
                  >
                    contacto@tarjeto.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:8001234567"
                    className="no-underline hover:text-gray-200"
                  >
                    800-123-4567
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-gray-200">
                    Términos y condiciones
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Redes sociales y Newsletter */}
          <div className="mt-12 ml-[150px] flex justify-between items-center gap-12">
            {/* Newsletter con logo */}
            <div className="flex items-center space-x-8">
              <img src={TarjetoSlogan} alt="Tarjeto" className="h-32" />
              <div className="text-start">
                <h3 className="font-bold text-2xl">Newsletter</h3>
                <p className="text-sm mt-1">
                  Suscríbete para recibir noticias y promociones exclusivas.
                </p>
                <div className="mt-3 flex justify-center relative">
                  <input
                    type="email"
                    placeholder="Escribe aquí tu correo electrónico"
                    className="p-3 w-[600px] rounded-full text-black focus:outline-none"
                  />
                  <button className="bg-red-600 text-base px-4 py-2 rounded-full font-bold absolute top-1 right-1 w-[150px]">
                    Enviar
                  </button>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="mr-48 grid grid-cols-2 gap-4">
              <a href="#" className="h-10 w-10">
                <img
                  src={Facebook}
                  alt="Facebook"
                  className="h-full w-full object-cover"
                />
              </a>
              <a href="#" className="h-10 w-10">
                <img
                  src={Ig}
                  alt="Instagram"
                  className="h-full w-full object-cover"
                />
              </a>
              <a href="#" className="h-10 w-10">
                <img
                  src={Tiktok}
                  alt="Tiktok"
                  className="h-full w-full object-cover"
                />
              </a>
              <a href="#" className="h-10 w-10">
                <img src={X} alt="X" className="h-full w-full object-cover" />
              </a>
            </div>
          </div>

          {/* Derechos reservados */}
          <div className="mt-16 text-center text-xs text-gray-200">
            <p>© 2024 Tarjeto. Todos los derechos reservados.</p>
            <br />
            <p>
              Los beneficios y promociones son responsabilidad de los negocios
              afiliados. Tarjeto es una plataforma intermediaria que facilita la
              experiencia de recompensas.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
