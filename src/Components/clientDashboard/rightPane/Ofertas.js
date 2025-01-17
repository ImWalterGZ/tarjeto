import PromocionesCards from "./PromocionesCards";

export default function () {
  return (
    <div className="w-full h-2/4 items-start ">
      <h1 className="font-bold text-red-primary text-2xl mb-2">
        Ofertas de hoy
      </h1>
      <div className="bg-gray-background  h-5/6 rounded-xl p-3 grid grid-cols-2 grid-rows-2 gap-3">
        <PromocionesCards />
        <PromocionesCards />
        <PromocionesCards />
        <div className="h-full w-full bg-white shadow-md rounded-xl flex flex-col justify-center items-center text-red-primary font-nunito font-bold">
          <img src="img" alt="" />
          Ver todas
        </div>
      </div>
    </div>
  );
}
