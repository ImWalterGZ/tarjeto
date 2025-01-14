export default function Tarjeta() {
  return (
    <div className="flex flex-row items-center justify-around drop-shadow-md    ">
      <div className="w-full h-full bg-white rounded-xl relative">
        <div className="bg-yellow-400 h-full w-7/12 rounded-xl"></div>
      </div>
      <div className="absolute flex flex-row gap-3" id="information">
        <div className="" id="Foto">
          IMG
        </div>
        <div className="" id="nombreNegocio">
          RollaBite
        </div>
      </div>
    </div>
  );
}
