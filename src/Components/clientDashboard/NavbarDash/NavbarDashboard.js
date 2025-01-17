import NavBoton from "./NavBoton";

const Navbar = ["Home", "Ofertas", "Logros", "Lugares", "Ajustes"];

export default function NavbarDashboard() {
  return (
    <div className="h-4/6 xl:w-24 lg:w-20 md flex flex-col justify-around items-center">
      {Navbar.map((item, index) => (
        <NavBoton key={index} texto={item}></NavBoton>
      ))}
    </div>
  );
}
