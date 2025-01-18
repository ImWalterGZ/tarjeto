import logo from "../../../assets/placeHolder/logo.png";
export default function PromocionesCards() {
  return (
    <div className="flex items-center px-4 align-middle transition-all bg-white border shadow-md outline-none py rounded-xl hover:shadow-xl hover:outline-red-primary hover:outline-2 hover:shadow-red-400">
      <div className="flex flex-row items-center gap-3 align-middle ">
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <p className="text-sm italic text-gray-400">Titulo negocio</p>
          <p className="text-sm font-medium">
            Cuerpo de la promocion texto que se alarga un monton
          </p>
          <div className="rounded-xl">
            <p className="inline px-2 py-1 text-xs font-semibold text-white rounded-md bg-red-primary font-poppins ">
              Termina hoy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
