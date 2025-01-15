import Logros from "./Logros";
import Ofertas from "./Ofertas";

export default function RightPane() {
  return (
    <>
      <div className="flex flex-col w-6/12 h-full  px-10 justify-center ">
        <Ofertas />
        <Logros />
      </div>
    </>
  );
}
