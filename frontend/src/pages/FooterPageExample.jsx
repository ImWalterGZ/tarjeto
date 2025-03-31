import React from "react";
import FooterPage from "../components/ui/FooterPage";

const FooterPageExample = () => {
  return (
    <FooterPage title="Ejemplo de Página">
      {/* Custom content for this specific page */}
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Ejemplo de Página de Footer
        </h2>

        <p className="text-gray-700">
          Esta es una página de ejemplo que muestra cómo utilizar el componente
          FooterPage. Puedes personalizar el contenido de cada página mientras
          mantienes la estructura consistente.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">
            Características del componente
          </h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Diseño consistente para todas las páginas del footer</li>
            <li>Encabezado con botón de regreso y título personalizable</li>
            <li>Contenido por defecto para páginas en construcción</li>
            <li>Soporte para contenido personalizado mediante children</li>
            <li>Pie de página con información de copyright</li>
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Cómo usar este componente
          </h3>
          <p className="text-gray-700 mb-4">
            Para utilizar este componente, simplemente importa FooterPage y
            pásale un título y contenido personalizado:
          </p>

          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {`import FooterPage from "../components/ui/FooterPage";

const MiPagina = () => {
  return (
    <FooterPage title="Mi Título">
      {/* Tu contenido personalizado aquí */}
    </FooterPage>
  );
};`}
          </pre>
        </div>
      </div>
    </FooterPage>
  );
};

export default FooterPageExample;
