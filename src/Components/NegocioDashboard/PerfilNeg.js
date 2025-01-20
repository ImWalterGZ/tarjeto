export default function PerfilNeg({ nombre }) {
  return (
    <div className="flex align-middle h-1/6">
      <div className="flex flex-row items-center w-full gap-6">
        <h2>img</h2>
        <div className="flex flex-row align-middle items-center gap-1">
          <p className="font-medium text-md font-poppins text-red-primary  ">
            !A la orden,
          </p>
          <p className="text-xl font-bold text-gray-900 font-nunito">
            {nombre}!
          </p>
        </div>
      </div>
    </div>
  );
}
