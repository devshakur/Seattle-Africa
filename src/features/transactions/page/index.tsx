"use client";

import { useTransactions } from "../hooks/useTransactions";
import { OverviewCards } from "../components/OverviewCards";
import { RevenueChart } from "../components/RevenueChart";
import { TransactionsTable } from "../components/TransactionsTable";
import { TransactionDetailsPanel } from "../components/TransactionDetailsPanel";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function TransactionsPage() {
    const { transactions, selectedTx, setSelectedTx } = useTransactions();

    return (
        <div className="animate-in fade-in duration-300 relative min-h-screen">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and manage all your payment activities.</p>
                </div>
                <Button className="h-10 px-5 rounded-xl gap-2 bg-black text-white hover:bg-gray-800">
                    <Plus size={16} /> New payment
                </Button>
            </div>

            <OverviewCards />
            <RevenueChart />
            <TransactionsTable
                transactions={transactions}
                onSelect={setSelectedTx}
            />

            {/* Slide-over Panel */}
            <TransactionDetailsPanel
                transaction={selectedTx}
                onClose={() => setSelectedTx(null)}
            />

        </div>
    );
}