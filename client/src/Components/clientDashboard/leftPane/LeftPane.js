import Perfil from "./Perfil";
import Racha from "./Racha";
import TarjetasCliente from "./TarjetasCliente";

export default function LeftPane() {
  return (
    <div className="flex flex-col w-6/12  pl-10">
      <Perfil nombre="Walter" />
      <Racha />
      <TarjetasCliente />
    </div>
  );
}
