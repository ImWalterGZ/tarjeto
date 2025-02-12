import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";
import LandingComp1 from "../components/landing/LandingComp1";

import LandingComp2 from "../components/landing/LandingComp2";
import LandingComp3 from "../components/landing/LandingComp3";
import LandingComp4 from "../components/landing/LandingComp4";
import LandingComp5 from "../components/landing/LandingComp5";


export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LandingComp1 />
      <LandingComp2 />
      <LandingComp3 />
      <LandingComp4 />
      <LandingComp5 />

    </div>
  );
}
