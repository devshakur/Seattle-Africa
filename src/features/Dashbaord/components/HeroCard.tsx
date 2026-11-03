"use client";

import Link from "next/link";
import { ArrowUpRight, Download, RefreshCw, Plus, Send } from "lucide-react";
import { useCurrency } from "@/features/currency/CurrencyContext";
import { CurrencySwitcher } from "@/features/currency/CurrencySwitcher";

export function HeroCard() {
    const { formatAmount, currency } = useCurrency();

    // Baseline volume in NGN (e.g. 2,450,000 NGN) automatically converted into active currency
    const totalVolumeNgn = 2450000;
    const formattedVolume = formatAmount(totalVolumeNgn);

    return (
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden shadow-xl">
            {/* Decorative subtle grid/blob background for that premium feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <p className="text-gray-400 text-sm">
                            Total Volume Transferred
                        </p>
                        {/* Currency Switcher inside Hero Card */}
                        <CurrencySwitcher variant="card" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 font-mono font-tabular-nums tabular-nums">
                        {formattedVolume}
                    </h2>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <div className="flex items-center gap-1 text-white">
                            <ArrowUpRight size={16} className="text-white" />
                            <span>+0.27%</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                            vs last month ({currency.code} settlement)
                        </span>
                    </div>
                </div>

                {/* Quick Action Buttons inside Hero Card */}
                <div className="flex gap-3 sm:gap-4">
                    {[
                        { label: "Send", icon: Send, href: "/send-money" },
                        { label: "Receive", icon: Download, href: "/transactions" },
                        { label: "Exchange", icon: RefreshCw, href: "/send-money" },
                        { label: "New", icon: Plus, href: "/send-money" },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/5">
                                <action.icon size={16} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
