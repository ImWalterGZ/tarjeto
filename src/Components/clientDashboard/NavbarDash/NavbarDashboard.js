import NavBoton from "./NavBoton";

const client = ["Home", "Ofertas", "Logros", "Lugares", "Ajustes"];
const negocio = ["Home", "Ofertas", "Estadísticas", "Mi negocio", "Ajustes"];

export default function NavbarDashboard(children) {
  let Navbar = [];
  switch (children.estilo) {
    case "cliente":
      Navbar = client;
      break;
    case "Negocio":
      Navbar = negocio;
  }

  return (
    <div className="flex flex-col items-center justify-around h-4/6 xl:w-24 lg:w-20 md">
      {Navbar.map((item, index) => (
        <NavBoton key={index} texto={item}></NavBoton>
      ))}
    </div>
  );
}
