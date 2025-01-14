import AnadirLugar from "./tarjetasDashboard/AnadirLugar";
import Tarjeta from "./tarjetasDashboard/Tarjeta";
export default function TarjetasCliente() {
  /*const tarjetasUser(){
    Aqui vamos a cargar la lista de tarjetas 
  }*/
  return (
    <>
      <h1 className="text-red-primary font-bold text-2xl">Mis tarjetas</h1>
      <div className="bg-gray-background h-full w-full py-3 px-3 mt-2 rounded-xl grid lg:grid-cols-2 lg:grid-rows-4 md:grid-cols-2 md:grid-rows-3  gap-x-3 gap-y-4">
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
