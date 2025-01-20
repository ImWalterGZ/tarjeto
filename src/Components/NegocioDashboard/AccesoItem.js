export default function AccesoItem(children) {
  return (
    <div className="w-full h-full bg-white rounded-md hover:bg-red-primary duration-150 hover:text-white transition-all shadow-md flex flex-col align-middle justify-center items-center p-7">
      <div className="">{children.icono}</div>
      <h1 className="text-center text-sm">{children.texto}</h1>
    </div>
  );
}
