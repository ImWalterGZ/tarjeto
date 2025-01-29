import HeroSection from "../components/landing/HeroSection";
import LandingComp2 from "../components/landing/LandingComp2";
import Navbar from "../components/landing/Navbar";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />;
      <LandingComp2 />
    </div>
  );
}
