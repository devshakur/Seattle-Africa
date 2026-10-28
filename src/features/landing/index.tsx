import { NavBar } from "./components/NavBar";
import { HeroSection } from "./sections/HeroSection";
import { TrustStrip } from "./sections/TrustStrip";
import { BenefitsSection } from "./sections/BenefitsSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { ReachSection } from "./sections/ReachSection";
import { SendSection } from "./sections/SendSection";
import { Footer } from "./components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-200">
      <NavBar />
      <main>
        <HeroSection />
        <TrustStrip />
        <BenefitsSection />
        <HowItWorksSection />
        <ReachSection />
        <SendSection />
      </main>
      <Footer />
    </div>
  );
}
