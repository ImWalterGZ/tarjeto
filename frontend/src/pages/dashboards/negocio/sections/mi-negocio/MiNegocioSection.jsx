import React, { useState } from "react";
import {
  Building2,
  Globe,
  Pencil,
  Clock,
  MapPin,
  Tag,
  RotateCcw,
  RefreshCw,
  FileText,
  ImageIcon,
  Link,
  Facebook,
  Instagram,
  Camera,
} from "lucide-react";

export default function MiNegocioSection({ negocio }) {
  const [editing, setEditing] = useState(false);

  if (!negocio) {
    return (
      <div className="flex justify-center items-center h-full">
        Cargando información del negocio...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 overflow-y-auto min-h-0 bg-white">
      {/* Header Section - Full Width */}
      <div className="w-full sticky top-0 bg-white z-10 pb-2  ">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold text-red-600">Tu negocio</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className={`px-4 py-2 ${
                editing ? "bg-gray-500" : "bg-red-500"
              } text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2`}
            >
              <Pencil className="w-4 h-4" />
              {editing ? "Cancelar" : "Editar"}
            </button>
            {editing && (
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Logo and Name Section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Logo y nombre</h3>
              {editing && (
                <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                  <Pencil className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <div className="flex bg-gray-background p-4 rounded-xl">
              <div className="bg-white rounded-xl p-6 w-full shadow-xl border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {negocio.fotoPerfil ? (
                    <img
                      src={negocio.fotoPerfil}
                      alt={negocio.nombreComercial}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-gray-800">
                  {negocio.nombreComercial || "Nombre del Negocio"}
                </h3>
              </div>
            </div>
          </div>

          {/* Location and Categories */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-red-600">
              Información general
            </h3>
            <div className="flex flex-col md:flex-row gap-4 bg-gray-background p-4 rounded-xl">
              <div className="bg-white flex flex-col md:flex-row gap-4 rounded-xl p-6 shadow-xl border border-gray-100">
                {/* Location */}
                <div className="mb-6 w-full md:w-7/12">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-red-primary flex items-center gap-1">
                      <MapPin className="w-4 h-4 " />
                      Ubicación
                    </h4>
                    {editing && (
                      <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                        <Pencil className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-100 rounded-lg h-24 md:h-32 w-full overflow-hidden">
                    <img
                      src="https://via.placeholder.com/300x150?text=Mapa"
                      alt="Mapa de ubicación"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {negocio.establecimientos &&
                    negocio.establecimientos.length > 0
                      ? "Av Francisco Villa 5911, Panamericana, 31210 Chihuahua, Chih."
                      : "No hay dirección registrada"}
                  </p>
                </div>

                {/* Categories */}
                <div className="w-full md:w-5/12">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-red-primary flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Categoría/s
                    </h4>
                    {editing && (
                      <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                        <Pencil className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {negocio.categoria && negocio.categoria.length > 0 ? (
                      negocio.categoria.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                        Joyería
                      </span>
                    )}
                    {negocio.categoria && negocio.categoria.length > 1 && (
                      <span className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                        Moda y calzado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Section - moved from right column to left */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">
                Personalización
              </h3>
              {editing && (
                <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                  <Pencil className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <div className="bg-gray-background p-4 rounded-xl">
              <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-gray-700">
                      Color principal
                    </h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md"
                        style={{ backgroundColor: negocio.color || "#f87171" }}
                      />
                      <span className="text-gray-800">
                        {negocio.color || "#f87171"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-gray-700">Gradiente</h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-20 h-10 rounded-md"
                        style={{
                          background:
                            negocio.gradient ||
                            "linear-gradient(to right, #f87171, #fbbf24)",
                        }}
                      />
                      <span className="text-gray-800 text-sm">
                        {negocio.gradient ||
                          "linear-gradient(to right, #f87171, #fbbf24)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Schedule */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Horario</h3>
              {editing && (
                <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                  <Pencil className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <div className="bg-gray-background p-4 rounded-xl">
              <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="space-y-3">
                  {negocio.horarioOperacion &&
                  negocio.horarioOperacion.length > 0 ? (
                    negocio.horarioOperacion.map((horario, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{horario.dia}</span>
                        <span className="text-gray-600">
                          {horario.apertura} - {horario.cierre}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Lunes</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Martes</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Miércoles</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Jueves</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Viernes</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sábado</span>
                        <span className="text-gray-600">
                          11 a.m.-2p.m. y 4-7:30p.m.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Domingo</span>
                        <span className="text-gray-600 italic">cerrado</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Website and Social Media Section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">
                Sitio Web y Redes Sociales
              </h3>
              {editing && (
                <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                  <Pencil className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <div className="bg-gray-background p-4 rounded-xl">
              <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-3">
                    <Link className="w-5 h-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Sitio Web</span>
                      <span className="text-gray-800">
                        {negocio.sitioWeb || "No registrado"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Facebook</span>
                      <span className="text-gray-800">
                        {negocio.redesSociales?.facebook || "No registrado"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Instagram</span>
                      <span className="text-gray-800">
                        {negocio.redesSociales?.instagram || "No registrado"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Stats (Additional Section) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Estadísticas</h3>
              {editing && (
                <button className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                  <Pencil className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <div className="bg-gray-background p-4 rounded-xl">
              <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Visitas totales
                    </span>
                    <span className="text-xl font-semibold text-gray-800">
                      {negocio.visitasTotales || 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Clientes únicos
                    </span>
                    <span className="text-xl font-semibold text-gray-800">
                      {negocio.clientesUnicos || 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Calificación promedio
                    </span>
                    <span className="text-xl font-semibold text-gray-800">
                      {negocio.calificacionPromedio || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Establecimientos
                    </span>
                    <span className="text-xl font-semibold text-gray-800">
                      {negocio.establecimientos
                        ? negocio.establecimientos.length
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
