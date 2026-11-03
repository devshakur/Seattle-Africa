"use client";

import { useState } from "react";
import { Sidebar } from "@/components/shared/layout/Sidebar";
import { Topbar } from "@/components/shared/layout/Topbar";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <CurrencyProvider>
            <div className="min-h-screen bg-[#FAFAFA]">
                {/* Global Sidebar (Now handles mobile drawer) */}
                <Sidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:pl-[260px] flex flex-col min-h-screen">
                    <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </CurrencyProvider>
    );
}
