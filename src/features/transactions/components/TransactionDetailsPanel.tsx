"use client";

import { X, CreditCard, MapPin, Receipt, Calendar, User, Download, Share2, Check } from "lucide-react";
import { toast } from "react-toastify";
import { Transaction } from "../hooks/useTransactions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utils";

interface Props {
    transaction: Transaction | null;
    onClose: () => void;
}

export function TransactionDetailsPanel({ transaction, onClose }: Props) {
    if (!transaction) return null;

    const handleDownloadReceipt = () => {
        try {
            const receiptContent = `================================================
SETTLE AFRICA — OFFICIAL TRANSACTION RECEIPT
================================================
Transaction Reference : ${transaction.id}
Date & Time           : ${transaction.date}
Status                : ${transaction.status.toUpperCase()}
Transaction Type      : ${transaction.type}
Total Amount          : ${transaction.amount}

CUSTOMER DETAILS
------------------------------------------------
Name                  : ${transaction.customer}
Email                 : ${transaction.email}
Account / Card        : ${transaction.account}

BILLING INFORMATION
------------------------------------------------
Address               : ${transaction.billing.address}
City / State          : ${transaction.billing.city}, ${transaction.billing.state}
Contact               : ${transaction.billing.mobile}

================================================
Direct Pan-African Clearing Rail • Settle Africa
================================================`;

            const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SettleAfrica-Receipt-${transaction.id}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`Receipt for ${transaction.id} downloaded successfully!`);
        } catch {
            toast.error("Failed to download receipt.");
        }
    };

    const handleForwardReceipt = () => {
        try {
            const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track-transaction?ref=${transaction.id}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl);
                toast.success(`Receipt link for ${transaction.id} copied to clipboard! You can now forward it.`);
            }
        } catch {
            toast.error("Failed to copy receipt link.");
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Floating Slide-over Panel */}
            <div
                className="fixed top-3 bottom-3 right-3 w-[calc(100%-1.5rem)] sm:w-[480px] bg-white z-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-base font-bold text-gray-950">Transaction Details</h2>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">ID: {transaction.id}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close details"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Amount & Status Section */}
                    <div className="text-center pb-5 border-b border-gray-100">
                        <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-1">
                            Amount Settled
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mb-3 tracking-tight font-mono tabular-nums">
                            {transaction.amount}
                        </h1>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                transaction.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            )}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    transaction.status === "Approved" ? "bg-emerald-600" : "bg-red-600"
                                }`}
                            />
                            {transaction.status}
                        </span>

                        {/* Prominent Action Bar: Download & Forward */}
                        <div className="mt-5 grid grid-cols-2 gap-2.5">
                            <Button
                                type="button"
                                onClick={handleDownloadReceipt}
                                className="h-10 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                            >
                                <Download size={14} />
                                <span>Download Receipt</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleForwardReceipt}
                                className="h-10 rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-2"
                            >
                                <Share2 size={14} />
                                <span>Forward Receipt</span>
                            </Button>
                        </div>
                    </div>

                    {/* Transaction Metadata */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <Receipt size={14} /> Payment Breakdown
                        </h3>
                        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Transaction Type</span>
                                <span className="font-semibold text-gray-900">{transaction.type}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                <span className="text-gray-500">Date & Timestamp</span>
                                <span className="font-medium font-mono tabular-nums text-gray-900 flex items-center gap-1.5">
                                    <Calendar size={13} className="text-gray-400" />
                                    {transaction.date}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                <span className="text-gray-500">Payment Account</span>
                                <span className="font-medium font-mono text-gray-900 flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-gray-200">
                                    <CreditCard size={13} className="text-gray-400" />
                                    {transaction.account}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                <span className="text-gray-500">Settlement Network</span>
                                <span className="font-mono text-emerald-700 font-semibold">PAPSS Instant Rail</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Billing Information */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <User size={14} /> Recipient / Billing Details
                        </h3>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs space-y-2.5 text-xs">
                            <div>
                                <p className="text-[11px] text-gray-400 mb-0.5">Beneficiary</p>
                                <p className="font-bold text-gray-950 text-sm">{transaction.customer}</p>
                                <p className="text-gray-500 mt-0.5 font-mono">{transaction.email}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-[11px] text-gray-400 mb-0.5 flex items-center gap-1">
                                    <MapPin size={11} /> Registered Address
                                </p>
                                <p className="font-medium text-gray-800">{transaction.billing.address}</p>
                                <p className="text-gray-500">{transaction.billing.city}, {transaction.billing.state} {transaction.billing.zip}</p>
                                <p className="text-gray-500 font-mono mt-0.5">{transaction.billing.mobile}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex gap-2.5">
                    <Button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="h-10 flex-1 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                        <Download size={14} />
                        <span>Download</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleForwardReceipt}
                        className="h-10 flex-1 rounded-xl border-gray-200 text-gray-800 hover:bg-white text-xs font-semibold flex items-center justify-center gap-2"
                    >
                        <Share2 size={14} />
                        <span>Forward</span>
                    </Button>
                </div>
            </div>
        </>
    );
}
