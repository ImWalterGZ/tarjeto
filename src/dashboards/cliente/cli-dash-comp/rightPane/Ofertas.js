import PromocionesCards from "./PromocionesCards";

export default function () {
  return (
    <div className="items-start w-full h-2/4 ">
      <h1 className="mb-2 text-2xl font-bold text-red-primary">
        Ofertas de hoy
      </h1>
      <div className="p-3 grid grid-cols-2 grid-rows-2 gap-3 bg-gray-background h-5/6 rounded-xl">
        <PromocionesCards />
        <PromocionesCards />
        <PromocionesCards />
        <div className="flex flex-col items-center justify-center w-full h-full font-bold bg-white shadow-md outline-none transition-all duration-500 hover:outline-4 hover:outline-amber-300 hover:bg-red-primary rounded-xl text-red-primary hover:text-white font-nunito">
          <img src="img" alt="" />
          Ver todas
        </div>
      </div>
    </div>
  );
}
