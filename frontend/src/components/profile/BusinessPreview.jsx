import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/isotipo-white.png";
import { QrCode, User, MapPin, Globe, Facebook, Instagram } from "lucide-react";

export const gradients = {
  dorado: "bg-gradient-to-br from-orange-200 via-yellow-600 to-rose-700",
  azul: "bg-gradient-to-br from-slate-200 via-cyan-500 to-slate-400",
  rubi: "bg-gradient-to-br from-red-800 via-red-600 to-red-700",
  rosa: "bg-gradient-to-br from-rose-400 via-rose-800 to-pink-900",
};

const nameHolder = "Nombre comercial";

const BusinessPreview = ({ data }) => {
  const selectedGradient = data?.gradient || "rubi";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-nunito">
      <div className="w-full h-3/5 flex flex-col justify-start bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-full border-2 border-red-500 overflow-hidden flex items-center justify-center bg-gray-50">
            {data?.fotoPerfil ? (
              <img
                src={data.fotoPerfil}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-300" />
            )}
          </div>

          {/* Business Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {data?.nombreComercial || nameHolder}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              RFC: {data?.rfc || "..."}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {data?.categoria ? (
              data.categoria.map((cat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-sm">
                Sin categorías
              </span>
            )}
          </div>
        </div>

        {/* Location Info */}
        {data?.establecimiento && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Establecimiento Principal
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {data.establecimiento.direccion || "..."},{" "}
                {data.establecimiento.zona || "..."}
              </p>
              <p className="ml-6">
                {data.establecimiento.ciudad || "..."},{" "}
                {data.establecimiento.estado || "..."} CP:{" "}
                {data.establecimiento.codigoPostal || "..."}
              </p>
            </div>
          </div>
        )}

        {/* Website and Social Media */}
        <div className="mt-6 space-y-2">
          {data?.sitioWeb && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>{data.sitioWeb}</span>
            </div>
          )}
          {data?.redesSociales && (
            <div className="flex gap-4">
              {data.redesSociales.facebook && (
                <Facebook className="w-5 h-5 text-blue-600" />
              )}
              {data.redesSociales.instagram && (
                <Instagram className="w-5 h-5 text-pink-600" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tarjeto Card */}
      <motion.div
        className="w-full max-w-md aspect-[1.6/1] rounded-xl relative overflow-hidden shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`relative h-4/5 w-full px-8 py-6 flex flex-col ${gradients[selectedGradient]}`}
        >
          {/* Business Name */}
          <div className="flex-1 flex items-center">
            <h2 className="text-4xl font-bold text-white tracking-wide">
              {data?.nombreComercial || nameHolder}
            </h2>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            <QrCode className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="z-30 w-full h-1/5 flex items-center px-8 bg-gray-500">
          <img src={logo} alt="Tarjeto" className="h-5 object-contain" />
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessPreview;
