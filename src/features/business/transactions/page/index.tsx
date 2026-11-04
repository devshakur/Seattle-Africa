"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Download,
    Plus,
    FileSpreadsheet,
    ChevronRight,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Layers,
    type LucideIcon,
} from "lucide-react";
import {
    useBusiness,
    CorporateTransferItem,
    PassThroughStatus,
} from "@/features/business/context/BusinessContext";
import { NewSingleTransferModal } from "@/features/business/dashboard/components/NewSingleTransferModal";
import { LivePassThroughTrackerModal } from "@/features/business/dashboard/components/LivePassThroughTrackerModal";

type FilterStatus = "all" | "completed" | "clearing" | "pending_approval" | "batch";

const FILTERS: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "completed", label: "Paid" },
    { id: "clearing", label: "Clearing" },
    { id: "pending_approval", label: "Approvals" },
    { id: "batch", label: "Batch" },
];

const STATUS_LABEL: Record<PassThroughStatus, string> = {
    completed: "Paid",
    clearing: "Clearing",
    source_debited: "Processing",
    pending_approval: "Awaiting approval",
};

const usd = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function StatTile({
    label,
    value,
    subtext,
    icon: Icon,
    dark = false,
}: {
    label: string;
    value: string;
    subtext?: string;
    icon: LucideIcon;
    dark?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">{label}</span>
                <span
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                        dark ? "bg-black text-white border-black" : "bg-zinc-50 text-black border-[#E5E5E5]"
                    }`}
                >
                    <Icon size={14} />
                </span>
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold tracking-tight font-tabular-nums text-black">{value}</p>
                {subtext && <p className="text-xs text-zinc-400 mt-0.5 font-tabular-nums">{subtext}</p>}
            </div>
        </div>
    );
}

export function BusinessTransactionsPage() {
    const { transfers, approveTransfer } = useBusiness();

    const [filter, setFilter] = useState<FilterStatus>("all");
    const [query, setQuery] = useState("");
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [selected, setSelected] = useState<CorporateTransferItem | null>(null);

    const stats = useMemo(() => {
        const totalVolume = transfers.reduce((sum, t) => sum + t.amountUsd, 0);
        const paidCount = transfers.filter((t) => t.status === "completed").length;
        const clearingCount = transfers.filter((t) => t.status === "clearing" || t.status === "source_debited").length;
        const pendingCount = transfers.filter((t) => t.status === "pending_approval").length;
        return { totalVolume, paidCount, clearingCount, pendingCount };
    }, [transfers]);

    const filteredTransfers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return transfers.filter((t) => {
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "batch"
                    ? t.type === "batch"
                    : t.status === filter;

            const matchesSearch =
                !q ||
                t.beneficiaryName.toLowerCase().includes(q) ||
                t.reference.toLowerCase().includes(q) ||
                t.corridorCountry.toLowerCase().includes(q) ||
                t.currencyCode.toLowerCase().includes(q);

            return matchesFilter && matchesSearch;
        });
    }, [transfers, filter, query]);

    const exportCsv = () => {
        const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
        const rows = [
            ["Reference", "Beneficiary", "Corridor", "Date", "Amount USD", "Local Amount", "Status"],
            ...filteredTransfers.map((t) => [
                t.reference,
                t.beneficiaryName,
                `${t.corridorCountry} (${t.currencyCode})`,
                t.timestamp,
                t.amountUsd.toFixed(2),
                `${t.currencySymbol} ${t.amountLocal.toFixed(2)}`,
                STATUS_LABEL[t.status],
            ]),
        ];
        const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "business-transactions.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 pb-16 text-black">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-xs text-zinc-500 mt-1">Settlement history and pass-through audit logs.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/business/payouts/batch"
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#E5E5E5] bg-white hover:bg-zinc-100 text-xs font-semibold cursor-pointer"
                    >
                        <FileSpreadsheet size={14} />
                        Bulk payout
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsSingleModalOpen(true)}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                    >
                        <Plus size={14} />
                        New payment
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatTile
                    label="Total Volume"
                    value={usd(stats.totalVolume)}
                    subtext={`${transfers.length} total transfers`}
                    icon={ArrowUpRight}
                />
                <StatTile
                    label="Paid"
                    value={String(stats.paidCount)}
                    subtext="Settled to recipient"
                    icon={CheckCircle2}
                />
                <StatTile
                    label="Clearing"
                    value={String(stats.clearingCount)}
                    subtext="In banking pass-through"
                    icon={Clock}
                />
                <StatTile
                    label="Awaiting Approval"
                    value={String(stats.pendingCount)}
                    subtext="Requires checker"
                    icon={Layers}
                    dark={stats.pendingCount > 0}
                />
            </div>

            {/* Main Table / List Section */}
            <section className="rounded-3xl border border-[#E5E5E5] bg-white overflow-hidden">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E5E5]">
                    <div className="relative w-full md:w-64">
                        <Search
                            size={14}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search payee, ref, country..."
                            aria-label="Search transactions"
                            className="h-9 w-full rounded-full border border-[#E5E5E5] bg-white pl-9 pr-4 text-xs text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFilter(f.id)}
                                    className={`h-9 px-3.5 rounded-full text-xs font-semibold cursor-pointer ${
                                        filter === f.id
                                            ? "bg-black text-white"
                                            : "text-zinc-600 hover:text-black border border-[#E5E5E5]"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={exportCsv}
                            disabled={filteredTransfers.length === 0}
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-black bg-white text-black hover:bg-zinc-100 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Download size={14} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Mobile View: Clean Card List */}
                <div className="block md:hidden divide-y divide-[#E5E5E5]">
                    {filteredTransfers.length === 0 ? (
                        <div className="py-12 text-center text-zinc-400 font-mono text-xs">
                            No transactions found.
                        </div>
                    ) : (
                        filteredTransfers.map((tx) => {
                            const initials = tx.beneficiaryName
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <div
                                    key={tx.id}
                                    onClick={() => setSelected(tx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelected(tx);
                                        }
                                    }}
                                    className="p-4 hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-left space-y-2"
                                >
                                    {/* Payee & Amount */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-[#E5E5E5] flex items-center justify-center font-mono font-bold text-xs text-black shrink-0">
                                                {tx.type === "batch" ? (
                                                    <FileSpreadsheet size={14} />
                                                ) : (
                                                    initials || "BN"
                                                )}
                                            </div>
                                            <p className="font-bold text-sm text-black truncate">
                                                {tx.beneficiaryName}
                                            </p>
                                        </div>

                                        <span className="font-mono font-bold text-sm text-black shrink-0">
                                            {usd(tx.amountUsd)}
                                        </span>
                                    </div>

                                    {/* Reference, Timestamp, Status & Chevron */}
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="font-mono font-bold text-black text-xs">
                                                {tx.reference}
                                            </span>
                                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-zinc-50 text-zinc-600 shrink-0">
                                                {tx.type === "batch" ? `Batch (${tx.recipientCount})` : "Single"}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 font-mono">
                                                • {tx.timestamp}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    tx.status === "completed"
                                                        ? "bg-black text-white"
                                                        : tx.status === "clearing"
                                                        ? "border border-black bg-white text-black"
                                                        : "border border-zinc-300 bg-zinc-100 text-zinc-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        tx.status === "completed" ? "bg-white" : "bg-black"
                                                    }`}
                                                />
                                                {STATUS_LABEL[tx.status]}
                                            </span>
                                            <ChevronRight size={14} className="text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Desktop View: Full Width Table Without Scrollbar */}
                <div className="hidden md:block w-full">
                    <table className="w-full text-left text-xs table-fixed">
                        <colgroup>
                            <col className="w-[30%]" />
                            <col className="w-[24%]" />
                            <col className="w-[18%]" />
                            <col className="w-[14%]" />
                            <col className="w-[10%]" />
                            <col className="w-[4%]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-[#E5E5E5] bg-zinc-50/80 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                                <th className="py-3.5 px-3 lg:px-4 xl:px-6">Beneficiary</th>
                                <th className="py-3.5 px-3 lg:px-4 xl:px-6">Reference</th>
                                <th className="py-3.5 px-3 lg:px-4 xl:px-6">Timestamp</th>
                                <th className="py-3.5 px-3 lg:px-4 xl:px-6 text-right">Amount</th>
                                <th className="py-3.5 px-2 lg:px-3 text-center">Status</th>
                                <th className="py-3.5 px-2 lg:px-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] font-tabular-nums">
                            {filteredTransfers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center text-zinc-400 font-mono text-xs">
                                        No transactions match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransfers.map((tx) => {
                                    const initials = tx.beneficiaryName
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase();

                                    return (
                                        <tr
                                            key={tx.id}
                                            onClick={() => setSelected(tx)}
                                            className="group hover:bg-zinc-50/80 transition-colors cursor-pointer"
                                        >
                                            <td className="py-4 px-3 lg:px-4 xl:px-6">
                                                <div className="flex items-center gap-2.5 lg:gap-3 min-w-0">
                                                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-zinc-100 border border-[#E5E5E5] flex items-center justify-center font-mono font-bold text-xs text-black shrink-0 group-hover:border-black transition-colors">
                                                        {tx.type === "batch" ? (
                                                            <FileSpreadsheet size={15} />
                                                        ) : (
                                                            initials || "BN"
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-xs lg:text-sm text-black truncate group-hover:underline">
                                                        {tx.beneficiaryName}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-3 lg:px-4 xl:px-6">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="font-mono font-bold text-black text-xs truncate">
                                                        {tx.reference}
                                                    </span>
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-white text-zinc-600 shrink-0">
                                                        {tx.type === "batch" ? `Batch (${tx.recipientCount})` : "Single"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-3 lg:px-4 xl:px-6 text-zinc-500 font-mono text-[11px] lg:text-xs">
                                                <span className="truncate block">{tx.timestamp}</span>
                                            </td>

                                            <td className="py-4 px-3 lg:px-4 xl:px-6 text-right">
                                                <span className="font-mono font-bold text-xs lg:text-sm text-black truncate block">
                                                    {usd(tx.amountUsd)}
                                                </span>
                                            </td>

                                            <td className="py-4 px-2 lg:px-3 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 lg:px-3 lg:py-1 text-[11px] lg:text-xs font-semibold whitespace-nowrap ${
                                                        tx.status === "completed"
                                                            ? "bg-black text-white"
                                                            : tx.status === "clearing"
                                                            ? "border border-black bg-white text-black"
                                                            : "border border-zinc-300 bg-zinc-100 text-zinc-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            tx.status === "completed" ? "bg-white" : "bg-black"
                                                        }`}
                                                    />
                                                    <span>{STATUS_LABEL[tx.status]}</span>
                                                </span>
                                            </td>

                                            <td className="py-4 px-2 lg:px-4 text-right">
                                                <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-zinc-100 transition-colors ml-auto">
                                                    <ChevronRight size={15} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <NewSingleTransferModal
                isOpen={isSingleModalOpen}
                onClose={() => setIsSingleModalOpen(false)}
            />
            <LivePassThroughTrackerModal
                transfer={selected}
                onClose={() => setSelected(null)}
                onApprove={approveTransfer}
            />
        </div>
    );
}

