
import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";
import LandingComp1 from "../components/landing/LandingComp1";
import LandingComp2 from "../components/landing/LandingComp2";
import LandingComp3 from "../components/landing/LandingComp3";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LandingComp1 />
      <LandingComp2 />
      <LandingComp3 />
    </div>
  );
}
