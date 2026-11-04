"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Check,
    Clock,
    Copy,
    Building2,
    ArrowUpRight,
    Download,
    FileSpreadsheet,
    User,
    Calendar,
    CreditCard,
    Globe2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { CorporateTransferItem, PassThroughStatus } from "@/features/business/context/BusinessContext";

interface LivePassThroughTrackerModalProps {
    transfer: CorporateTransferItem | null;
    onClose: () => void;
    onApprove: (id: string) => void;
}

const STATUS_CONFIG: Record<
    PassThroughStatus,
    { label: string; badgeClass: string; icon: typeof Check }
> = {
    completed: {
        label: "Settled & Disbursed",
        badgeClass: "bg-black text-white border-black",
        icon: Check,
    },
    clearing: {
        label: "Clearing Partner Rail",
        badgeClass: "bg-white text-black border-black",
        icon: Clock,
    },
    source_debited: {
        label: "Source Debited",
        badgeClass: "bg-white text-black border-black",
        icon: Clock,
    },
    pending_approval: {
        label: "Awaiting Checker Approval",
        badgeClass: "bg-zinc-100 text-black border-zinc-300",
        icon: Clock,
    },
};

const usd = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function LivePassThroughTrackerModal({
    transfer,
    onClose,
    onApprove,
}: LivePassThroughTrackerModalProps) {
    const [copied, setCopied] = useState(false);

    if (!transfer) return null;

    const statusInfo = STATUS_CONFIG[transfer.status] || STATUS_CONFIG.completed;
    const StatusIcon = statusInfo.icon;

    const handleCopyRef = () => {
        navigator.clipboard.writeText(transfer.reference);
        setCopied(true);
        toast.success(`Reference ${transfer.reference} copied to clipboard`);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadReceipt = () => {
        const text = `SETTLE AFRICA CORPORATE PAYMENT RECEIPT
========================================
Reference   : ${transfer.reference}
Date        : ${transfer.timestamp}
Status      : ${statusInfo.label}
Type        : ${transfer.type === "batch" ? "Batch Settlement" : "Single Transfer"}

PAYMENT SUMMARY
----------------------------------------
Amount USD  : ${usd(transfer.amountUsd)}
Amount Local: ${transfer.currencySymbol} ${transfer.amountLocal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
FX Rate     : 1 USD = ${transfer.fxRateToUsd} ${transfer.currencyCode}
Fee (USD)   : ${usd(transfer.feeUsd)}

BENEFICIARY
----------------------------------------
Name        : ${transfer.beneficiaryName}
Corridor    : ${transfer.corridorCountry} (${transfer.currencyCode})
Details     : ${transfer.beneficiarySubtext}

FUNDING SOURCE
----------------------------------------
Source      : ${transfer.fundingSourceName}
Rail        : ${transfer.fundingSourceRail}
Initiated By: ${transfer.initiatedBy}
========================================`;

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-${transfer.reference}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-over Drawer from Right */}
            <motion.aside
                key="drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Payment Details"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-[#E5E5E5] flex flex-col justify-between shadow-2xl text-black"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-black" />
                        <h2 className="text-sm font-bold tracking-tight">Payment Details</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content - Clean, Scanty & Essential */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Amount & Status Hero */}
                    <div className="rounded-2xl border border-[#E5E5E5] bg-zinc-50/60 p-5 text-center">
                        <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                            Settlement Amount
                        </p>
                        <p className="text-3xl font-bold font-mono tracking-tight font-tabular-nums text-black mt-1">
                            {usd(transfer.amountUsd)}
                        </p>
                        <p className="text-xs font-mono text-zinc-500 font-tabular-nums mt-0.5">
                            ≈ {transfer.currencySymbol}{" "}
                            {transfer.amountLocal.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{" "}
                            {transfer.currencyCode}
                        </p>

                        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border font-tabular-nums">
                            <StatusIcon size={13} />
                            <span>{statusInfo.label}</span>
                        </div>
                    </div>

                    {/* Reference pill with copy */}
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs">
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase font-mono text-zinc-400">Reference</p>
                            <p className="font-mono font-bold text-black truncate">{transfer.reference}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyRef}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-black cursor-pointer px-2 py-1 rounded hover:bg-zinc-100"
                        >
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                    </div>

                    {/* Scanty Key Details list */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Transaction Overview
                        </h3>

                        <div className="rounded-2xl border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5] text-xs">
                            <div className="flex items-start justify-between p-3.5 gap-4">
                                <span className="text-zinc-500 flex items-center gap-1.5 shrink-0">
                                    <User size={13} /> Payee
                                </span>
                                <div className="text-right min-w-0">
                                    <p className="font-bold text-black truncate">{transfer.beneficiaryName}</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                                        {transfer.beneficiarySubtext}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <Globe2 size={13} /> Destination Corridor
                                </span>
                                <span className="font-semibold text-black">
                                    {transfer.corridorFlag} {transfer.corridorCountry} ({transfer.currencyCode})
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <CreditCard size={13} /> Source Funding Mandate
                                </span>
                                <span className="font-semibold text-black text-right truncate max-w-[220px]">
                                    {transfer.fundingSourceName}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3.5 font-tabular-nums">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <ArrowUpRight size={13} /> Wholesale FX Rate
                                </span>
                                <span className="font-mono font-semibold text-black">
                                    1 USD = {transfer.fxRateToUsd.toFixed(2)} {transfer.currencyCode}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3.5 font-tabular-nums">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <Calendar size={13} /> Timestamp
                                </span>
                                <span className="text-zinc-600 font-mono">{transfer.timestamp}</span>
                            </div>

                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <Building2 size={13} /> Initiated By (Maker)
                                </span>
                                <span className="font-medium text-black">{transfer.initiatedBy}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[#E5E5E5] bg-zinc-50/60 flex items-center gap-2.5">
                    {transfer.status === "pending_approval" ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    onApprove(transfer.id);
                                    onClose();
                                }}
                                className="flex-1 h-11 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Check size={14} />
                                Approve Payment
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-11 px-5 rounded-full border border-[#E5E5E5] bg-white text-zinc-600 hover:text-black hover:border-black text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Dismiss
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleDownloadReceipt}
                                className="flex-1 h-11 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Download size={14} />
                                Download Receipt
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyRef}
                                className="h-11 px-5 rounded-full border border-[#E5E5E5] bg-white text-black hover:border-black text-xs font-semibold transition-colors cursor-pointer"
                            >
                                {copied ? "Copied" : "Copy Ref"}
                            </button>
                        </>
                    )}
                </div>
            </motion.aside>
        </AnimatePresence>
    );
}
