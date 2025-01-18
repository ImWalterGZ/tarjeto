import React from "react";
import logo from "../assets/isotipo-red.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="h-16 mt-2 -mb-10 max-w-screen">
      <nav className="flex flex-row items-center justify-around h-full Z ">
        <Link to="/">
          <img
            src={logo}
            className="object-contain w-auto pl-4 h-9 "
            alt="Logo"
          />
        </Link>

        <div>
          <ul className="flex flex-col p-4 mt-4 font-bold text-gray-700 border rounded-lg md:p-0 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
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
          className="flex items-center justify-center w-2/12 h-12 font-extrabold text-center text-white transition-colors bg-red-primary rounded-3xl hover:bg-red-600"
        >
          Accede a tarjeto
        </Link>
        <Link
          to="/negocioDashboard"
          className="flex items-center justify-center w-2/12 h-12 font-extrabold text-center transition-colors bg-neutral-700 text-red-primary rounded-3xl hover:bg-neutral-600"
        >
          {" "}
          Negocio
        </Link>
      </nav>
    </div>
  );
}
