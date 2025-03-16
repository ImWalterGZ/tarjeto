import React from "react";
import { Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../../../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AjustesSection({ negocio }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ajustes</h2>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <Settings className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Configuración</h3>
        <p className="text-gray-500 text-center max-w-md">
          Esta sección está en desarrollo. Aquí podrás configurar las
          preferencias de tu cuenta.
        </p>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
