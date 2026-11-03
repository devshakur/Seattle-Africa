"use client";

import { useEffect, useState } from "react";
import { WelcomeHeader } from "../components/WelcomeHeader";
import { ExchangeRateTicker } from "../components/ExchangeRateTicker";
import { HeroCard } from "../components/HeroCard";
import { QuickStats } from "../components/QuickStats";
import { RecentBeneficiaries } from "../components/RecentBeneficiaries";
import { QuickTransferCTA } from "../components/QuickTransferCTA";
import { RecentTransactions } from "../components/RecentTransactions";
import { DashboardSkeleton } from "../components/DashboardSkeleton";

/** Set by the login / signup forms right before redirecting here. */
export const DASHBOARD_SKELETON_FLAG = "settle_africa_dashboard_skeleton";
const SKELETON_MS = 3000;

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);

    // Show a 3s skeleton only when arriving straight after login / signup
    useEffect(() => {
        let pending = false;
        try {
            pending = sessionStorage.getItem(DASHBOARD_SKELETON_FLAG) === "1";
        } catch {
            // ignore storage errors
        }
        if (!pending) return;

        setLoading(true);
        const timer = setTimeout(() => {
            try {
                sessionStorage.removeItem(DASHBOARD_SKELETON_FLAG);
            } catch {
                // ignore
            }
            setLoading(false);
        }, SKELETON_MS);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="animate-in fade-in duration-300">
            <WelcomeHeader />
            <QuickStats />
            {/* Minimalist Live FX Rates Ticker */}
            <ExchangeRateTicker />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Takes up 2/3 space) */}
                <div className="lg:col-span-2 space-y-6">
                    <HeroCard />
                    <RecentBeneficiaries />
                </div>

                {/* Right Column (Takes up 1/3 space) */}
                <div className="lg:col-span-1 space-y-6">
                    <QuickTransferCTA />
                </div>

                {/* Full Width Transactions Table */}
                <div className="lg:col-span-3">
                    <RecentTransactions />
                </div>

            </div>
        </div>
    );
}
