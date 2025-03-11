import { User } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "../../../../../store/authStore";

export default function Perfil({ nombre, email, tipoUsuario }) {
  const { cliente, usuario, revisandoAuth } = useAuthStore();

  // Show loading state while checking auth
  if (revisandoAuth) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-primary"></div>
      </div>
    );
  }

  // Show error if no user data
  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="text-center">
          <p className="font-medium">Error</p>
          <p className="text-sm">No se encontró información del usuario</p>
        </div>
      </div>
    );
  }

  // Show message if client profile doesn't exist yet
  if (!cliente) {
    return (
      <div className="flex items-center justify-center h-full text-yellow-600">
        <div className="text-center">
          <p className="font-medium">Perfil Incompleto</p>
          <p className="text-sm">Por favor, complete su perfil de cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-1/6 mb-3">
      <div className="flex flex-row items-center w-full h-full gap-6">
        <div className="flex items-center justify-center h-16 w-16 bg-red-100 rounded-full overflow-hidden">
          {cliente.datosPersonales?.fotoPerfil ? (
            <img
              src={cliente.datosPersonales.fotoPerfil}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-full h-full text-red-primary" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-medium font-poppins text-red-primary">¡Hola</p>
          <p className="text-2xl font-bold text-[#434343] font-nunito">
            {cliente.datosPersonales.nombre}!
          </p>
        </div>
      </div>
    </div>
  );
}
