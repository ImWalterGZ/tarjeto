import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/isotipo-white.png";
import RightPane from "../Components/clientDashboard/rightPane/RightPane";
import LeftPane from "../Components/clientDashboard/leftPane/LeftPane";
import NavbarDashboard from "../Components/clientDashboard/NavbarDash/NavbarDashboard";
function App() {
  return (
    <div className="bg-red-primary w-screen h-screen flex flex-col font-poppins">
      <img src={logo} className="w-24 self-center my-2" />
      <div className="flex flex-row h-full items-center">
        <NavbarDashboard />
        <div className="bg-white  h-full py-5 rounded-tl-2xl rounded-tr-2xl w-11/12 flex flex-row justify-between">
          <LeftPane />
          <RightPane />
        </div>
        <div className="h-full bg-red-primary w-2"></div>
      </div>
    </div>
  );
}

export default App;
