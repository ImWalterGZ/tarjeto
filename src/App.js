import "./App.css";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import AppDashboard from "./pages/ClientDashboard";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeroSection />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <div>Contact Page</div>
            </>
          }
        />
        <Route
          path="/negocios"
          element={
            <>
              <Navbar />
              <div>Negocios Page</div>
            </>
          }
        />

        <Route path="/clientDashboard/*" element={<AppDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
