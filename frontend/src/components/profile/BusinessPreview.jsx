import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/isotipo-white.png";
import logoPreview from "../../assets/placeHolder/logo.png";
import { QrCode } from "lucide-react";

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
      <div className="w-full h-3/5 flex flex-col justify-center">
        <div className="flex flex-row">
          <div className="w-3/12 h-full flex flex-col items-center justify-center">
            <img src={logoPreview} alt="Logo" className="outline-" />
          </div>
          <div className="h-full flex flex-col items-start justify-center">
            <h3 className="text-sm text-red-primary text-center tracking-wide">
              Nombre comercial
            </h3>
            <h2 className="text-2xl font-bold text-black text-center tracking-wide">
              {data?.nombreComercial || nameHolder}
            </h2>
          </div>
        </div>
        <div className=" flex flex-col items-start justify-center p-4">
          <p className="text-sm text-red-primary text-center tracking-wide">
            Descripción
          </p>
          <p className="text-sm text-black text-center tracking-wide">
            {data?.descripcion || "..."}
          </p>
          <div className="flex flex-row">
            <p className="text-sm text-red-primary text-center tracking-wide">
              Categorías
            </p>
          </div>
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
              <span className="text-sm text-black text-center tracking-wide">
                ...
              </span>
            )}
          </div>
        </div>
      </div>
      <motion.div
        className="w-full h-2/5 max-w-md aspect-[1.6/1] rounded-xl relative overflow-hidden shadow-xl font-nunito"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Content Container */}
        <div
          className={`relative h-4/5 w-full px-8 py-6 flex flex-col  bg-gradient-to-br ${gradients[selectedGradient]} `}
        >
          {/* Business Name */}
          <div className="flex-1 flex">
            <h2 className="text-4xl font-bold text-white text-center tracking-wide">
              {data?.nombreComercial || nameHolder}
            </h2>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            {/* QR Codes */}
            <div className="flex gap-1">
              <QrCode className="w-10 h-10 text-white " />
            </div>
          </div>
        </div>
        <div className="z-30 inset-0 w-full h-1/5 flex items-center px-8 bg-gray-500">
          <div className="flex items-start gap-2">
            <img src={logo} alt="Tarjeto" className="h-5 object-contain" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessPreview;
