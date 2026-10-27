import { Navbar } from "./components/NavBar";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-gray-200">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
            </main>
        </div>
    );
}