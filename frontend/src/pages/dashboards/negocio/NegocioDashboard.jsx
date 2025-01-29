import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/isotipo-white.png";
import NavbarDashboard from "../cliente/cli-dash-comp/NavbarDash/NavbarDashboard";
import ResumenRapido from "./NegocioDashboard/ResumenRapido";
import PerfilNeg from "./NegocioDashboard/PerfilNeg";
import AccesosRapidos from "./NegocioDashboard/AccesosRapidos";
import OfertasActivas from "./NegocioDashboard/OfertasComp/OfertasActivas";
import VisitasSemana from "./NegocioDashboard/EstadisticasComp/VisitasSemana";
function NegocioDashboard() {
  return (
    <div className="bg-red-primary flex flex-col w-screen h-screen">
      <img src={logo} className="self-center w-32 py-2 my-2" />
      <div className="flex flex-row  w-full h-full">
        {" "}
        <NavbarDashboard estilo="Negocio" />
        <div className="flex flex-row gap-4 justify-between w-11/12 h-full p-10 bg-white rounded-tl-2xl rounded-tr-2xl md:flex-row p">
          <div id="leftPane" className="w-1/2 flex flex-col  gap-4">
            <ResumenRapido />
            <VisitasSemana />
          </div>
          <div id="rightPane" className="w-1/2 flex flex-col gap-3">
            <AccesosRapidos />

            <div className="h-full">
              <OfertasActivas />
            </div>
          </div>
        </div>
        <div className="w-3 h-full xl:w-.5 bg-red-primary"></div>
      </div>
    </div>
  );
}

export default NegocioDashboard;
