// src/components/layouts/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import logo from "../../assets/isotipo-white.png";

const PrivateLayout = ({ children }) => {
  return (
    <div className="flex flex-col w-screen h-screen bg-red-primary font-poppins">
      <img src={logo} className="self-center w-32 py-2 my-2" />
      <div className="flex flex-row items-center h-full">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default PrivateLayout;
