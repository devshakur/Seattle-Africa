"use client";

import { useState, useRef, useEffect } from "react";
import {
    Bell,
    ShieldAlert,
    Ticket,
    ArrowRightLeft,
    Check,
    Copy,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/features/currency/CurrencyContext";

export type NotificationCategory = "all" | "transfers" | "security" | "vouchers";

export interface NotificationItem {
    id: string;
    category: "transfers" | "security" | "vouchers";
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    voucherCode?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function NotificationDropdown() {
    const { formatAmount } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [readMap, setReadMap] = useState<Record<string, boolean>>({
        "notif-4": true,
    });
    const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const notifications: NotificationItem[] = [
        {
            id: "notif-1",
            category: "transfers",
            title: "Transfer Delivered • Chioma Adeleke",
            description: `Your cross-border transfer of ${formatAmount(1824480)} has been successfully delivered to GTBank.`,
            timestamp: "2 mins ago",
            read: !!readMap["notif-1"],
            actionLabel: "View receipt",
            actionHref: "/transactions",
        },
        {
            id: "notif-2",
            category: "security",
            title: "Security: New Device Sign-in",
            description:
                "Authorized sign-in from Chrome on macOS in Lagos, Nigeria. If this was not you, lock your account.",
            timestamp: "45 mins ago",
            read: !!readMap["notif-2"],
            actionLabel: "Review activity",
            actionHref: "/settings",
        },
        {
            id: "notif-3",
            category: "vouchers",
            title: "Promo: Zero-Fee Transfer Voucher",
            description: `You received 100% off FX settlement fees for your next transfer up to ${formatAmount(7600000)}.`,
            timestamp: "Expires in 48h",
            read: !!readMap["notif-3"],
            voucherCode: "SETTLEFREE",
            actionLabel: "Apply voucher",
            actionHref: "/send-money",
        },
        {
            id: "notif-4",
            category: "transfers",
            title: "Incoming Treasury Liquidity Clearing",
            description:
                "Pan-African settlement transaction #TRX-9982 is clearing through interbank correspondent network.",
            timestamp: "3 hours ago",
            read: readMap["notif-4"] !== false,
            actionLabel: "Track transfer",
            actionHref: "/track-transaction",
        },
    ];

    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Filter notifications based on tab
    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        return n.category === activeTab;
    });

    // Mark all as read
    const markAllAsRead = () => {
        setReadMap({
            "notif-1": true,
            "notif-2": true,
            "notif-3": true,
            "notif-4": true,
        });
    };

    // Mark single as read
    const markAsRead = (id: string) => {
        setReadMap((prev) => ({ ...prev, [id]: true }));
    };

    // Copy voucher code
    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 1800);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={isOpen}
                className="relative p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-mono font-bold text-white border-2 border-white shadow-xs">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-[340px] sm:w-[410px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50 text-left"
                    >
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-950">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-mono font-bold text-black">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close notifications"
                                    className="p-1 text-gray-400 hover:text-black transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-b border-gray-100">
                            {(
                                [
                                    { id: "all", label: "All" },
                                    { id: "transfers", label: "Transfers" },
                                    { id: "security", label: "Security" },
                                    { id: "vouchers", label: "Vouchers" },
                                ] as const
                            ).map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors shrink-0 ${
                                            isActive
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-600 hover:text-black"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100 -mx-1 px-1 mt-1">
                            {filteredNotifications.length === 0 ? (
                                <div className="py-8 text-center text-xs text-gray-400">
                                    No notifications in this category.
                                </div>
                            ) : (
                                filteredNotifications.map((n) => {
                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            className={`group relative flex items-start gap-3 py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                                                n.read
                                                    ? "hover:bg-gray-50/60 opacity-80"
                                                    : "bg-gray-50/70 hover:bg-gray-100/60"
                                            }`}
                                        >
                                            {/* Category Icon Badge */}
                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                                    n.category === "security"
                                                        ? "border-zinc-300 bg-zinc-100 text-black"
                                                        : n.category === "vouchers"
                                                        ? "border-zinc-900 bg-black text-white"
                                                        : "border-gray-200 bg-white text-gray-800"
                                                }`}
                                            >
                                                {n.category === "security" && (
                                                    <ShieldAlert size={15} />
                                                )}
                                                {n.category === "vouchers" && (
                                                    <Ticket size={15} />
                                                )}
                                                {n.category === "transfers" && (
                                                    <ArrowRightLeft size={15} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="text-xs font-bold text-gray-950 truncate">
                                                        {n.title}
                                                    </h4>
                                                    {!n.read && (
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                                                    )}
                                                </div>

                                                <p className="mt-0.5 text-xs text-gray-600 leading-snug">
                                                    {n.description}
                                                </p>

                                                {/* Optional Voucher Code Copy Box */}
                                                {n.voucherCode && (
                                                    <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs">
                                                        <span className="font-mono font-bold text-gray-900">
                                                            {n.voucherCode}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopy(n.voucherCode!);
                                                            }}
                                                            className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-black"
                                                        >
                                                            {copiedCode === n.voucherCode ? (
                                                                <>
                                                                    <Check size={12} className="text-black" />
                                                                    <span>Copied</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy size={12} />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                                                    <span>{n.timestamp}</span>
                                                    {n.actionLabel && (
                                                        <span className="font-medium text-black group-hover:underline">
                                                            {n.actionLabel} &rarr;
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span className="text-[11px]">Settle Africa Security & Telemetry</span>
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="font-medium text-black hover:underline"
                            >
                                All caught up
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
