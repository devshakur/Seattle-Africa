"use client";

import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, ArrowRight, ReceiptText } from "lucide-react";
import { FlowStatus } from "../hooks/useSendMoneyFlow";

interface Props {
    status: FlowStatus;
    onReset: () => void;
}

export function StepResult({ status, onReset }: Props) {
    const isSuccess = status === "success";

    return (
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center overflow-hidden px-5 py-8 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background accent */}
            <div
                className={`pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${isSuccess ? "bg-emerald-100/70" : "bg-red-100/70"
                    }`}
            />

            {/* Result icon */}
            <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-8 ${isSuccess
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

            {/* Heading */}
            <span
                className={`mb-3 rounded-full px-3 py-1 text-xs font-semibold ${isSuccess
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
            >
                {isSuccess ? "TRANSFER COMPLETE" : "ACTION REQUIRED"}
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {isSuccess ? "Transfer Successful" : "Transfer Failed"}
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                {isSuccess
                    ? "Your transfer has been processed successfully. The beneficiary may receive a notification shortly."
                    : "We couldn't complete your transfer. Please review your details and try again. If you were debited, check your transaction status before retrying."}
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                {isSuccess ? (
                    <>
                        <Button
                            onClick={onReset}
                            className="h-12 w-full rounded-xl px-6 font-semibold shadow-sm sm:w-auto"
                        >
                            Done
                            <ArrowRight size={16} className="ml-2" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full rounded-xl border-slate-200 px-6 font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                        >
                            <ReceiptText size={16} className="mr-2" />
                            View Receipt
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={onReset}
                            className="h-12 w-full rounded-xl px-6 font-semibold sm:w-auto"
                        >
                            Try Again
                        </Button>
                    </>
                )}
            </div>

            {isSuccess && (
                <p className="mt-6 text-xs text-slate-400">
                    Thank you for using our transfer service.
                </p>
            )}
        </div>
    );
}