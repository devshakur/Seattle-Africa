"use client";

import Link from "next/link";
import {
    X,
    Check,
    Copy,
    Calendar,
    ArrowUpRight,
    Clock,
    ArrowRightLeft,
    ShieldCheck,
    CheckCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { CorporateNotificationItem } from "@/features/business/context/BusinessContext";

interface Props {
    notification: CorporateNotificationItem | null;
    onClose: () => void;
    onToggleRead: (id: string) => void;
}

export function CorporateNotificationDetailsPanel({
    notification,
    onClose,
    onToggleRead,
}: Props) {
    const [copied, setCopied] = useState(false);

    if (!notification) return null;

    const handleCopy = (text: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Reference copied!");
            setTimeout(() => setCopied(false), 1500);
        }
    };

    const CategoryIcon =
        notification.category === "approvals"
            ? Clock
            : notification.category === "security"
            ? ShieldCheck
            : ArrowRightLeft;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over */}
            <div className="fixed top-3 bottom-3 right-3 w-[calc(100%-1.5rem)] sm:w-[420px] bg-white z-50 rounded-3xl shadow-2xl border border-[#E5E5E5] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-zinc-100 border border-[#E5E5E5] flex items-center justify-center text-black">
                            <CategoryIcon size={15} />
                        </span>
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
                            {notification.category}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-[#E5E5E5] text-zinc-400 hover:text-black hover:border-black flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="Close"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2">
                            <Calendar size={13} />
                            <span>{notification.date}</span>
                        </div>
                        <h2 className="text-lg font-bold text-black tracking-tight">
                            {notification.title}
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                            {notification.description}
                        </p>
                    </div>

                    {/* Metadata Box */}
                    <div className="rounded-2xl border border-[#E5E5E5] bg-zinc-50/60 p-4 space-y-3 font-mono text-xs">
                        {notification.reference && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-[11px]">Reference</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(notification.reference!)}
                                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                                >
                                    <span>{notification.reference}</span>
                                    {copied ? <Check size={12} /> : <Copy size={12} className="text-zinc-400" />}
                                </button>
                            </div>
                        )}

                        {notification.amountUsd !== undefined && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-[11px]">Amount</span>
                                <span className="font-bold text-black">
                                    ${notification.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        {notification.amountLocal && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-[11px]">Local Currency</span>
                                <span className="text-zinc-600">{notification.amountLocal}</span>
                            </div>
                        )}

                        {notification.beneficiaryName && (
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-zinc-500 text-[11px] shrink-0">Beneficiary</span>
                                <span className="font-medium text-black text-right truncate">
                                    {notification.beneficiaryName}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60">
                            <span className="text-zinc-500 text-[11px]">Status</span>
                            <span className="text-[11px] font-semibold text-black">
                                {notification.read ? "Read" : "Unread"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[#E5E5E5] bg-white flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onToggleRead(notification.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full border border-[#E5E5E5] bg-white hover:bg-zinc-100 text-xs font-semibold cursor-pointer text-black"
                    >
                        <CheckCheck size={14} />
                        <span>{notification.read ? "Mark unread" : "Mark as read"}</span>
                    </button>

                    {notification.actionHref && (
                        <Link
                            href={notification.actionHref}
                            onClick={onClose}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full bg-black hover:bg-zinc-800 text-xs font-semibold text-white cursor-pointer"
                        >
                            <span>{notification.actionLabel || "View"}</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

