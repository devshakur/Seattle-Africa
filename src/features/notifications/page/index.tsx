"use client";

import { useState, useMemo } from "react";
import {
    Bell,
    CheckCheck,
    Search,
    ShieldAlert,
    Ticket,
    ArrowRightLeft,
    Info,
    ChevronRight,
    Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import { INITIAL_NOTIFICATIONS, NotificationCategory, NotificationItem } from "../data";
import { NotificationDetailsPanel } from "../components/NotificationDetailsPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TABS: { id: NotificationCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "transfers", label: "Transfers" },
    { id: "security", label: "Security" },
    { id: "vouchers", label: "Vouchers" },
    { id: "system", label: "System" },
];

export function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
    const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
    const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Filter by tab & search
    const filtered = useMemo(() => {
        return notifications.filter((n) => {
            const matchesTab = activeTab === "all" ? true : n.category === activeTab;
            const matchesSearch =
                searchQuery.trim() === "" ||
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [notifications, activeTab, searchQuery]);

    const handleSelectNotification = (item: NotificationItem) => {
        // Mark as read when opened
        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        setSelectedNotification({ ...item, read: true });
    };

    const handleToggleRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
        setSelectedNotification((prev) =>
            prev && prev.id === id ? { ...prev, read: !prev.read } : prev
        );
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read.");
    };

    return (
        <div className="animate-in fade-in duration-300 relative min-h-screen pb-16">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-950 tracking-tight">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Review account alerts, transfer clearing updates, and security logs.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleMarkAllRead}
                        className="h-10 px-4 rounded-xl border-gray-200 text-xs font-semibold text-gray-800 hover:bg-gray-50 flex items-center gap-2 self-start sm:self-auto"
                    >
                        <CheckCheck size={15} />
                        <span>Mark all as read</span>
                    </Button>
                )}
            </div>

            {/* Filter Tabs & Search Bar */}
            <Card className="p-4 mb-6 border border-gray-200/90 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => {
                        const count =
                            tab.id === "all"
                                ? notifications.length
                                : notifications.filter((n) => n.category === tab.id).length;

                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] font-mono ${
                                        isActive ? "text-gray-300" : "text-gray-400"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64 shrink-0">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search alerts..."
                        className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>
            </Card>

            {/* Notifications List */}
            <Card className="border border-gray-200/90 shadow-xs overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                            <Bell size={22} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">No notifications found</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {searchQuery
                                ? "No items matched your search query."
                                : "You're all caught up in this category."}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100" role="list">
                        {filtered.map((item) => {
                            const isUnread = !item.read;

                            return (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectNotification(item)}
                                    className={`group flex items-start gap-4 p-4 sm:p-5 transition-colors cursor-pointer ${
                                        isUnread ? "bg-white hover:bg-gray-50" : "bg-gray-50/40 hover:bg-gray-50/80 opacity-85"
                                    }`}
                                >
                                    {/* Icon Badge */}
                                    <div
                                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${
                                            item.category === "security"
                                                ? "border-red-200 bg-red-50 text-red-600"
                                                : item.category === "vouchers"
                                                  ? "border-zinc-900 bg-black text-white"
                                                  : item.category === "system"
                                                    ? "border-blue-200 bg-blue-50 text-blue-600"
                                                    : "border-gray-200 bg-white text-gray-900"
                                        }`}
                                    >
                                        {item.category === "security" && <ShieldAlert size={18} />}
                                        {item.category === "vouchers" && <Ticket size={18} />}
                                        {item.category === "transfers" && <ArrowRightLeft size={18} />}
                                        {item.category === "system" && <Info size={18} />}
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <h3
                                                    className={`text-sm tracking-tight truncate ${
                                                        isUnread ? "font-bold text-gray-950" : "font-semibold text-gray-800"
                                                    }`}
                                                >
                                                    {item.title}
                                                </h3>
                                                {isUnread && (
                                                    <span className="h-2 w-2 rounded-full bg-black shrink-0" />
                                                )}
                                            </div>

                                            <span className="text-[11px] font-mono text-gray-400 shrink-0">
                                                {item.timestamp}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Optional badges / metadata preview */}
                                        <div className="mt-2.5 flex items-center gap-3 text-[11px] text-gray-400">
                                            <span className="capitalize font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                {item.category}
                                            </span>
                                            {item.amount && (
                                                <span className="font-mono font-bold text-gray-900">
                                                    {item.amount}
                                                </span>
                                            )}
                                            <span className="ml-auto text-black font-semibold flex items-center gap-1 group-hover:underline">
                                                View details <ChevronRight size={13} />
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Card>

            {/* Slide-over Notification Details Panel */}
            <NotificationDetailsPanel
                notification={selectedNotification}
                onClose={() => setSelectedNotification(null)}
                onToggleRead={handleToggleRead}
            />
        </div>
    );
}

