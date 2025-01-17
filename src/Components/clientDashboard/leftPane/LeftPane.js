import Perfil from "./Perfil";
import Racha from "./Racha";
import TarjetasCliente from "./TarjetasCliente";

export default function LeftPane() {
  return (
    <div className="flex flex-col md:w-6/12 w-full pl-10">
      <Perfil nombre="Walter" />
      <Racha />
      <TarjetasCliente />
    </div>
  );
}
