export default function AnadirLugar() {
  return (
    <div className="bg-white flex flex-col items-center justify-around drop-shadow-md  rounded-xl  ">
      <div className="flex flex-row">
        <p className="inline">img</p>
        <p className="text-red-primary font-bold">
          ¡Añade un lugar a tu wallet!
        </p>
      </div>
      <div>
        <form>
          <label for="codigo">Código</label>
          <input type="text"></input>
        </form>
      </div>
    </div>
  );
}
