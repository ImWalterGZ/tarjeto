import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const ClientPreview = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div
        className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Arch Gradient */}
        <div className="h-48 bg-gradient-to-b from-red-500 to-white relative">
          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <div className="w-44 h-44 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
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
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pt-16 pb-6">
          {/* User Information */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              {data?.nombre || "Tu nombre"}
            </h2>
            <p className="text-md text-gray-500 mt-1">
              {data?.ciudad || "Ciudad"},{" "}
              {data?.codigoPostal || "Código Postal"}
            </p>
          </div>

          {/* Categories */}
          <div className="mt-6 text-center">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Categorías Favoritas
            </h4>
            <div className="flex flex-wrap gap-2 justify-center mx-10">
              {data?.categoriasFavoritas?.map((cat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>{data?.edad || "0"} años</span>
              <span>•</span>
              <span>{data?.genero || "Género"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientPreview;
