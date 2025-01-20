import AnadirLugar from "./tarjetasDashboard/AnadirLugar";
import Tarjeta from "./tarjetasDashboard/Tarjeta";
export default function TarjetasCliente() {
  /*const tarjetasUser(){
    Aqui vamos a cargar la lista de tarjetas 
  }*/
  return (
    <>
      <h1 className="text-2xl font-bold text-red-primary">Mis tarjetas</h1>
      <div className="w-full h-full px-3 py-3 mt-2 bg-gray-background rounded-xl grid lg:grid-cols-2 lg:grid-rows-4 md:grid-cols-2 md:grid-rows-3  gap-x-3 gap-y-4">
        <Tarjeta />
        <Tarjeta />
        <Tarjeta />
        <Tarjeta />
        <Tarjeta />
        <Tarjeta />
        <Tarjeta />
        <AnadirLugar />
      </div>
    </>
  );
}
