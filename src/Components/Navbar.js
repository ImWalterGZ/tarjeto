import React from "react";
import logo from "../assets/isotipo-red.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="max-w-screen h-16 mt-2 -mb-10">
      <nav className="Z h-full flex flex-row justify-around items-center ">
        <Link to="/">
          <img
            src={logo}
            className="h-9 w-auto object-contain pl-4 "
            alt="Logo"
          />
        </Link>

        <div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 font-bold text-gray-700 ">
            <li>
              <Link className="block" to="/about">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
            <Link to="/negocios" className="text-red-primary">
              Negocios
            </Link>
          </ul>
        </div>
        <Link
          to="/clientDashboard"
          className="bg-red-primary w-2/12 h-12 text-center flex items-center justify-center text-white font-extrabold rounded-3xl hover:bg-red-600 transition-colors"
        >
          Accede a tarjeto
        </Link>
      </nav>
    </div>
  );
}
