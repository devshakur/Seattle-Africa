"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Send,
    FileSpreadsheet,
    ArrowUpRight,
    ShieldCheck,
    Clock,
    Layers,
    Building2,
    Search,
    Check,
    X,
    Users,
    BookUser,
    ArrowRightLeft,
    CreditCard,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    useBusiness,
    CorporateTransferItem,
} from "@/features/business/context/BusinessContext";
import { useCurrency } from "@/features/currency/CurrencyContext";
import { NewSingleTransferModal } from "../components/NewSingleTransferModal";
import { LivePassThroughTrackerModal } from "../components/LivePassThroughTrackerModal";

type ActivityFilter = "all" | "single" | "batch" | "pending_approval";

export function BusinessDashboardPage() {
    const {
        companyName,
        rcNumber,
        transfers,
        fundingSources,
        approveTransfer,
        rejectTransfer,
        initiateAccountSwitch,
    } = useBusiness();
    const { formatAmount } = useCurrency();

    const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<CorporateTransferItem | null>(null);

    // Dynamic Summary Statistics
    const stats = useMemo(() => {
        const totalVolumeUsd = transfers
            .filter((t) => t.status !== "pending_approval")
            .reduce((sum, t) => sum + t.amountUsd, 0);

        const batchTransfers = transfers.filter((t) => t.type === "batch");
        const totalBatchRecipients = batchTransfers.reduce(
            (sum, t) => sum + (t.recipientCount || 0),
            0
        );

        const pendingItems = transfers.filter((t) => t.status === "pending_approval");
        const pendingVolumeUsd = pendingItems.reduce((sum, t) => sum + t.amountUsd, 0);

        return {
            totalVolumeUsd,
            settledCount: transfers.filter((t) => t.status !== "pending_approval").length,
            activeBatchesCount: batchTransfers.length,
            totalBatchRecipients,
            pendingCount: pendingItems.length,
            pendingVolumeUsd,
        };
    }, [transfers]);

    const filteredTransfers = useMemo(() => {
        return transfers.filter((tx) => {
            if (activeFilter === "single" && tx.type !== "single") return false;
            if (activeFilter === "batch" && tx.type !== "batch") return false;
            if (activeFilter === "pending_approval" && tx.status !== "pending_approval")
                return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    tx.reference.toLowerCase().includes(q) ||
                    tx.beneficiaryName.toLowerCase().includes(q) ||
                    tx.beneficiarySubtext.toLowerCase().includes(q) ||
                    tx.corridorCountry.toLowerCase().includes(q) ||
                    tx.fundingSourceName.toLowerCase().includes(q) ||
                    tx.currencyCode.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [transfers, activeFilter, searchQuery]);

    const filterTabs: { id: ActivityFilter; label: string; count: number }[] = [
        { id: "all", label: "All Corporate Activity", count: transfers.length },
        {
            id: "single",
            label: "Single Transfers",
            count: transfers.filter((t) => t.type === "single").length,
        },
        {
            id: "batch",
            label: "Payroll / Vendor Batches",
            count: transfers.filter((t) => t.type === "batch").length,
        },
        {
            id: "pending_approval",
            label: "Pending Approvals",
            count: stats.pendingCount,
        },
    ];

    return (
        <div className="space-y-8 pb-16 text-black">
            {/* Corporate Overview Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 rounded border border-black bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
                            <Building2 size={11} />
                            <span>Corporate Treasury Overview</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[10px] font-mono font-semibold text-black uppercase tracking-wider font-tabular-nums">
                            <span>{rcNumber}</span>
                            <span>&bull;</span>
                            <span>Direct Pass-Through Model</span>
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                        {companyName}
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Zero-custody corporate settlement engine. Funds move directly from linked bank mandates or commercial cards to African payout partners.
                    </p>
                </div>

                {/* Top Header Quick Actions & Workspace Switch */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => initiateAccountSwitch("personal")}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E5E5E5] bg-white text-black hover:border-black text-xs font-semibold transition-all cursor-pointer"
                    >
                        <ArrowRightLeft size={14} />
                        <span>Switch to Personal Account</span>
                    </button>
                    <Button
                        type="button"
                        variant="outline"
                        href="/business/payouts/batch"
                        className="h-10 px-4 text-xs font-semibold border-black bg-white text-black hover:bg-zinc-100 cursor-pointer"
                    >
                        <FileSpreadsheet size={15} />
                        <span>New Bulk Payout</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setIsSingleModalOpen(true)}
                        className="h-10 px-4 text-xs font-semibold bg-black text-white hover:bg-zinc-800 cursor-pointer"
                    >
                        <Send size={14} />
                        <span>New Single Transfer</span>
                    </Button>
                </div>
            </div>

            {/* 1. Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stat Card 1: Total Volume Sent This Month */}
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between hover:border-black transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                            Total Volume Sent (Month)
                        </span>
                        <div className="w-9 h-9 rounded-lg border border-[#E5E5E5] bg-zinc-50 flex items-center justify-center text-black">
                            <ArrowUpRight size={17} />
                        </div>
                    </div>

                    <div className="my-4 font-tabular-nums">
                        <div className="text-3xl font-bold tracking-tight text-black font-mono font-tabular-nums">
                            ${stats.totalVolumeUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            <span className="text-xs font-normal text-zinc-500 ml-1.5">USD</span>
                        </div>
                        <p className="text-xs font-mono text-zinc-500 mt-1 font-tabular-nums">
                            &asymp; {formatAmount(stats.totalVolumeUsd * 1592)} local corridor equivalent
                        </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-tabular-nums">
                        <span className="font-mono font-bold text-black bg-zinc-100 px-2 py-0.5 rounded border border-[#E5E5E5]">
                            +18.4% vs last month
                        </span>
                        <span className="text-zinc-500 font-mono">
                            {stats.settledCount} pass-throughs
                        </span>
                    </div>
                </div>

                {/* Stat Card 2: Active Payroll / Vendor Batches */}
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between hover:border-black transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                            Active Payroll / Vendor Batches
                        </span>
                        <div className="w-9 h-9 rounded-lg border border-[#E5E5E5] bg-zinc-50 flex items-center justify-center text-black">
                            <Layers size={17} />
                        </div>
                    </div>

                    <div className="my-4 font-tabular-nums">
                        <div className="text-3xl font-bold tracking-tight text-black font-mono font-tabular-nums">
                            {stats.activeBatchesCount}
                            <span className="text-sm font-sans font-semibold text-zinc-500 ml-2">
                                Active Batches
                            </span>
                        </div>
                        <p className="text-xs font-mono text-zinc-500 mt-1 font-tabular-nums">
                            {stats.totalBatchRecipients} total recipients across 5 African corridors
                        </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                        <span className="text-zinc-600 font-mono font-tabular-nums">
                            NGN &bull; KES &bull; GHS &bull; ZAR &bull; RWF
                        </span>
                        <Link
                            href="/business/payouts/batch"
                            className="font-mono font-bold text-black hover:underline flex items-center gap-1"
                        >
                            <span>Upload CSV</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* Stat Card 3: Pending Checker Approvals */}
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between hover:border-black transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                            Pending Checker Approvals
                        </span>
                        <div className="w-9 h-9 rounded-lg border border-black bg-black flex items-center justify-center text-white">
                            <Clock size={17} />
                        </div>
                    </div>

                    <div className="my-4 font-tabular-nums">
                        <div className="flex items-baseline gap-2.5">
                            <span className="text-3xl font-bold tracking-tight text-black font-mono font-tabular-nums">
                                {stats.pendingCount}
                            </span>
                            <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border border-black text-black">
                                {stats.pendingCount === 0 ? "Queue Clear" : "Awaiting Sign-Off"}
                            </span>
                        </div>
                        <p className="text-xs font-mono text-zinc-500 mt-1 font-tabular-nums">
                            ${stats.pendingVolumeUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD staged for Checker authorization
                        </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                        <span className="text-zinc-500 font-mono">Dual-control maker-checker</span>
                        <button
                            type="button"
                            onClick={() => setActiveFilter("pending_approval")}
                            className="font-mono font-bold text-black hover:underline cursor-pointer"
                        >
                            Review Queue &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Quick Action Panel & Direct Pass-Through Funding Rails */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prominent Quick Action Panel */}
                <div className="lg:col-span-2 rounded-2xl border border-black bg-white p-6 sm:p-7 flex flex-col justify-between space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-5">
                        <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                Corporate Disbursement Command Center
                            </span>
                            <h2 className="text-lg font-bold text-black mt-0.5">
                                Initiate Direct Pass-Through Settlement
                            </h2>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-black bg-zinc-100 border border-[#E5E5E5] px-3 py-1 rounded-full self-start sm:self-auto">
                            <ShieldCheck size={13} />
                            <span>ISO 20022 Direct Clearing</span>
                        </span>
                    </div>

                    {/* Two Prominent Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-[#E5E5E5] p-5 flex flex-col justify-between hover:border-black transition-all bg-white">
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-3.5">
                                    <Send size={18} />
                                </div>
                                <h3 className="text-base font-bold text-black">
                                    New Single Transfer
                                </h3>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                    Pay an individual corporate invoice or contractor retainer directly from your corporate bank mandate or debit card.
                                </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-[#E5E5E5]">
                                <Button
                                    type="button"
                                    onClick={() => setIsSingleModalOpen(true)}
                                    className="w-full h-10 bg-black text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                                >
                                    <Send size={14} />
                                    <span>New Single Transfer</span>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#E5E5E5] p-5 flex flex-col justify-between hover:border-black transition-all bg-white">
                            <div>
                                <div className="w-10 h-10 rounded-lg border border-black bg-zinc-50 text-black flex items-center justify-center mb-3.5">
                                    <FileSpreadsheet size={18} />
                                </div>
                                <h3 className="text-base font-bold text-black">
                                    New Bulk Payout
                                </h3>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                    Upload a CSV or Excel batch for mass vendor settlements or multi-country African payroll with pre-flight validation.
                                </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-[#E5E5E5]">
                                <Button
                                    type="button"
                                    href="/business/payouts/batch"
                                    className="w-full h-10 bg-black text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                                >
                                    <FileSpreadsheet size={14} />
                                    <span>New Bulk Payout</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Quick Governance Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Link
                            href="/business/beneficiaries"
                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#E5E5E5] hover:border-black transition-colors text-xs font-semibold text-black"
                        >
                            <div className="flex items-center gap-2.5">
                                <BookUser size={16} className="text-black" />
                                <span>Verified Corporate Beneficiary Directory</span>
                            </div>
                            <ArrowUpRight size={14} />
                        </Link>
                        <Link
                            href="/business/settings/team"
                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#E5E5E5] hover:border-black transition-colors text-xs font-semibold text-black"
                        >
                            <div className="flex items-center gap-2.5">
                                <Users size={16} className="text-black" />
                                <span>Team Roles &amp; Maker-Checker Limits</span>
                            </div>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Direct Source Funding Instruments Panel */}
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                Source Funding Mandates
                            </span>
                            <span className="text-[10px] font-mono font-bold text-black border border-black px-2 py-0.5 rounded">
                                No Wallet Custody
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-black">
                            Linked Corporate Sources
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Settlements pull directly from these verified corporate instruments at execution time.
                        </p>
                    </div>

                    <div className="space-y-2.5 flex-1">
                        {fundingSources.map((fs) => (
                            <div
                                key={fs.id}
                                className="rounded-xl border border-[#E5E5E5] p-3.5 hover:border-black transition-colors"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {fs.type === "corporate_bank" ? (
                                            <Building2 size={15} className="text-black shrink-0" />
                                        ) : (
                                            <CreditCard size={15} className="text-black shrink-0" />
                                        )}
                                        <p className="text-xs font-bold text-black truncate">
                                            {fs.institutionName}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-black font-tabular-nums shrink-0">
                                        {fs.maskedNumber}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 font-tabular-nums">
                                    <span>{fs.rail}</span>
                                    <span className="text-black font-semibold">
                                        Fee: {fs.feePercent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-mono text-zinc-500 font-tabular-nums">
                        <span>Combined Daily Pull Capacity</span>
                        <span className="font-bold text-black">$2,100,000.00 USD</span>
                    </div>
                </div>
            </div>

            {/* 3. Recent Corporate Transfer Activity Table with Live Status Tracking */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
                <div className="p-6 border-b border-[#E5E5E5] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-black">
                                    Recent Corporate Transfer Activity
                                </h2>
                                <span className="inline-flex items-center gap-1 rounded border border-black bg-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                    <Activity size={11} />
                                    <span>Live Pass-Through Telemetry</span>
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Real-time status of single vendor disbursements and bulk payroll batches moving from corporate source to payout partner.
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search ref, vendor, corridor..."
                                className="w-full h-10 rounded-lg border border-[#E5E5E5] bg-white pl-9 pr-3.5 text-xs font-medium text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        {filterTabs.map((tab) => {
                            const isActive = activeFilter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveFilter(tab.id)}
                                    className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                                        isActive
                                            ? "text-white"
                                            : "text-zinc-600 hover:text-black bg-zinc-50 border border-[#E5E5E5]"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="dashboardActivityFilterPill"
                                            className="absolute inset-0 rounded-lg bg-black z-0"
                                            transition={{
                                                type: "spring",
                                                stiffness: 420,
                                                damping: 32,
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab.label}</span>
                                    <span
                                        className={`relative z-10 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded font-tabular-nums ${
                                            isActive
                                                ? "bg-white text-black"
                                                : "bg-white text-black border border-[#E5E5E5]"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Activity Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E5E5E5] bg-zinc-50 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                <th className="py-3.5 px-5">Reference &amp; Time</th>
                                <th className="py-3.5 px-5">Beneficiary / Batch</th>
                                <th className="py-3.5 px-5">Source Funding Rail</th>
                                <th className="py-3.5 px-5">Corridor &amp; FX</th>
                                <th className="py-3.5 px-5 text-right">Pass-Through Volume</th>
                                <th className="py-3.5 px-5">Live Status Tracking</th>
                                <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] text-xs">
                            {filteredTransfers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-xs text-zinc-500 font-mono"
                                    >
                                        No corporate transfer activity matches your current filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransfers.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-zinc-50/80 transition-colors group"
                                    >
                                        {/* Reference & Timestamp */}
                                        <td className="py-4 px-5 align-top whitespace-nowrap font-tabular-nums">
                                            <p className="font-mono font-bold text-black">
                                                {tx.reference}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                                                {tx.timestamp}
                                            </p>
                                        </td>

                                        {/* Beneficiary / Batch */}
                                        <td className="py-4 px-5 align-top min-w-[230px]">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border ${
                                                        tx.type === "batch"
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-black border-black"
                                                    }`}
                                                >
                                                    {tx.type === "batch"
                                                        ? `BATCH (${tx.recipientCount})`
                                                        : "SINGLE"}
                                                </span>
                                                <p className="font-bold text-black truncate">
                                                    {tx.beneficiaryName}
                                                </p>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 mt-1 truncate">
                                                {tx.beneficiarySubtext}
                                            </p>
                                        </td>

                                        {/* Source Funding Rail */}
                                        <td className="py-4 px-5 align-top whitespace-nowrap">
                                            <p className="font-semibold text-black font-tabular-nums">
                                                {tx.fundingSourceName}
                                            </p>
                                            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                                                {tx.fundingSourceRail}
                                            </p>
                                        </td>

                                        {/* Corridor & FX */}
                                        <td className="py-4 px-5 align-top whitespace-nowrap font-tabular-nums">
                                            <div className="flex items-center gap-1.5 font-semibold text-black">
                                                <span>{tx.corridorFlag}</span>
                                                <span>USD &rarr; {tx.currencyCode}</span>
                                            </div>
                                            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                                                1 USD = {tx.fxRateToUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                                                {tx.currencyCode}
                                            </p>
                                        </td>

                                        {/* Settlement Volume */}
                                        <td className="py-4 px-5 align-top text-right whitespace-nowrap font-mono font-tabular-nums">
                                            <p className="font-bold text-black text-sm">
                                                ${tx.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                {tx.currencySymbol}{" "}
                                                {tx.amountLocal.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                        </td>

                                        {/* Live Status Tracking */}
                                        <td className="py-4 px-5 align-top min-w-[195px]">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                {tx.status === "completed" && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                                        <Check size={10} />
                                                        <span>Disbursed</span>
                                                    </span>
                                                )}
                                                {tx.status === "clearing" && (
                                                    <span className="inline-flex items-center gap-1 rounded border border-black bg-white text-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                                                        <span>Clearing FX Rail</span>
                                                    </span>
                                                )}
                                                {tx.status === "pending_approval" && (
                                                    <span className="inline-flex items-center gap-1 rounded border border-dashed border-black bg-zinc-100 text-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                                        <Clock size={10} />
                                                        <span>Pending Checker</span>
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-mono font-bold text-zinc-500 font-tabular-nums">
                                                    {tx.clearingStage}/3
                                                </span>
                                            </div>

                                            {/* 3-Step Monochrome Pass-Through Progress Bar */}
                                            <div className="grid grid-cols-3 gap-1">
                                                {[1, 2, 3].map((step) => (
                                                    <div
                                                        key={step}
                                                        className={`h-1.5 rounded-full ${
                                                            step <= tx.clearingStage
                                                                ? "bg-black"
                                                                : "bg-[#E5E5E5]"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                                                {tx.status === "completed"
                                                    ? `Settled via ${tx.payoutPartnerRail}`
                                                    : tx.status === "clearing"
                                                      ? "Source pulled -> Partner clearing"
                                                      : `Maker: ${tx.initiatedBy.split(" ")[0]}`}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                                            <div className="inline-flex items-center justify-end gap-1.5">
                                                {tx.status === "pending_approval" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => approveTransfer(tx.id)}
                                                            className="px-2.5 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                                                            title="Approve &amp; Execute Direct Pass-Through"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => rejectTransfer(tx.id)}
                                                            className="p-1.5 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                                                            title="Decline Transfer"
                                                            aria-label="Decline Transfer"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedTransfer(tx)}
                                                    className="px-2.5 py-1.5 rounded-lg border border-[#E5E5E5] bg-white text-black hover:border-black text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                                                >
                                                    Track Rail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <NewSingleTransferModal
                isOpen={isSingleModalOpen}
                onClose={() => setIsSingleModalOpen(false)}
            />
            <LivePassThroughTrackerModal
                transfer={selectedTransfer}
                onClose={() => setSelectedTransfer(null)}
                onApprove={approveTransfer}
            />
        </div>
    );
}

