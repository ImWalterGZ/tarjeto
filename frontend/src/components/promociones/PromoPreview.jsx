import React, { useState } from "react";
import { Smartphone, CreditCard, FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PreviewCard = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
    <div className="flex items-start justify-between">
      <div>
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full mb-2">
          {data.tipoPromo.tipo === "programa"
            ? "🕒 Programada"
            : data.tipoPromo.tipo === "periodo"
            ? "📅 Por Periodo"
            : data.tipoPromo.tipo === "exclusivo"
            ? "⭐ Exclusiva"
            : "🏷️ Regular"}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">
          {data.titulo || "Sin título"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {data.descripcion || "Sin descripción"}
        </p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
      <span>Usos: 0/{data.limiteDeUsos.totalGlobal || "∞"}</span>
      {data.nivelReq > 0 && (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          Nivel {data.nivelReq}
        </span>
      )}
    </div>
  </div>
);

const PreviewDetail = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded-full">
            {data.tipoPromo.tipo === "programa"
              ? "🕒 Programada"
              : data.tipoPromo.tipo === "periodo"
              ? "📅 Por Periodo"
              : data.tipoPromo.tipo === "exclusivo"
              ? "⭐ Exclusiva"
              : "🏷️ Regular"}
          </span>
          {data.status ? (
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-600 rounded-full">
              Activa
            </span>
          ) : (
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-600 rounded-full">
              Inactiva
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {data.titulo || "Sin título"}
        </h2>
        <p className="text-gray-600 mt-2">
          {data.descripcion || "Sin descripción"}
        </p>
      </div>

      {data.tipoPromo.tipo === "programa" &&
        data.tipoPromo.programa.diaSemana !== null && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Horario</h4>
            <p className="text-gray-600">
              {format(
                new Date().setDate(data.tipoPromo.programa.diaSemana),
                "EEEE",
                { locale: es }
              )}
              {data.tipoPromo.programa.horaInicio &&
                data.tipoPromo.programa.horaFin && (
                  <>
                    {" "}
                    de {data.tipoPromo.programa.horaInicio} a{" "}
                    {data.tipoPromo.programa.horaFin}
                  </>
                )}
            </p>
          </div>
        )}

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Límites de Uso</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Por Usuario (Diario)</p>
            <p className="text-lg font-semibold">
              {data.limiteDeUsos.porUsuario.diario || "∞"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Global</p>
            <p className="text-lg font-semibold">
              {data.limiteDeUsos.totalGlobal || "∞"}
            </p>
          </div>
        </div>
      </div>

      {data.terminos && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Términos y Condiciones
          </h4>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {data.terminos}
          </p>
        </div>
      )}
    </div>
  </div>
);

const PreviewMobile = ({ data }) => (
  <div className="max-w-[375px] mx-auto bg-gray-100 p-4 rounded-2xl shadow-lg">
    <div className="bg-white rounded-xl p-4 space-y-4">
      <div>
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full mb-2">
          {data.tipoPromo.tipo === "programa"
            ? "🕒 Programada"
            : data.tipoPromo.tipo === "periodo"
            ? "📅 Por Periodo"
            : data.tipoPromo.tipo === "exclusivo"
            ? "⭐ Exclusiva"
            : "🏷️ Regular"}
        </span>
        <h3 className="text-lg font-bold">{data.titulo || "Sin título"}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {data.descripcion || "Sin descripción"}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Disponible: {data.limiteDeUsos.totalGlobal || "∞"}
        </span>
        {data.nivelReq > 0 && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            Nivel {data.nivelReq} requerido
          </span>
        )}
      </div>

      <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold">
        Usar Promoción
      </button>
    </div>
  </div>
);

const PromoPreview = ({ data }) => {
  const [activeView, setActiveView] = useState("card");

  const views = {
    card: { icon: CreditCard, label: "Tarjeta" },
    detail: { icon: FileText, label: "Detalle" },
    mobile: { icon: Smartphone, label: "Móvil" },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Vista Previa</h2>
          <div className="flex items-center gap-2">
            {Object.entries(views).map(([key, { icon: Icon, label }]) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  activeView === key
                    ? "bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeView === "card" && <PreviewCard data={data} />}
        {activeView === "detail" && <PreviewDetail data={data} />}
        {activeView === "mobile" && <PreviewMobile data={data} />}
      </div>
    </div>
  );
};

export default PromoPreview;
