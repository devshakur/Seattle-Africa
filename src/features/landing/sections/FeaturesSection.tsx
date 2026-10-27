import { Container } from "@/components/ui/Container";
import { Shield, Percent, Activity, Link as LinkIcon } from "lucide-react";

const features = [
    {
        title: "Fast & Secure",
        description: "Your money, protected at every step.",
        icon: Shield,
    },
    {
        title: "Competitive Rates",
        description: "Get the best rates with full transparency.",
        icon: Percent,
    },
    {
        title: "Track in Real-Time",
        description: "Stay informed from start to finish.",
        icon: Activity,
    },
    {
        title: "Connect Accounts",
        description: "Link your bank accounts and manage your finances.",
        icon: LinkIcon,
    },
];

export function FeaturesSection() {
    return (
        <section className="py-16 border-t border-gray-100 bg-white">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-start gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                <feature.icon size={20} className="text-gray-900 stroke-[1.5]" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mt-1">{feature.title}</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed max-w-[200px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}