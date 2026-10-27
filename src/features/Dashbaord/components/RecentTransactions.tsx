import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const transactions = [
    {
        id: 1,
        type: "To Nigeria",
        bank: "KES 50,000",
        status: "Completed",
        date: "Oct 22, 2025",
        amount: "- KES 50,000",
        flag: "🇳🇬",
        amountColor: "text-gray-900",
    },
    {
        id: 2,
        type: "From Ghana",
        bank: "GHS 1,000",
        status: "Completed",
        date: "Oct 21, 2025",
        amount: "+ USD 76.50",
        flag: "🇬🇭",
        amountColor: "text-green-500",
    },
    {
        id: 3,
        type: "To Kenya",
        bank: "USD 120",
        status: "Completed",
        date: "Oct 20, 2025",
        amount: "- KES 16,800",
        flag: "🇰🇪",
        amountColor: "text-gray-900",
    },
    {
        id: 4,
        type: "From UK",
        bank: "GBP 50",
        status: "Completed",
        date: "Oct 18, 2025",
        amount: "+ KES 76,450",
        flag: "🇬🇧",
        amountColor: "text-green-500",
    },
];

export function RecentTransactions() {
    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Recent transactions</h2>
                <Link href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                    View all <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex flex-col">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-4">
                            {/* Flag Emoji as a placeholder for the circular flags */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-sm border border-gray-200">
                                {tx.flag}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{tx.type}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {tx.bank} <span className="mx-1 text-gray-300">•</span> {tx.status}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${tx.amountColor}`}>{tx.amount}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}