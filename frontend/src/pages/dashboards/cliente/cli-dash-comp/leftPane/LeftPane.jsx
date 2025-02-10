import Perfil from "./Perfil";
import Racha from "./Racha";
import TarjetasCliente from "./TarjetasCliente";

export default function LeftPane({ usuario }) {
  if (!usuario) return null;

  return (
    <div className="flex flex-col w-full pl-10 md:w-6/12">
      <Perfil 
        nombre={usuario.nombre}
        email={usuario.email}
        tipoUsuario={usuario.tipoUsuario}
      />
      <Racha />
      <TarjetasCliente userId={usuario._id} />
    </div>
  );
}
