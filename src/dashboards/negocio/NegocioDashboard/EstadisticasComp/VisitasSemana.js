import Container from "../../../../Components/Cards/Container";

export default function VisitasSemana() {
  const tarjetaStyle = "bg-white rounded-lg shadow-lg w-1/2 h-full p-4 ";
  const actual = 14;
  const clientesNuevos = 12;
  const visitas = 56;
  const clientesFrecuentes = 34;
  const visitasPasadas = 41;
  const visitasAntepasada = 32;
  return (
    <Container titulo={"Visitas de la semana"} button={"Ver las estadísticas"}>
      <div className="flex flex-row gap-2 h-full">
        <div className={`${tarjetaStyle} `}>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">{visitas}</h1>
            <h2>clientes, han visitado tu negocio esta semana</h2>
          </div>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">
              {clientesFrecuentes}
            </h1>
            <h2>clientes frecuentes</h2>
          </div>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">
              {clientesNuevos}
            </h1>
            <h2>clientes nuevos.</h2>
          </div>
        </div>
        <div
          className={`${tarjetaStyle} h-full relative flex flex-row justify-end gap-2 items-baseline bg-green-300 `}
        >
          {" "}
          <div className="h-2/6 bg-neutral-700 rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            Semana {actual - 2}
          </div>
          <div className="h-4/6 bg-neutral-700 rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            Semana {actual - 1}
          </div>
          <div className="h-5/6 bg-red-primary rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            {" "}
            Semana {actual}
          </div>
        </div>
      </div>
    </Container>
  );
}
