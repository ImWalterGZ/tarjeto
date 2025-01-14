import NavBoton from "./NavBoton";

const Navbar = ["Home", "Ofertas", "Logros", "Lugares", "Ajustes"];

export default function NavbarDashboard() {
  return (
    <div className="h-4/6 w-1/12 flex flex-col justify-around items-center">
      {Navbar.map((item, index) => (
        <NavBoton key={index} texto={item}></NavBoton>
      ))}
    </div>
  );
}
