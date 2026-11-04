"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
    ArrowRight,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    Share2,
    X,
    Receipt,
    Calendar,
    User,
    Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useCurrency } from "@/features/currency/CurrencyContext";

const transactions = [
    {
        id: "TRX-8921",
        type: "Received from John Smith",
        category: "Incoming Transfer",
        rawAmountNgn: 760000,
        status: "Completed",
        date: "Sep 24, 2025 • 14:32",
        recipient: "John Smith",
        icon: ArrowDownLeft,
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
        id: "TRX-8920",
        type: "Sent to Business Partner",
        category: "Outgoing Transfer",
        rawAmountNgn: -152000,
        status: "Completed",
        date: "Sep 23, 2025 • 11:17",
        recipient: "Acme Corp",
        icon: ArrowUpRight,
        iconBg: "bg-slate-100 text-slate-700 border-slate-200",
    },
    {
        id: "TRX-8919",
        type: "Card Purchase",
        category: "Platform Fee",
        rawAmountNgn: -3040,
        status: "Completed",
        date: "Sep 22, 2025 • 19:45",
        recipient: "Stripe",
        icon: CreditCard,
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        id: "TRX-8918",
        type: "Sent to Abdulshakur Dauda",
        category: "Outgoing Transfer",
        rawAmountNgn: -456000,
        status: "Pending",
        date: "Sep 21, 2025 • 16:20",
        recipient: "Abdulshakur Dauda",
        icon: ArrowUpRight,
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
];

type Transaction = (typeof transactions)[number];

type SortKey = "type" | "recipient" | "amount" | "status" | "date";

type SortDirection = "asc" | "desc";

function parseTransactionDate(date: string) {
    const [datePart, timePart] = date.split(" • ");
    return new Date(`${datePart} ${timePart}`).getTime();
}

export function RecentTransactions() {
    const { formatAmount } = useCurrency();
    const [search, setSearch] = useState("");
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDirection, setSortDirection] =
        useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 850);
    };

    const handleDownloadReceipt = (tx: Transaction) => {
        try {
            const receiptText = `================================================
SETTLE AFRICA — OFFICIAL TRANSACTION RECEIPT
================================================
Transaction Reference : ${tx.id}
Date & Time           : ${tx.date}
Status                : ${tx.status.toUpperCase()}
Transaction Type      : ${tx.type}
Recipient / Source    : ${tx.recipient}
Category              : ${tx.category}
Amount Settled        : ${formatAmount(tx.rawAmountNgn, { showSign: true })}

Clearing Rail         : PAPSS Direct Interbank Rail
================================================
Direct Pan-African Clearing • Settle Africa
================================================`;

            const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SettleAfrica-Receipt-${tx.id}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(`Receipt for ${tx.id} downloaded successfully!`);
        } catch {
            toast.error("Failed to download receipt.");
        }
    };

    const handleForwardReceipt = (tx: Transaction) => {
        try {
            const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track-transaction?ref=${tx.id}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl);
                toast.success(`Receipt link for ${tx.id} copied to clipboard! You can now forward it.`);
            }
        } catch {
            toast.error("Failed to copy receipt link.");
        }
    };

    const filteredTransactions = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = transactions.filter((tx) =>
            [
                tx.id,
                tx.type,
                tx.category,
                tx.recipient,
                formatAmount(tx.rawAmountNgn, { showSign: true }),
                tx.status,
                tx.date,
            ].some((value) => value.toLowerCase().includes(query)),
        );

        return [...filtered].sort((a, b) => {
            let comparison = 0;

            if (sortKey === "amount") {
                comparison =
                    Math.abs(a.rawAmountNgn) -
                    Math.abs(b.rawAmountNgn);
            } else if (sortKey === "date") {
                comparison =
                    parseTransactionDate(a.date) -
                    parseTransactionDate(b.date);
            } else {
                comparison = a[sortKey].localeCompare(b[sortKey]);
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [search, sortKey, sortDirection, formatAmount]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredTransactions.length / pageSize),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedTransactions = filteredTransactions.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
    );

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDirection((direction) =>
                direction === "asc" ? "desc" : "asc",
            );
        } else {
            setSortKey(key);
            setSortDirection(key === "date" ? "desc" : "asc");
        }

        setCurrentPage(1);
    }

    function renderSortHeader(label: string, key: SortKey) {
        const isActive = sortKey === key;

        return (
            <button
                type="button"
                onClick={() => handleSort(key)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-slate-700 ${
                    isActive ? "text-slate-900 font-bold" : "text-slate-400"
                }`}
                aria-label={`Sort by ${label}`}
            >
                <span>{label}</span>
                <ArrowUpDown
                    size={12}
                    className={isActive ? "text-black" : "text-slate-400"}
                />
            </button>
        );
    }

    const startItem =
        filteredTransactions.length === 0
            ? 0
            : (safePage - 1) * pageSize + 1;

    const endItem = Math.min(
        safePage * pageSize,
        filteredTransactions.length,
    );

    return (
        <Card className="mb-6 overflow-hidden border-slate-200/80 shadow-xs">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900">
                        Recent Transactions
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Your latest account activities and settlements
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        title="Refresh transactions"
                        aria-label="Refresh transactions"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-black hover:border-gray-400 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            size={13}
                            className={isLoading ? "animate-spin text-black" : "text-gray-500"}
                        />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <Link
                        href="/transactions"
                        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-black hover:text-white hover:border-black"
                    >
                        View all <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {/* Search and page size */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search transactions..."
                        aria-label="Search transactions"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-1 focus:ring-black"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Show</span>
                    <div className="w-20">
                        <Select
                            id="transaction-page-size"
                            value={String(pageSize)}
                            onChange={(v) => {
                                if (!v) return;
                                setPageSize(Number(v));
                                setCurrentPage(1);
                            }}
                            options={[
                                { value: "5", label: "5" },
                                { value: "10", label: "10" },
                                { value: "20", label: "20" },
                            ]}
                            triggerClassName="h-9 rounded-lg px-2.5 text-sm"
                        />
                    </div>
                    <span>per page</span>
                </div>
            </div>

            {/* Mobile list (cards) */}
            <ul className="divide-y divide-slate-100 md:hidden" aria-label="Transactions">
                {isLoading ? (
                    Array.from({ length: Math.min(pageSize, 5) }).map((_, idx) => (
                        <li key={idx} className="flex animate-pulse items-center gap-3 p-4" aria-hidden="true">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 rounded bg-zinc-200" />
                                <div className="h-3 w-1/2 rounded bg-zinc-100" />
                            </div>
                            <div className="h-4 w-16 rounded bg-zinc-200" />
                        </li>
                    ))
                ) : paginatedTransactions.length === 0 ? (
                    <li className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                        <Search size={22} className="text-slate-300" />
                        <p className="font-medium text-slate-700">No transactions found</p>
                        <p className="text-xs text-slate-400">Try another search term.</p>
                    </li>
                ) : (
                    paginatedTransactions.map((tx: Transaction) => {
                        const IconComponent = tx.icon;
                        const isPositive = tx.rawAmountNgn > 0;
                        return (
                            <li
                                key={tx.id}
                                onClick={() => setSelectedTx(tx)}
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tx.iconBg}`}
                                >
                                    <IconComponent size={17} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{tx.type}</p>
                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {tx.date}
                                    </p>
                                    <span
                                        className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                            tx.status === "Completed"
                                                ? "border-emerald-200/60 bg-emerald-50/80 text-emerald-700"
                                                : "border-amber-200/60 bg-amber-50/80 text-amber-700"
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                tx.status === "Completed" ? "bg-emerald-500" : "bg-amber-500"
                                            }`}
                                        />
                                        {tx.status}
                                    </span>
                                </div>
                                <span
                                    className={`shrink-0 text-sm font-bold font-mono tabular-nums ${
                                        isPositive ? "text-emerald-600" : "text-slate-900"
                                    }`}
                                >
                                    {formatAmount(tx.rawAmountNgn, { showSign: true })}
                                </span>
                            </li>
                        );
                    })
                )}
            </ul>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                        <tr>
                            <th
                                className="px-6 py-3"
                                aria-sort={sortKey === "type" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                            >
                                {renderSortHeader("Transaction", "type")}
                            </th>
                            <th
                                className="px-6 py-3"
                                aria-sort={sortKey === "recipient" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                            >
                                {renderSortHeader("Recipient / Source", "recipient")}
                            </th>
                            <th
                                className="px-6 py-3"
                                aria-sort={sortKey === "amount" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                            >
                                {renderSortHeader("Amount", "amount")}
                            </th>
                            <th
                                className="px-6 py-3"
                                aria-sort={sortKey === "status" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                            >
                                {renderSortHeader("Status", "status")}
                            </th>
                            <th
                                className="px-6 py-3"
                                aria-sort={sortKey === "date" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                            >
                                {renderSortHeader("Date", "date")}
                            </th>
                            <th className="px-6 py-3 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {isLoading ? (
                            /* Sleek, pulsing black/gray skeleton loaders replacing generic spinners */
                            Array.from({ length: pageSize }).map((_, idx) => (
                                <tr key={idx} className="animate-pulse" aria-hidden="true">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 shrink-0 rounded-xl bg-zinc-200" />
                                            <div className="space-y-1.5">
                                                <div className="h-4 w-36 rounded bg-zinc-200" />
                                                <div className="h-3 w-20 rounded bg-zinc-100" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-28 rounded bg-zinc-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-20 rounded bg-zinc-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 w-20 rounded-full bg-zinc-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-28 rounded bg-zinc-200" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="ml-auto h-7 w-7 rounded-lg bg-zinc-100" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            paginatedTransactions.map((tx: Transaction) => {
                                const IconComponent = tx.icon;
                                const isPositive = tx.rawAmountNgn > 0;
                                const formattedVal = formatAmount(tx.rawAmountNgn, { showSign: true });

                                return (
                                    <tr
                                        key={tx.id}
                                        onClick={() => setSelectedTx(tx)}
                                        className="group transition-colors hover:bg-slate-50/80 cursor-pointer"
                                    >
                                        {/* Transaction */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tx.iconBg}`}
                                                >
                                                    <IconComponent size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {tx.type}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-xs text-slate-400 font-tabular-nums tabular-nums">
                                                        {tx.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Recipient */}
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-700">
                                                {tx.recipient}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`font-bold tracking-tight font-mono font-tabular-nums tabular-nums ${
                                                    isPositive
                                                        ? "text-emerald-600"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {formattedVal}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                    tx.status === "Completed"
                                                        ? "border-emerald-200/60 bg-emerald-50/80 text-emerald-700"
                                                        : "border-amber-200/60 bg-amber-50/80 text-amber-700"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        tx.status === "Completed"
                                                            ? "bg-emerald-500"
                                                            : "animate-pulse bg-amber-500"
                                                    }`}
                                                />
                                                {tx.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500 font-mono font-tabular-nums tabular-nums">
                                            {tx.date}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                aria-label={`More actions for ${tx.id}`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}

                        {!isLoading && paginatedTransactions.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Search
                                            size={22}
                                            className="text-slate-300"
                                        />
                                        <p className="font-medium text-slate-700">
                                            No transactions found
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Try another search term.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-700 font-mono font-tabular-nums tabular-nums">
                        {startItem}–{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700 font-mono font-tabular-nums tabular-nums">
                        {filteredTransactions.length}
                    </span>{" "}
                    transactions
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={safePage <= 1}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </button>

                    <span className="min-w-16 text-center text-xs text-slate-500 font-mono font-tabular-nums tabular-nums">
                        Page {safePage} of {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(totalPages, page + 1),
                            )
                        }
                        disabled={safePage >= totalPages}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Transaction Details Slide-over Panel */}
            {selectedTx && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300"
                        onClick={() => setSelectedTx(null)}
                    />

                    <div className="fixed top-3 bottom-3 right-3 w-[calc(100%-1.5rem)] sm:w-[460px] bg-white z-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-base font-bold text-gray-950">Transaction Details</h2>
                                <p className="text-xs font-mono text-gray-500 mt-0.5">ID: {selectedTx.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedTx(null)}
                                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close details"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="text-center pb-5 border-b border-gray-100">
                                <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-1">
                                    Settled Amount
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mb-3 tracking-tight font-mono tabular-nums">
                                    {formatAmount(selectedTx.rawAmountNgn, { showSign: true })}
                                </h1>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        selectedTx.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            selectedTx.status === "Completed" ? "bg-emerald-600" : "bg-amber-500"
                                        }`}
                                    />
                                    {selectedTx.status}
                                </span>

                                {/* Action Buttons */}
                                <div className="mt-5 grid grid-cols-2 gap-2.5">
                                    <Button
                                        type="button"
                                        onClick={() => handleDownloadReceipt(selectedTx)}
                                        className="h-10 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                                    >
                                        <Download size={14} />
                                        <span>Download Receipt</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleForwardReceipt(selectedTx)}
                                        className="h-10 rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Share2 size={14} />
                                        <span>Forward Receipt</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                    <Receipt size={14} /> Summary Info
                                </h3>
                                <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-2.5 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Transaction Type</span>
                                        <span className="font-semibold text-gray-900">{selectedTx.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                        <span className="text-gray-500">Party / Beneficiary</span>
                                        <span className="font-semibold text-gray-900">{selectedTx.recipient}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                        <span className="text-gray-500">Category</span>
                                        <span className="font-medium text-gray-800">{selectedTx.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                        <span className="text-gray-500">Date & Timestamp</span>
                                        <span className="font-medium font-mono tabular-nums text-gray-900 flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-400" />
                                            {selectedTx.date}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                        <span className="text-gray-500">Settlement Clearing Rail</span>
                                        <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                                            <Zap size={13} /> PAPSS Instant Rail
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex gap-2.5">
                            <Button
                                type="button"
                                onClick={() => handleDownloadReceipt(selectedTx)}
                                className="h-10 flex-1 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2"
                            >
                                <Download size={14} />
                                <span>Download</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleForwardReceipt(selectedTx)}
                                className="h-10 flex-1 rounded-xl border-gray-200 text-gray-800 hover:bg-white text-xs font-semibold flex items-center justify-center gap-2"
                            >
                                <Share2 size={14} />
                                <span>Forward</span>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
}
