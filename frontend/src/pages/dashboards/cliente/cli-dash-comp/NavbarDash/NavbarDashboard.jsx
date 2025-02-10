import NavBoton from "./NavBoton";

const client = ["Home", "Ofertas", "Logros", "Lugares", "Ajustes"];
const negocio = ["Home", "Ofertas", "Estadísticas", "Mi negocio", "Ajustes"];

export default function NavbarDashboard({ estilo }) {
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
    <div className="flex flex-col items-center gap-4 py-6 xl:w-24 lg:w-20">
      {Navbar.map((item, index) => (
        <NavBoton 
          key={index} 
          texto={item}
          active={index === 0} // Por defecto, el Home está activo
        />
      ))}
    </div>
  );
}
