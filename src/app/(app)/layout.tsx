import { Sidebar } from "@/components/shared/layout/Sidebar";
import { Topbar } from "@/components/shared/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Global Sidebar */}
            <Sidebar />

            {/* Main Content Area (offset by sidebar width on desktop) */}
            <div className="lg:pl-[260px] flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}