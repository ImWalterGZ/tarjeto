import Canjes from "./Iconos/canjes.png";
import Dart from "./Iconos/dart.png";
import PerfilNeg from "./PerfilNeg";
export default function ResumenRapido() {
  return (
    <div className="flex flex-col mb-2 align-middle gap-16">
      <PerfilNeg nombre="Walter" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row px-4 justify-between">
          <h3 className="text-2xl font-bold text-red-primary">
            Resumen Rapido
          </h3>
          <h4 className="self-center hover:bg-red-primary hover:text-white  transition-all border border-solid rounded-full align-center middle px-3 py-1 text-red-primary font-semibold text-sm border-red-primary">
            Ver más detalles
          </h4>
        </div>

        <div className="w-full px-4 py-3 bg-gray-100 rounded-xl font-nunito">
          <div className="flex flex-row items-center justify-between w-full h-full px-6 py-3 bg-white rounded-md drop-shadow-lg ">
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Dart} alt="" className="w-10 h-10 aspect-square" />

              <div className="flex flex-col">
                <h4>Hasta ahora</h4>
                <p className="text-3xl font-extrabold text-red-primary">
                  3 clientes
                </p>
                <h4> te han visitado</h4>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Dart} alt="" className="w-10 h-10 aspect-square" />

              <div className="flex flex-col">
                <p className="text-3xl font-extrabold text-red-primary">4</p>
                <h4>Ofertas activas</h4>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 align-middle">
              <img src={Canjes} alt="" className="w-10 h-10 aspect-square" />
              <div className="flex flex-col">
                <h4>Se han canjeado</h4>
                <p className="text-3xl font-bold text-red-primary">15</p>
                recompensas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
