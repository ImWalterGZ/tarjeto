import NavBoton from "./NavBoton";
import { useState } from "react";

const client = ["Inicio", "Ofertas", "Logros", "Lugares", "Ajustes"];
const negocio = [
  "Inicio",
  "Ofertas",
  "Estadísticas",
  "Nexo",
  "Mi negocio",
  "Ajustes",
];

export default function NavbarDashboard({ estilo }) {
  const [activeItem, setActiveItem] = useState("Inicio");
  let Navbar = [];

  switch (estilo) {
    case "cliente":
      Navbar = client;
      break;
    case "Negocio":
      Navbar = negocio;
      break;
    default:
      Navbar = client;
  }

  return (
    <div className="flex pt-12 justify-center w-24 bg-red-primary h-full">
      <div className="flex flex-col justify-start  items-center gap-12   w-24  h-5/6">
        {Navbar.map((item, index) => (
          <NavBoton
            key={index}
            texto={item}
            active={item === activeItem}
            onClick={() => setActiveItem(item)}
          />
        ))}
      </div>
    </div>
  );
}
