import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "../components/PhoneMockup";
import { MapBackground } from "../components/MapBackground";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
            <MapBackground />

            <Container className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Left Content */}
                <div className="max-w-xl">
                    <p className="text-sm font-medium text-gray-500 mb-5 tracking-wide">
                        Cross-border payments. Simplified.
                    </p>
                    <h1 className="text-[44px] leading-[1.1] md:text-[56px] md:leading-[1.1] lg:text-[64px] lg:leading-[1.05] font-bold tracking-tight text-gray-900 mb-6">
                        Send, receive and manage money across Africa with ease.
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
                        Settle Africa makes it simple to move money between countries, track your transactions and manage your finances — all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="rounded-xl px-8">Get started</Button>
                        <Button size="lg" variant="outline" className="rounded-xl px-8 bg-white">Learn more</Button>
                    </div>
                </div>

                {/* Right Visual - Positioned to overlap slightly with the center */}
                <div className="relative flex justify-center lg:justify-end lg:-ml-12 xl:-ml-20">
                    <PhoneMockup />
                </div>
            </Container>
        </section>
    );
}