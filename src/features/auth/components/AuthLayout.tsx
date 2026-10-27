import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">


            {/* Main Content Area */}
            <main className="flex-1 flex items-start justify-center">
                <Container className="max-w-[620px] w-full">
                    {children}
                </Container>
            </main>
        </div>
    );
}