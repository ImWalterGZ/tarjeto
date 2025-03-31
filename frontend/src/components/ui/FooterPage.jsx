import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FooterPage = ({ title, children }) => {
  const { pageSlug } = useParams();

  // If title is not provided, generate one from pageSlug if available
  const pageTitle =
    title ||
    (pageSlug
      ? pageSlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Información");

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <header className="bg-red-600 text-white p-4 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </header>

      {/* Content section */}
      <main className="container mx-auto p-4 md:p-8 max-w-3xl">
        {children || (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              {pageTitle}
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">
                Esta página está en construcción. Próximamente encontrarás
                información relevante sobre {pageTitle.toLowerCase()}.
              </p>

              <p className="text-gray-600">
                Si tienes alguna pregunta, no dudes en contactarnos a través de
                nuestro correo electrónico o teléfono en la sección de contacto.
              </p>
            </div>

            {/* Placeholder content */}
            <div className="space-y-4 mt-8">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        )}
      </main>

      {/* Simple footer with copyright */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm mt-auto">
        <p>
          © {new Date().getFullYear()} Tarjeto. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default FooterPage;
