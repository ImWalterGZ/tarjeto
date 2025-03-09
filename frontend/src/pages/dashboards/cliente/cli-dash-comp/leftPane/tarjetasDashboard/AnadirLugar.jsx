export default function AnadirLugar() {
  return (
    <div className="flex flex-col items-center justify-around bg-white drop-shadow-md  rounded-xl">
      <div className="flex flex-row">
        <p className="inline">img</p>
        <p className="font-bold text-red-primary">
          ¡Añade un lugar a tu wallet!
        </p>
      </div>
      <div>
        <form>
          <label htmlFor="codigo">Código</label>
          <input type="text"></input>
        </form>
      </div>
    </div>
  );
}
