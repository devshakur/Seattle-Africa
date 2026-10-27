import { Card } from "@/components/ui/Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
    { title: "Approved Transactions", value: "1,748", trend: "+ 3.54%", up: true },
    { title: "Declined Transactions", value: "224", trend: "+ 1.23%", up: true },
    { title: "Refunded Transactions", value: "87", trend: "- 3.54%", up: false },
    { title: "New Customers", value: "344", trend: "+ 1.23%", up: true },
];

export function OverviewCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
                <Card key={i} className="p-5">
                    <p className="text-xs font-medium text-gray-500 mb-2">{stat.title}</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? 'text-black' : 'text-gray-400'}`}>
                            {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.trend}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}