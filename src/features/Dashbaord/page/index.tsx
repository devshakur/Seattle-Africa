import { DashboardLayout } from "../components/DashboardLayout";
import { WelcomeHeader } from "../components/WelcomeHeader";
import { StatCards } from "../components/StatsCards";
import { RecentTransactions } from "../components/RecentTransactions";
import { PromoCard } from "../components/PromoCard";

export function DashboardPage() {
    return (
        <DashboardLayout>
            <WelcomeHeader />
            <StatCards />

            {/* Bottom Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>
                <div className="lg:col-span-1">
                    <PromoCard />
                </div>
            </div>
        </DashboardLayout>
    );
}