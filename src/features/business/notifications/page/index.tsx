"use client";

import { useState, useMemo } from "react";
import {
    Search,
    CheckCheck,
    Clock,
    ArrowRightLeft,
    ShieldCheck,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";
import {
    useBusiness,
    CorporateNotificationCategory,
    CorporateNotificationItem,
} from "@/features/business/context/BusinessContext";
import { CorporateNotificationDetailsPanel } from "../components/CorporateNotificationDetailsPanel";

const TABS: { id: CorporateNotificationCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "approvals", label: "Approvals" },
    { id: "transfers", label: "Transfers" },
    { id: "security", label: "Security" },
];

const CATEGORY_ICON: Record<"approvals" | "transfers" | "security", LucideIcon> = {
    approvals: Clock,
    transfers: ArrowRightLeft,
    security: ShieldCheck,
};

export function BusinessNotificationsPage() {
    const {
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    } = useBusiness();

    const [activeTab, setActiveTab] = useState<CorporateNotificationCategory>("all");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<CorporateNotificationItem | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return notifications.filter((n) => {
            const matchesTab = activeTab === "all" ? true : n.category === activeTab;
            const matchesQuery =
                !q ||
                n.title.toLowerCase().includes(q) ||
                n.description.toLowerCase().includes(q) ||
                (n.reference && n.reference.toLowerCase().includes(q)) ||
                (n.beneficiaryName && n.beneficiaryName.toLowerCase().includes(q));

            return matchesTab && matchesQuery;
        });
    }, [notifications, activeTab, query]);

    const handleSelect = (item: CorporateNotificationItem) => {
        markNotificationAsRead(item.id);
        setSelected({ ...item, read: true });
    };

    const handleToggleRead = (id: string) => {
        markNotificationAsRead(id);
        if (selected && selected.id === id) {
            setSelected({ ...selected, read: !selected.read });
        }
    };

    return (
        <div className="space-y-6 pb-16 text-black">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                        {unreadNotificationsCount > 0 && (
                            <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                                {unreadNotificationsCount} new
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Approval requests and treasury status alerts.</p>
                </div>

                {unreadNotificationsCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#E5E5E5] bg-white hover:bg-zinc-100 text-xs font-semibold cursor-pointer text-black self-start sm:self-auto"
                    >
                        <CheckCheck size={14} />
                        <span>Mark all read</span>
                    </button>
                )}
            </div>

            {/* Filter & Search Bar */}
            <section className="rounded-3xl border border-[#E5E5E5] bg-white overflow-hidden">
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
                            placeholder="Filter alerts..."
                            aria-label="Filter notifications"
                            className="h-9 w-full rounded-full border border-[#E5E5E5] bg-white pl-9 pr-4 text-xs text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`h-9 px-4 rounded-full text-xs font-semibold cursor-pointer ${
                                    activeTab === tab.id
                                        ? "bg-black text-white"
                                        : "text-zinc-600 hover:text-black border border-[#E5E5E5]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-[#E5E5E5]">
                    {filtered.length === 0 ? (
                        <div className="py-14 text-center text-zinc-400 font-mono text-xs">
                            No notifications match your filter.
                        </div>
                    ) : (
                        filtered.map((item) => {
                            const Icon = CATEGORY_ICON[item.category] || Clock;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleSelect(item);
                                        }
                                    }}
                                    className={`group flex items-start sm:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4.5 cursor-pointer transition-colors ${
                                        item.read ? "bg-white hover:bg-zinc-50/70" : "bg-zinc-50/60 hover:bg-zinc-100/60"
                                    }`}
                                >
                                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                        <div
                                            className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                !item.read
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-zinc-700 border-[#E5E5E5] group-hover:border-black"
                                            }`}
                                        >
                                            <Icon size={16} />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p
                                                    className={`text-sm truncate ${
                                                        !item.read
                                                            ? "font-bold text-black"
                                                            : "font-semibold text-zinc-800"
                                                    }`}
                                                >
                                                    {item.title}
                                                </p>
                                                {!item.read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                                )}
                                                {item.amountUsd !== undefined && (
                                                    <span className="font-mono text-xs font-bold text-black px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-white">
                                                        ${item.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 line-clamp-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 self-center">
                                        <span className="text-[11px] font-mono text-zinc-400">
                                            {item.timestamp}
                                        </span>
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-zinc-200 transition-colors">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <CorporateNotificationDetailsPanel
                notification={selected}
                onClose={() => setSelected(null)}
                onToggleRead={handleToggleRead}
            />
        </div>
    );
}

