"use client";

import { useState } from "react";
import { BusinessSidebar } from "@/components/business/layout/BusinessSidebar";
import { BusinessTopbar } from "@/components/business/layout/BusinessTopbar";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";
import { BusinessProvider } from "@/features/business/context/BusinessContext";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <CurrencyProvider>
            <BusinessProvider>
                <div className="min-h-screen bg-white text-black">
                    <BusinessSidebar
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="lg:pl-[260px] flex flex-col min-h-screen">
                        <BusinessTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />
                        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
                            {children}
                        </main>
                    </div>
                </div>
            </BusinessProvider>
        </CurrencyProvider>
    );
}

