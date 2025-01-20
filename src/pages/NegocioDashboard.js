import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/isotipo-white.png";
import NavbarDashboard from "../Components/clientDashboard/NavbarDash/NavbarDashboard";
import ResumenRapido from "../Components/NegocioDashboard/ResumenRapido";
import PerfilNeg from "../Components/NegocioDashboard/PerfilNeg";
import AccesosRapidos from "../Components/NegocioDashboard/AccesosRapidos";
function NegocioDashboard() {
  return (
    <div className="flex flex-col w-screen h-screen bg-red-primary font-poppins">
      <img src={logo} className="self-center w-32 py-2 my-2" />{" "}
      <div className="flex flex-row items-center h-full">
        <NavbarDashboard estilo="Negocio" />
        <div className="grid grid-cols-5 grid-rows-2 gap-4 justify-between w-11/12 h-full p-10 bg-white rounded-tl-2xl rounded-tr-2xl md:flex-row p">
          <div className="col-span-3">
            <ResumenRapido />
          </div>
          <div className="col-span-2 h-full">
            <AccesosRapidos />
          </div>
        </div>
        <div className="w-3 h-full xl:w-.5 bg-red-primary"></div>
      </div>
    </div>
  );
}

export default NegocioDashboard;
