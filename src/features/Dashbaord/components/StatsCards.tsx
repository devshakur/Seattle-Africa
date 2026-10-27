import { Card } from "@/components/ui/Card";
import { ArrowUpRight, ArrowDownRight, Wallet, Clock, CheckCircle2 } from "lucide-react";

const stats = [
    {
        title: "Total Processed",
        amount: "$2,480.00",
        trend: "+ 2.5% vs last week",
        trendUp: true,
        icon: Wallet,
    },
    {
        title: "Pending transfers",
        amount: "$320.00",
        subtitle: "2 transactions",
        icon: Clock,
    },
    {
        title: "Total received",
        amount: "$1,240.00",
        trend: "+ 11.2% vs last month",
        trendUp: true,
        icon: CheckCircle2,
    },
];

export function StatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-gray-50 text-gray-500">
                            <stat.icon size={16} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    </div>

                    <p className="text-[28px] font-bold text-gray-900 mb-2">{stat.amount}</p>

                    {stat.trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.trend}
                        </div>
                    )}
                    {stat.subtitle && (
                        <p className="text-xs text-gray-400 font-medium">{stat.subtitle}</p>
                    )}
                </Card>
            ))}
        </div>
    );
}