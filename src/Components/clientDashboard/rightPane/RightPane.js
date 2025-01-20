import Logros from "./Logros";
import Ofertas from "./Ofertas";

export default function RightPane() {
  return (
    <>
      <div className="flex flex-col justify-center w-full h-full px-10 md:w-6/12 ">
        <Ofertas />
        <Logros />
      </div>
    </>
  );
}
