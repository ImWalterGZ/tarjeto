export default function PerfilNeg({ nombre, fotoPerfil }) {
  return (
    <div className="flex align-middle h-1/6">
      <div className="flex flex-row items-center w-full gap-6">
        {fotoPerfil ? (
          <img
            src={fotoPerfil}
            alt={`${nombre} profile`}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-primary shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-red-primary">
            <span className="text-2xl font-bold text-gray-400">
              {nombre?.charAt(0) || "?"}
            </span>
          </div>
        )}
        <div className="flex flex-col align-middle items-start gap-1">
          <p className="font-medium text-md font-poppins text-red-primary">
            ¡A la orden,
          </p>
          <p className="text-4xl font-bold text-gray-900 font-nunito">
            {nombre}!
          </p>
        </div>
      </div>
    </div>
  );
}
