import { Container } from "@/components/ui/Container";

export function FlowLayout({ children, stepIndex }: { children: React.ReactNode, stepIndex: number }) {
    return (
        <div className="relative flex flex-col pt-4 pb-24 w-full">

            {/* Children wrapper - no longer vertically centered */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}