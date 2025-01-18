import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/isotipo-white.png";
import NavbarDashboard from "../Components/clientDashboard/NavbarDash/NavbarDashboard";
function NegocioDashboard() {
  return (
    <div className="flex flex-col w-screen h-screen bg-red-primary font-poppins">
      <img src={logo} className="self-center w-32 py-2 my-2" />{" "}
      <div className="flex flex-row items-center h-full">
        <NavbarDashboard estilo="Negocio" />
        <div className="flex flex-col justify-between w-11/12 h-full py-5 bg-white rounded-tl-2xl rounded-tr-2xl md:flex-row"></div>
        <div className="w-2 h-full bg-red-primary 2xl:w-1"></div>
      </div>
    </div>
  );
}

export default NegocioDashboard;
