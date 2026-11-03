"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Check,
    Clock,
    Building2,
    ArrowRight,
    ShieldCheck,
    Copy,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CorporateTransferItem } from "@/features/business/context/BusinessContext";

interface LivePassThroughTrackerModalProps {
    transfer: CorporateTransferItem | null;
    onClose: () => void;
    onApprove: (id: string) => void;
}

export function LivePassThroughTrackerModal({
    transfer,
    onClose,
    onApprove,
}: LivePassThroughTrackerModalProps) {
    const [copied, setCopied] = useState(false);

    if (!transfer) return null;

    const handleCopyRef = () => {
        navigator.clipboard.writeText(transfer.reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const stages = [
        {
            step: 1,
            title: "Direct Source Funding Mandate & Maker Initiation",
            subtitle: `${transfer.fundingSourceName} (${transfer.fundingSourceRail})`,
            detail:
                transfer.status === "pending_approval"
                    ? "Mandate pre-authorized; awaiting Checker dual-control sign-off before bank pull."
                    : "Atomic direct debit executed from corporate bank/card (Zero wallet custody).",
            done: transfer.status !== "pending_approval",
            active: transfer.status === "pending_approval",
        },
        {
            step: 2,
            title: "Settle Pass-Through Engine & Correspondent FX Lock",
            subtitle: `Wholesale Rate Locked: 1.00 USD = ${transfer.fxRateToUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${transfer.currencyCode}`,
            detail:
                transfer.clearingStage >= 2
                    ? "Liquidity routed directly through pan-African interbank settlement rail."
                    : "Queued for instant FX conversion upon Checker authorization.",
            done: transfer.clearingStage === 3,
            active: transfer.clearingStage === 2 && transfer.status !== "pending_approval",
        },
        {
            step: 3,
            title: `Payout Partner Disbursement (${transfer.corridorCountry})`,
            subtitle: `${transfer.beneficiaryName} • ${transfer.payoutPartnerRail}`,
            detail:
                transfer.status === "completed"
                    ? `Disbursed ${transfer.currencySymbol} ${transfer.amountLocal.toLocaleString("en-US", { minimumFractionDigits: 2 })} directly to beneficiary.`
                    : "Final mile partner settlement in progress.",
            done: transfer.status === "completed",
            active: false,
        },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                />

                <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-xl rounded-2xl border border-black bg-white p-6 sm:p-7 text-black shadow-2xl text-left"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center rounded border border-black bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                                    {transfer.type === "batch" ? "Batch Settlement" : "Single Corporate"}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyRef}
                                    className="inline-flex items-center gap-1 rounded border border-[#E5E5E5] bg-zinc-50 px-2 py-0.5 text-[11px] font-mono font-bold text-black hover:border-black transition-colors cursor-pointer font-tabular-nums"
                                >
                                    <span>{transfer.reference}</span>
                                    {copied ? <Check size={11} /> : <Copy size={11} />}
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-black">{transfer.beneficiaryName}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{transfer.beneficiarySubtext}</p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X size={17} />
                        </button>
                    </div>

                    {/* Financial Summary Strip */}
                    <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-[#E5E5E5] bg-zinc-50 p-4 font-tabular-nums">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Direct Debit (USD)
                            </p>
                            <p className="text-base font-mono font-bold text-black mt-0.5">
                                ${transfer.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500">
                                +${transfer.feeUsd.toFixed(2)} rail fee
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Payout ({transfer.currencyCode})
                            </p>
                            <p className="text-base font-mono font-bold text-black mt-0.5">
                                {transfer.currencySymbol}{" "}
                                {transfer.amountLocal.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500">
                                {transfer.corridorFlag} {transfer.corridorCountry}
                            </p>
                        </div>

                        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5E5E5]">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Pass-Through Status
                            </p>
                            <p className="text-xs font-mono font-bold uppercase text-black mt-1">
                                {transfer.status === "completed"
                                    ? "● Disbursed (3/3)"
                                    : transfer.status === "clearing"
                                      ? "◐ Clearing Rail (2/3)"
                                      : "○ Pending Checker (1/3)"}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                {transfer.timestamp}
                            </p>
                        </div>
                    </div>

                    {/* Pass-Through Pipeline Stages */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                            Direct Pass-Through Clearing Telemetry (No Wallet Custody)
                        </p>

                        <div className="space-y-2.5">
                            {stages.map((s) => (
                                <div
                                    key={s.step}
                                    className={`rounded-xl border p-3.5 transition-all ${
                                        s.done
                                            ? "border-black bg-white"
                                            : s.active
                                              ? "border-black border-dashed bg-zinc-50"
                                              : "border-[#E5E5E5] bg-zinc-50/50 opacity-70"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5 border ${
                                                s.done
                                                    ? "bg-black text-white border-black"
                                                    : s.active
                                                      ? "bg-white text-black border-black"
                                                      : "bg-white text-zinc-400 border-[#E5E5E5]"
                                            }`}
                                        >
                                            {s.done ? <Check size={12} /> : s.step}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-black">{s.title}</p>
                                                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 shrink-0">
                                                    {s.done ? "Verified" : s.active ? "Active Step" : "Queued"}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-mono text-zinc-700 mt-0.5 font-tabular-nums">
                                                {s.subtitle}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                                                {s.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Governance Audit Footer */}
                    <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-[11px] font-mono text-zinc-500 space-y-0.5">
                            <p>
                                Maker: <span className="text-black font-semibold">{transfer.initiatedBy}</span>
                            </p>
                            <p>
                                Checker:{" "}
                                <span className="text-black font-semibold">
                                    {transfer.approvedBy || "Awaiting Checker Sign-Off"}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {transfer.status === "pending_approval" && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onApprove(transfer.id);
                                        onClose();
                                    }}
                                    className="bg-black text-white hover:bg-zinc-800 h-9 px-4 text-xs cursor-pointer"
                                >
                                    <ShieldCheck size={14} />
                                    <span>Approve & Execute Pass-Through</span>
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="h-9 px-4 text-xs border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

