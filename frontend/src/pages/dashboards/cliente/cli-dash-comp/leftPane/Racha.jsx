export default function Racha() {
  return (
    <div className="flex mb-2 align-middle h-1/6">
      <div className="w-full px-4 py-3 bg-gray-100  rounded-xl font-nunito">
        <div className="flex flex-row items-center justify-between w-full h-full px-6 py-3 bg-white rounded-md drop-shadow-lg ">
          <div>
            <h3 className="text-3xl font-extrabold text-red-primary">
              Semana <br />
              Power
            </h3>
          </div>
          <div className="flex flex-col">
            <h4>Semana</h4>
            <p className="text-2xl font-extrabold text-red-primary">15</p>
          </div>
          <div className="flex flex-col">
            <h4>Has visitado</h4>
            <p className="text-2xl font-extrabold text-red-primary ">3</p>
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
