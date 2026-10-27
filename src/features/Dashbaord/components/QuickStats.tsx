import { ArrowUpRight, ArrowDownRight, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";

const stats = [
    {
        title: "Total Sent",
        amount: "$8,450.00",
        trend: "+ 18%",
        trendUp: true,
        icon: ArrowUpRight,
    },
    {
        title: "Total Received",
        amount: "$4,030.00",
        trend: "- 2%",
        trendUp: false,
        icon: ArrowDownRight,
    },
    {
        title: "Active Recipients",
        amount: "24",
        subtitle: "Across 3 countries",
        icon: Users,
    },
];

export function QuickStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
                <Card key={i} className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-700">
                            <stat.icon size={18} />
                        </div>
                        {stat.trend && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trendUp ? "bg-gray-100 text-black" : "bg-gray-100 text-gray-500"
                                }`}>
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.amount}</h3>
                        {stat.subtitle && <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>}
                    </div>
                </Card>
            ))}
        </div>
    );
}