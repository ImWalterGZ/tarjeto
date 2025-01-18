export default function Tarjeta() {
  var color = Math.floor(Math.random() * 4) + 1;

  const tipoSombra = (nivel) => {
    switch (nivel) {
      case 1:
        return "hover:drop-shadow-bronce";
      case 2:
        return "hover:drop-shadow-plata";
      case 3:
        return "hover:drop-shadow-rubi";
      case 4:
        return "hover:drop-shadow-dorado ";
      default:
        break;
    }
  };
  const colorBorde = (nivel) => {
    switch (nivel) {
      case 1:
        return "group-hover:border-rose-950";
      case 2:
        return "group-hover:border-slate-600";
      case 3:
        return "group-hover:border-red-primary";
      case 4:
        return "group-hover:border-yellow-400 ";
      default:
        break;
    }
  };
  const colorTarjeta = (nivel) => {
    switch (nivel) {
      /* Falta actualizar los colores */
      case 1:
        return "bg-gradient-to-r  from-yellow-950 to-bronce-cd";
      case 2:
        return "bg-gradient-to-r  from-sky-600 to-sky-200";
      case 3:
        return "bg-gradient-to-tr  from-red-700 to-red-primary";
      case 4:
        return "bg-gradient-to-r   from-yellow-600 to-yellow-300 ";
      default:
        break;
    }
  };
  return (
    <div
      className={` group flex flex-row items-center justify-around slate transition-all  ${tipoSombra(
        color
      )}  `}
    >
      <div
        className={`w-full h-full bg-white rounded-xl relative ${colorBorde(
          color
        )}  group-hover:border-2 transition-all`}
      >
        <div
          className={`${colorTarjeta(color)} h-full w-7/12 rounded-xl`}
        ></div>
      </div>
      <div
        className="absolute flex flex-row items-start gap-3"
        id="information"
      >
        <div className="" id="Foto">
          IMG
        </div>
        <div className="" id="nombreNegocio">
          RollaBite
        </div>
        <div className="flex flex-col items-end transition-all opacity-45 group-hover:opacity-85">
          <div className="text-2xl font-semibold">45%</div>
          <div className="text-xs">12/25 visitas</div>
        </div>
      </div>
    </div>
  );
}
