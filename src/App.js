import "./App.css";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import AppDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes with Navbar */}
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

        {/* App Dashboard routes */}
        <Route path="/clientDashboard/*" element={<AppDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
