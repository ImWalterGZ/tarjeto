import React from "react";
import ResumenRapido from "../../NegocioDashboard/ResumenRapido";
import VisitasSemana from "../../NegocioDashboard/EstadisticasComp/VisitasSemana";
import AccesosRapidos from "../../NegocioDashboard/AccesosRapidos";
import OfertasActivas from "../../NegocioDashboard/OfertasComp/OfertasActivas";

export default function InicioSection({ negocio, usuario }) {
  return (
    <div className="flex flex-row gap-4 justify-between w-full h-full">
      <div id="leftPane" className="w-1/2 flex flex-col gap-4">
        <ResumenRapido negocio={negocio} usuario={usuario} />
        <VisitasSemana negocio={negocio} />
      </div>
      <div id="rightPane" className="w-1/2 flex flex-col gap-3">
        <AccesosRapidos negocio={negocio} />
        <div className="h-full">
          <OfertasActivas negocio={negocio} />
        </div>
      </div>
    </div>
  );
}
