"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Send,
    FileSpreadsheet,
    Check,
    X,
    Search,
    Download,
    Gauge,
    ArrowUpRight,
    Clock,
    Users,
    BookUser,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";
import {
    useBusiness,
    CorporateTransferItem,
    PassThroughStatus,
} from "@/features/business/context/BusinessContext";
import { NewSingleTransferModal } from "../components/NewSingleTransferModal";
import { LivePassThroughTrackerModal } from "../components/LivePassThroughTrackerModal";
import { useCorridorRates } from "../hooks/useCorridorRates";

type Filter = "all" | "single" | "batch";

const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "single", label: "Single" },
    { id: "batch", label: "Batch" },
];

const STATUS_LABEL: Record<PassThroughStatus, string> = {
    completed: "Paid",
    clearing: "Processing",
    source_debited: "Processing",
    pending_approval: "Awaiting approval",
};

/** Monthly transfer cap for the company's compliance tier. */
const MONTHLY_LIMIT_USD = 1_000_000;

const usd = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const usdWhole = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function IconBadge({ icon: Icon, dark = false }: { icon: LucideIcon; dark?: boolean }) {
    return (
        <span
            className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${dark ? "bg-black text-white border-black" : "bg-white text-black border-[#E5E5E5]"
                }`}
        >
            <Icon size={17} />
        </span>
    );
}

function StatCard({
    icon,
    label,
    value,
    dark,
    children,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    dark?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6">
            <IconBadge icon={icon} dark={dark} />
            <p className="mt-5 text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight font-tabular-nums">{value}</p>
            {children}
        </div>
    );
}

export function BusinessDashboardPage() {
    const { companyName, transfers, teamMembers, approveTransfer, rejectTransfer } =
        useBusiness();
    const corridorRates = useCorridorRates();

    const [filter, setFilter] = useState<Filter>("all");
    const [query, setQuery] = useState("");
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [selected, setSelected] = useState<CorporateTransferItem | null>(null);

    const pending = useMemo(
        () => transfers.filter((t) => t.status === "pending_approval"),
        [transfers]
    );

    const sentUsd = useMemo(
        () =>
            transfers
                .filter((t) => t.status !== "pending_approval")
                .reduce((sum, t) => sum + t.amountUsd, 0),
        [transfers]
    );

    const sentCount = transfers.length - pending.length;
    const pendingUsd = useMemo(() => pending.reduce((sum, t) => sum + t.amountUsd, 0), [pending]);
    const activeMembers = teamMembers.filter((m) => m.status === "Active").length;
    const limitPct = Math.min(100, (sentUsd / MONTHLY_LIMIT_USD) * 100);

    const payments = useMemo(() => {
        const q = query.trim().toLowerCase();
        return transfers.filter(
            (t) =>
                t.status !== "pending_approval" &&
                (filter === "all" || t.type === filter) &&
                (!q ||
                    t.beneficiaryName.toLowerCase().includes(q) ||
                    t.reference.toLowerCase().includes(q))
        );
    }, [transfers, filter, query]);

    const exportCsv = () => {
        const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
        const rows = [
            ["Reference", "Payee", "Date", "Amount (USD)", "Status"],
            ...payments.map((t) => [
                t.reference,
                t.beneficiaryName,
                t.timestamp,
                t.amountUsd.toFixed(2),
                STATUS_LABEL[t.status],
            ]),
        ];
        const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "payments.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const actionTileClass =
        "group flex items-center gap-4 rounded-3xl border border-[#E5E5E5] bg-white p-5 hover:border-black transition-colors text-left cursor-pointer";

    return (
        <div className="space-y-6 pb-16 text-black">
            {/* Hero */}
            <section className="rounded-3xl bg-black text-white px-8 py-8 sm:px-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h1 className="text-2xl font-bold tracking-tight">{companyName}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSingleModalOpen(true)}
                            className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                            <FileSpreadsheet size={16} />
                            Bulk Transfer
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSingleModalOpen(true)}
                            className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                            <Send size={16} />
                            New payment
                        </button>
                    </div>
                </div>

                {corridorRates.length > 0 && (
                    <div className="mt-8 pt-5 border-t border-zinc-800 flex flex-wrap items-center gap-x-8 gap-y-1 text-xs text-zinc-400 font-tabular-nums">
                        {corridorRates.map((r) => (
                            <span key={r.pair}>
                                {r.pair}{" "}
                                <span className="font-mono font-bold text-white">
                                    {r.rate.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </section>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard icon={Gauge} label="Monthly limit" value={usdWhole(MONTHLY_LIMIT_USD)}>
                    <div
                        className="mt-4 h-1.5 w-full rounded-full bg-[#E5E5E5] overflow-hidden"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(limitPct)}
                        aria-label="Monthly transfer limit used"
                    >
                        <div className="h-full bg-black" style={{ width: `${limitPct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 font-tabular-nums">
                        {limitPct.toFixed(0)}% used
                    </p>
                </StatCard>
                <StatCard icon={ArrowUpRight} label="Sent" value={usd(sentUsd)}>
                    <p className="mt-1 text-xs text-zinc-500 font-tabular-nums">
                        {sentCount} payments
                    </p>
                </StatCard>
                <StatCard icon={Clock} label="Pending" value={usd(pendingUsd)} dark={pending.length > 0}>
                    <p className="mt-1 text-xs text-zinc-500 font-tabular-nums">
                        {pending.length} to approve
                    </p>
                </StatCard>
                <StatCard icon={Users} label="Team" value={`${activeMembers} members`} />
            </div>

            {/* Approvals */}
            {pending.length > 0 && (
                <section className="rounded-3xl border border-black bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E5E5E5]">
                        <h2 className="text-base font-bold">Approvals ({pending.length})</h2>
                        <span className="text-sm font-mono font-bold font-tabular-nums">
                            {usd(pendingUsd)}
                        </span>
                    </div>
                    <ul className="divide-y divide-[#E5E5E5]">
                        {pending.map((tx) => (
                            <li
                                key={tx.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelected(tx)}
                                    className="min-w-0 text-left cursor-pointer"
                                >
                                    <p className="text-sm font-bold truncate hover:underline">
                                        {tx.beneficiaryName}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {tx.type === "batch"
                                            ? `${tx.recipientCount} recipients`
                                            : tx.corridorCountry}
                                    </p>
                                </button>
                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                    <span className="text-sm font-mono font-bold font-tabular-nums">
                                        {usd(tx.amountUsd)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => approveTransfer(tx.id)}
                                            className="inline-flex items-center gap-1 h-9 px-4 rounded-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                                        >
                                            <Check size={13} />
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => rejectTransfer(tx.id)}
                                            aria-label="Reject"
                                            className="w-9 h-9 rounded-full border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black cursor-pointer flex items-center justify-center"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Actions */}
            <section className="space-y-4 pt-2">
                <h2 className="text-lg font-bold">Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <button
                        type="button"
                        onClick={() => setIsSingleModalOpen(true)}
                        className={actionTileClass}
                    >
                        <IconBadge icon={Send} />
                        <span className="flex-1 text-sm font-bold">New payment</span>
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-black" />
                    </button>
                    <Link href="/business/payouts/batch" className={actionTileClass}>
                        <IconBadge icon={FileSpreadsheet} />
                        <span className="flex-1 text-sm font-bold">Bulk transfer</span>
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-black" />
                    </Link>
                    <Link href="/business/beneficiaries" className={actionTileClass}>
                        <IconBadge icon={BookUser} />
                        <span className="flex-1 text-sm font-bold">Beneficiaries</span>
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-black" />
                    </Link>
                    <Link href="/business/settings/team" className={actionTileClass}>
                        <IconBadge icon={Users} />
                        <span className="flex-1 text-sm font-bold">Team</span>
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-black" />
                    </Link>
                </div>
            </section>

            {/* Payments */}
            <section className="rounded-3xl border border-[#E5E5E5] bg-white overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold">Payments</h2>
                        <Link
                            href="/business/transactions"
                            className="text-xs text-zinc-500 hover:text-black font-semibold flex items-center gap-0.5 transition-colors"
                        >
                            <span>View all</span>
                            <ChevronRight size={13} />
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-56">
                            <Search
                                size={14}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search payee or reference"
                                aria-label="Search payments"
                                className="h-9 w-full rounded-full border border-[#E5E5E5] bg-white pl-9 pr-4 text-xs text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFilter(f.id)}
                                    className={`h-9 px-3.5 sm:px-4 rounded-full text-xs font-semibold cursor-pointer ${filter === f.id
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
                            disabled={payments.length === 0}
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 sm:px-4 rounded-full border border-black bg-white text-black hover:bg-zinc-100 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Download size={14} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Mobile View: Responsive card list without horizontal scrollbar */}
                <div className="block md:hidden divide-y divide-[#E5E5E5]">
                    {payments.length === 0 ? (
                        <div className="py-14 text-center text-zinc-400 font-mono text-xs">
                            No payments match your search criteria.
                        </div>
                    ) : (
                        payments.map((tx) => {
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
                                    className="p-4 hover:bg-zinc-50/80 active:bg-zinc-100 transition-colors cursor-pointer text-left space-y-2"
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
                                                {tx.type === "batch"
                                                    ? `Batch (${tx.recipientCount})`
                                                    : "Single"}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 font-mono">
                                                • {tx.timestamp}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tx.status === "completed"
                                                    ? "bg-black text-white"
                                                    : tx.status === "clearing"
                                                        ? "border border-black bg-white text-black"
                                                        : "border border-zinc-300 bg-zinc-100 text-zinc-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${tx.status === "completed"
                                                        ? "bg-white"
                                                        : "bg-black"
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

                {/* Desktop & Tablet View: 100% width table without horizontal scrollbar */}
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
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center text-zinc-400 font-mono text-xs">
                                        No payments match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((tx) => {
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
                                            {/* Beneficiary */}
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

                                            {/* Reference & Rail */}
                                            <td className="py-4 px-3 lg:px-4 xl:px-6">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="font-mono font-bold text-black text-xs truncate">
                                                        {tx.reference}
                                                    </span>
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-white text-zinc-600 shrink-0">
                                                        {tx.type === "batch"
                                                            ? `Batch (${tx.recipientCount})`
                                                            : "Single"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date / Timestamp */}
                                            <td className="py-4 px-3 lg:px-4 xl:px-6 text-zinc-500 font-mono text-[11px] lg:text-xs">
                                                <span className="truncate block">{tx.timestamp}</span>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-4 px-3 lg:px-4 xl:px-6 text-right">
                                                <span className="font-mono font-bold text-xs lg:text-sm text-black truncate block">
                                                    {usd(tx.amountUsd)}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-2 lg:px-3 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 lg:px-3 lg:py-1 text-[11px] lg:text-xs font-semibold whitespace-nowrap ${tx.status === "completed"
                                                        ? "bg-black text-white"
                                                        : tx.status === "clearing"
                                                            ? "border border-black bg-white text-black"
                                                            : "border border-zinc-300 bg-zinc-100 text-zinc-700"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${tx.status === "completed"
                                                            ? "bg-white"
                                                            : "bg-black"
                                                            }`}
                                                    />
                                                    <span>{STATUS_LABEL[tx.status]}</span>
                                                </span>
                                            </td>

                                            {/* Action Chevron */}
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
