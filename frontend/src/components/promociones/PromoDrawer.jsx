import React, { useState } from "react";
import { X } from "lucide-react";
import PromoForm from "./PromoForm";
import PromoPreview from "./PromoPreview";

export default function PromoDrawer({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    nivelReq: 0,
    categoriaFavorita: [],
    tipoPromo: {
      tipo: "regular",
      programa: {
        diaSemana: null,
        horaInicio: "",
        horaFin: "",
      },
      periodo: {
        fechaInicio: null,
        fechaFin: null,
      },
      exclusivo: {
        totalInicial: null,
        fechaLimite: null,
      },
    },
    limiteDeUsos: {
      porUsuario: {
        diario: null,
        semanal: null,
        total: null,
      },
      totalGlobal: null,
    },
    terminos: "",
    status: true,
  });

  const handleFormChange = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-7xl bg-white h-full flex">
        {/* Form Section */}
        <div className="w-1/2 h-full overflow-y-auto border-r border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-primary">
                Crear Promoción
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <PromoForm data={formData} onChange={handleFormChange} />
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-1/2 h-full bg-gray-50">
          <PromoPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
