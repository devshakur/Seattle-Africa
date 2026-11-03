import { WelcomeHeader } from "../components/WelcomeHeader";
import { ExchangeRateTicker } from "../components/ExchangeRateTicker";
import { HeroCard } from "../components/HeroCard";
import { QuickStats } from "../components/QuickStats";
import { RecentBeneficiaries } from "../components/RecentBeneficiaries";
import { QuickActions } from "../components/QuickActions";
import { QuickTransferCTA } from "../components/QuickTransferCTA";
import { RecentTransactions } from "../components/RecentTransactions";
import { RightSidebarWidgets } from "../components/RightSidebarWidgets";

export default function DashboardPage() {
    return (
        <div className="animate-in fade-in duration-300">
            <WelcomeHeader />

            {/* Minimalist Live FX Rates Ticker */}
            <ExchangeRateTicker />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Takes up 2/3 space) */}
                <div className="lg:col-span-2 space-y-6">
                    <HeroCard />
                    <QuickStats />
                    {/* Recent Beneficiaries Horizontal Scroll Carousel */}
                    <RecentBeneficiaries />
                    <QuickActions />
                </div>

                {/* Right Column (Takes up 1/3 space) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Persistent CTA Panel with Quick Currency Selectors */}
                    <QuickTransferCTA />
                    <RightSidebarWidgets />
                </div>

                {/* Full Width Transactions Table */}
                <div className="lg:col-span-3">
                    <RecentTransactions />
                </div>

            </div>
        </div>
    );
}
