import React from "react";
import logo from "../assets/isotipo-red.png";

export default function Navbar() {
  return (
    <div className="bg-blue-500 max-w-screen max-h-24">
      <img src={logo} className="h-auto max-h-full max-w-full" alt="Logo" />
    </div>
  );
}
