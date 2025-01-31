import BodyPage from "../components/landing/BodyPage";
import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BodyPage />;
    </div>
  );
}
