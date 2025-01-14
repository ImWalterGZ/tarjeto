export default function Perfil({ nombre }) {
  return (
    <div className="h-1/6">
      <div className="flex flex-row w-full items-center gap-6">
        <h2>img</h2>
        <div className="flex flex-col">
          <p className="font-poppins text-red-primary font-medium ">
            Buenas buenas
          </p>
          <p className="font-nunito text-gray-900 font-bold text-2xl">
            Hola {nombre}!
          </p>
        </div>
      </div>
    </div>
  );
}
