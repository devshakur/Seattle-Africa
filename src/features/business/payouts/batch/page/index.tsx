"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BulkPayoutFlow } from "../components/BulkPayoutFlow";

export function BatchPayoutPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                        <Link
                            href="/business/dashboard"
                            className="hover:text-black transition-colors"
                        >
                            Business
                        </Link>
                        <span>/</span>
                        <span className="text-black font-medium">Bulk Payout</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        Bulk Payout
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Disburse cross-border payouts directly across African banking and mobile money rails.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/business/dashboard"
                        className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                    >
                        <ArrowLeft size={13} />
                        <span>Overview</span>
                    </Link>
                    <Link
                        href="/business/transactions"
                        className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                    >
                        <span>Transaction Ledger</span>
                        <ArrowUpRight size={13} />
                    </Link>
                </div>
            </div>

            {/* Main Minimalist Flow */}
            <div className="pt-2">
                <BulkPayoutFlow />
            </div>
        </div>
    );
}

export default BatchPayoutPage;
