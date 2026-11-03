"use client";

import Link from "next/link";
import {
    X,
    Bell,
    ShieldAlert,
    Ticket,
    ArrowRightLeft,
    Check,
    Copy,
    Calendar,
    ExternalLink,
    MapPin,
    Laptop,
    Zap,
    MailCheck,
    Info,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { NotificationItem } from "../data";
import { Button } from "@/components/ui/Button";

interface Props {
    notification: NotificationItem | null;
    onClose: () => void;
    onToggleRead: (id: string) => void;
}

export function NotificationDetailsPanel({ notification, onClose, onToggleRead }: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!notification) return null;

    const copyText = (text: string, label: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedField(label);
            toast.success(`${label} copied to clipboard!`);
            setTimeout(() => setCopiedField(null), 1800);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide-over Card / Panel */}
            <div className="fixed top-3 bottom-3 right-3 w-[calc(100%-1.5rem)] sm:w-[460px] bg-white z-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                                notification.category === "security"
                                    ? "border-red-200 bg-red-50 text-red-600"
                                    : notification.category === "vouchers"
                                      ? "border-zinc-900 bg-black text-white"
                                      : notification.category === "system"
                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                        : "border-gray-200 bg-gray-50 text-gray-900"
                            }`}
                        >
                            {notification.category === "security" && <ShieldAlert size={16} />}
                            {notification.category === "vouchers" && <Ticket size={16} />}
                            {notification.category === "transfers" && <ArrowRightLeft size={16} />}
                            {notification.category === "system" && <Info size={16} />}
                        </div>
                        <div>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
                                {notification.category}
                            </span>
                            <h2 className="text-sm font-bold text-gray-950 truncate max-w-[280px]">
                                Notification Detail
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close notification"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Title & Status */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    notification.read
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-black text-white"
                                }`}
                            >
                                {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                                {notification.read ? "Read" : "Unread"}
                            </span>

                            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                <Calendar size={12} />
                                {notification.date}
                            </span>
                        </div>

                        <h1 className="text-lg font-bold text-gray-950 tracking-tight leading-snug">
                            {notification.title}
                        </h1>
                    </div>

                    {/* Main Description */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-sm text-gray-700 leading-relaxed">
                        {notification.description}
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Activity Details
                        </h3>

                        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 text-xs">
                            {notification.reference && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Reference ID</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono font-bold text-gray-900">
                                            {notification.reference}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copyText(notification.reference!, "Reference")}
                                            className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded"
                                            title="Copy Reference"
                                        >
                                            {copiedField === "Reference" ? <Check size={12} /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {notification.amount && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Transaction Amount</span>
                                    <span className="font-mono font-bold text-sm text-emerald-600">
                                        {notification.amount}
                                    </span>
                                </div>
                            )}

                            {notification.channel && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Clearing Channel</span>
                                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                                        <Zap size={13} className="text-black" />
                                        {notification.channel}
                                    </span>
                                </div>
                            )}

                            {notification.location && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-medium text-gray-800 flex items-center gap-1">
                                        <MapPin size={12} className="text-gray-400" />
                                        {notification.location}
                                    </span>
                                </div>
                            )}

                            {notification.device && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Device</span>
                                    <span className="font-medium text-gray-800 flex items-center gap-1">
                                        <Laptop size={12} className="text-gray-400" />
                                        {notification.device}
                                    </span>
                                </div>
                            )}

                            {notification.voucherCode && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Voucher Code</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono font-bold text-black bg-zinc-100 px-2 py-0.5 rounded">
                                            {notification.voucherCode}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copyText(notification.voucherCode!, "Voucher")}
                                            className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded"
                                            title="Copy Voucher"
                                        >
                                            {copiedField === "Voucher" ? <Check size={12} /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex gap-2.5">
                    {notification.actionHref && (
                        <Link href={notification.actionHref} className="flex-1">
                            <Button
                                type="button"
                                className="w-full h-10 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2"
                            >
                                <span>{notification.actionLabel || "View"}</span>
                                <ExternalLink size={13} />
                            </Button>
                        </Link>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onToggleRead(notification.id)}
                        className="h-10 px-4 rounded-xl border-gray-200 text-xs font-semibold text-gray-800 hover:bg-white flex items-center justify-center gap-1.5 shrink-0"
                    >
                        <MailCheck size={14} />
                        <span>{notification.read ? "Mark Unread" : "Mark Read"}</span>
                    </Button>
                </div>
            </div>
        </>
    );
}

