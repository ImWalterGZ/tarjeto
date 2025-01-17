export default function Racha() {
  return (
    <div className="h-1/6 my-2">
      <div className="w-full  bg-gray-100 px-4 py-3 rounded-xl font-nunito">
        <div className="w-full h-full py-3 px-6 bg-white rounded-md drop-shadow-lg flex flex-row justify-between items-center ">
          <div>
            <h3 className="text-red-primary font-extrabold text-3xl">
              Semana <br />
              Power
            </h3>
          </div>
          <div className="flex flex-col">
            <h4>Semana</h4>
            <p className="text-red-primary font-extrabold text-2xl">15</p>
          </div>
          <div className="flex flex-col">
            <h4>Has visitado</h4>
            <p className="text-red-primary font-extrabold  text-2xl">3</p>
            <h4>Esta semana</h4>
          </div>
          <div className="flex flex-col">
            <h4>Tu ultima visita fue</h4>
            <p>X lugar mamon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
