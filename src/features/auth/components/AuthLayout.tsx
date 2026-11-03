"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-black selection:text-white antialiased">
            {/* Top spacer (in place of header to maintain vertical balance) */}
            <div className="w-full h-2" aria-hidden="true" />

            {/* Modal Container — optically elevated */}
            <main className="flex-1 flex items-center justify-center py-2 sm:py-4 -translate-y-4 sm:-translate-y-8">
                <div className="w-full max-w-[460px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Minimalist Centered Footer */}
            <footer className="w-full max-w-[460px] mx-auto py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck size={13} className="text-black shrink-0" />
                    <span>256-bit encryption &bull; Bank-grade security</span>
                </div>

                <div className="text-[11px] text-zinc-400 font-mono font-tabular-nums tabular-nums">
                    &copy; {new Date().getFullYear()} Settle Africa
                </div>
            </footer>
        </div>
    );
}
