export default function Perfil({ nombre }) {
  return (
    <div className="flex align-middle h-1/6">
      <div className="flex flex-row items-center w-full gap-6">
        <h2>img</h2>
        <div className="flex flex-col">
          <p className="font-medium font-poppins text-red-primary ">
            Buenas buenas
          </p>
          <p className="text-2xl font-bold text-gray-900 font-nunito">
            Hola {nombre}!
          </p>
        </div>
      </div>
    </div>
  );
}
