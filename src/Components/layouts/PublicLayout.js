// src/components/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

const PublicLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
