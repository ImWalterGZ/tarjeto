import React from "react";
import logo from "../../assets/isotipo-red.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="h-16 mt-2 -mb-10 max-w-screen">
      <nav className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logo} className="h-9 w-auto object-contain" alt="Logo" />
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center space-x-8 font-bold text-gray-700">
            <li>
              <Link
                to="/about"
                className="hover:text-red-primary transition-colors"
              >
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-red-primary transition-colors"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                to="/negocios"
                className="text-red-primary hover:text-red-600 transition-colors"
              >
                Negocios
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/clientDashboard"
            className="flex items-center justify-center w-36 h-12 font-extrabold text-white bg-red-primary rounded-3xl hover:bg-red-600 transition-colors"
          >
            Accede a tarjeto
          </Link>
          <Link
            to="/negocioDashboard"
            className="flex items-center justify-center w-36 h-12 font-extrabold bg-neutral-700 text-red-primary rounded-3xl hover:bg-neutral-600 transition-colors"
          >
            Negocio
          </Link>
        </div>
      </nav>
    </header>
  );
}
