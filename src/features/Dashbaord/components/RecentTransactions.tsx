"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
        type: "Sent to Amina Yusuf",
        category: "Outgoing Transfer",
        rawAmountNgn: -456000,
        status: "Pending",
        date: "Sep 21, 2025 • 16:20",
        recipient: "Amina Yusuf",
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
                    <label htmlFor="transaction-page-size">
                        Show
                    </label>
                    <select
                        id="transaction-page-size"
                        value={pageSize}
                        onChange={(event) => {
                            setPageSize(Number(event.target.value));
                            setCurrentPage(1);
                        }}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-black"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    <span>per page</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
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
                                        className="group transition-colors hover:bg-slate-50/60"
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
        </Card>
    );
}
