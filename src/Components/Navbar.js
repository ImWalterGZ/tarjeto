import React from "react";
import logo from "../assets/isotipo-red.png";

export default function Navbar() {
  return (
    <div className="max-w-screen h-16">
      <nav className="  h-full flex flex-row justify-around items-center ">
        <img
          src={logo}
          className="h-9 w-auto object-contain pl-4 "
          alt="Logo"
        />
        <div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 font-bold text-gray-700 ">
            <li>
              <a className="block">Sobre nosotros</a>
            </li>
            <li>
              <a>Contacto</a>
            </li>
            <a className="text-red-primary">Negocios</a>
          </ul>
        </div>
        <div className="bg-red-primary w-2/12 h-12 text-center flex items-center justify-center text-white font-extrabold rounded-3xl">
          Accede a tarjeto
        </div>
      </nav>
    </div>
  );
}
