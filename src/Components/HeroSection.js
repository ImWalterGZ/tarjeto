import tresTarjetas from "../assets/tres-tarjetas.png";
export default function HeroSection() {
  return (
    <div className="flex align-middle w-screen  px-2">
      <div className="bg-red-primary rounded-2xl h-[665px] flex flex-row justify-between align-middle left-1">
        <div className="text-white w-6/12 m-16">
          <p className="font-extrabold text-7xl text-left">
            Con tarjeto, tus visitas cuentan.
          </p>
          <p className="text-left text-2xl font-medium block ">
            Disfruta de descuentos, consigue promociones exclusivas y sube de
            nivel en los negocios que más te gustan.
          </p>
        </div>

        <div>
          <img src={tresTarjetas} className="h-[800px]" alt="" />
        </div>
      </div>
    </div>
  );
}
