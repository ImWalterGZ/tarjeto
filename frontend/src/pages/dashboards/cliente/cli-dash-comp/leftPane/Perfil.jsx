import { User } from "lucide-react";

export default function Perfil({ nombre, email, tipoUsuario }) {
  return (
    <div className="flex align-middle h-1/6">
      <div className="flex flex-row items-center w-full gap-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
          <User className="w-6 h-6 text-red-primary" />
        </div>
        <div className="flex flex-col">
          <p className="font-medium font-poppins text-red-primary">
            {tipoUsuario}
          </p>
          <p className="text-2xl font-bold text-gray-900 font-nunito">
            ¡Hola {nombre}!
          </p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
    </div>
  );
}
