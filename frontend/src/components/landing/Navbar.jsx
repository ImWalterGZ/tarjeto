import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
const logo = "/images/isotipo-red.webp";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="h-16 mt-2 -mb-10 max-w-screen relative z-50">
      <nav className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              className="object-contain w-auto pl-4 h-9"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Main Navigation - Desktop */}
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

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/signup"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50 py-4 px-6">
          <ul className="space-y-4 font-bold text-gray-700">
            <li>
              <Link
                to="/about"
                className="block py-2 hover:text-red-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 hover:text-red-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                to="/negocios"
                className="block py-2 text-red-primary hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Negocios
              </Link>
            </li>
            <li className="pt-4">
              <Link
                to="/signup"
                className="block text-center py-3 font-extrabold text-white bg-red-primary rounded-3xl hover:bg-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accede a tarjeto
              </Link>
            </li>
            <li className="pt-2">
              <Link
                to="/negocioDashboard"
                className="block text-center py-3 font-extrabold bg-neutral-700 text-red-primary rounded-3xl hover:bg-neutral-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Negocio
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
