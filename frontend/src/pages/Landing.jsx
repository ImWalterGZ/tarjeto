import HeroSection from "../components/landing/HeroSection";
import LandingComp2 from "../components/landing/LandingComp2";
import Navbar from "../components/landing/Navbar";
import LandingComp1 from "../components/landing/LandingComp1";
import LandingComp2 from "../components/landing/LandingComp2";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LandingComp1 />
      <LandingComp2 />
    </div>
  );
}
