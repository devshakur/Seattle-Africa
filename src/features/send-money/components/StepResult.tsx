"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, LayoutDashboard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FlowStatus } from "../hooks/useSendMoneyFlow";

interface Props {
    status: FlowStatus;
    onReset: () => void;
    recipientName?: string;
    amount?: string;
    sendCurrency?: string;
    recipientGets?: number;
    targetCurrency?: string;
}

export function StepResult({
    status,
    onReset,
    recipientName,
    amount,
    sendCurrency,
    recipientGets,
    targetCurrency,
}: Props) {
    const isSuccess = status === "success";

    return (
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center overflow-hidden px-5 py-6 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Result icon */}
            <div
                className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ring-8 ${
                    isSuccess
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-50/60"
                        : "bg-red-50 text-red-600 ring-red-50/60"
                }`}
            >
                {isSuccess ? (
                    <CheckCircle2 size={40} strokeWidth={1.8} />
                ) : (
                    <XCircle size={40} strokeWidth={1.8} />
                )}
            </div>

            {/* Badge */}
            <span
                className={`mb-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    isSuccess
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                }`}
            >
                {isSuccess ? "TRANSFER COMPLETED" : "TRANSFER FAILED"}
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {isSuccess ? "Transfer Successful" : "Transfer Failed"}
            </h2>

            <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500">
                {isSuccess
                    ? `Your payment has been cleared and delivered to ${recipientName || "recipient"}.`
                    : "We could not complete your transfer. Please check your source account balance or verify recipient details."}
            </p>

            {/* Summary Box */}
            {isSuccess && amount && recipientGets && (
                <div className="my-5 w-full rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs text-left space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Amount Sent</span>
                        <span className="font-mono font-bold text-gray-900">
                            {Number(amount).toLocaleString()} {sendCurrency}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Delivered</span>
                        <span className="font-mono font-bold text-emerald-600">
                            {recipientGets.toLocaleString("en-US", { maximumFractionDigits: 2 })} {targetCurrency}
                        </span>
                    </div>
                    {recipientName && (
                        <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-gray-500">Recipient</span>
                            <span className="font-semibold text-gray-900">{recipientName}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Button
                    type="button"
                    onClick={onReset}
                    className="h-11 flex-1 rounded-xl bg-black text-sm font-semibold text-white hover:bg-zinc-800 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} />
                    <span>Send Another</span>
                </Button>

                <Link href="/dashboard" className="flex-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-xl border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <LayoutDashboard size={14} />
                        <span>Dashboard</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
