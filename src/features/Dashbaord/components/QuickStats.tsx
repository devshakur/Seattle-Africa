"use client";

import { ArrowUpRight, ArrowDownRight, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useCurrency } from "@/features/currency/CurrencyContext";

export function QuickStats() {
    const { formatAmount } = useCurrency();

    const stats = [
        {
            title: "Total Sent",
            amount: formatAmount(1420),
            trend: "+ 18%",
            trendUp: true,
            icon: ArrowUpRight,
        },
        {
            title: "Total Received",
            amount: formatAmount(1030000),
            trend: "- 2%",
            subtitle: "Across 3 African countries",
            trendUp: false,
            icon: ArrowDownRight,
        },
        {
            title: "Pending Transactions",
            amount: "24",
            subtitle: "Across 6 African countries",
            icon: Users,
        },

    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
                <Card key={i} className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-700">
                            <stat.icon size={18} />
                        </div>
                        {stat.trend && (
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trendUp
                                    ? "bg-gray-100 text-black"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            {stat.title}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 font-mono font-tabular-nums tabular-nums">
                            {stat.amount}
                        </h3>
                        {stat.subtitle && (
                            <p className="text-xs text-gray-400 mt-1">
                                {stat.subtitle}
                            </p>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
