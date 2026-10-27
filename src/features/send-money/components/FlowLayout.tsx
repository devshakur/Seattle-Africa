import { Container } from "@/components/ui/Container";

export function FlowLayout({ children, stepIndex }: { children: React.ReactNode, stepIndex: number }) {
    return (
        <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col pt-12 pb-24">
            {/* Top Center Progress Dots */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${i === stepIndex ? "w-6 bg-black" : "w-2 bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            <Container className="max-w-[900px] flex-1 flex flex-col items-center justify-center">
                {children}
            </Container>
        </div>
    );
}