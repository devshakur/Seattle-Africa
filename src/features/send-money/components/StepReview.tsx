"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Landmark, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";

interface Props {
    amount: string;
    sendCurrency: string;
    method: PaymentMethod;
    country: string;
    targetCurrency: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    exchangeRate: number;
    feeAmount: number;
    totalToPay: number;
    recipientGets: number;
    onBack: () => void;
    onConfirm: () => void;
}

const DEPOSIT_ACCOUNTS: Record<
    string,
    { bank: string; accountNumber: string; accountName: string }
> = {
    NGN: { bank: "Providus Bank", accountNumber: "9920148201", accountName: "Settle Africa Treasury (NGN)" },
    ZAR: { bank: "Standard Bank SA", accountNumber: "40928172910", accountName: "Settle Africa Treasury (ZAR)" },
    KES: { bank: "Equity Bank Kenya", accountNumber: "018294019284", accountName: "Settle Africa Treasury (KES)" },
    GHS: { bank: "GCB Bank Ghana", accountNumber: "1092847192", accountName: "Settle Africa Treasury (GHS)" },
    XOF: { bank: "Ecobank Senegal", accountNumber: "5501928401", accountName: "Settle Africa Treasury (CFA)" },
    EGP: { bank: "CIB Egypt", accountNumber: "10003829104", accountName: "Settle Africa Treasury (EGP)" },
    RWF: { bank: "Bank of Kigali", accountNumber: "00049281940", accountName: "Settle Africa Treasury (RWF)" },
    UGX: { bank: "Stanbic Bank Uganda", accountNumber: "90300182910", accountName: "Settle Africa Treasury (UGX)" },
};

export function StepReview({
    amount,
    sendCurrency,
    method,
    country,
    targetCurrency,
    bankName,
    accountNumber,
    accountName,
    exchangeRate,
    feeAmount,
    totalToPay,
    recipientGets,
    onBack,
    onConfirm,
}: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const depositAccount =
        DEPOSIT_ACCOUNTS[sendCurrency] || {
            bank: "Ecobank Interbank Settlement",
            accountNumber: "8920148201",
            accountName: `Settle Africa Treasury (${sendCurrency})`,
        };

    const paymentRef = "SA-89421";

    const copyToClipboard = (text: string, label: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedField(label);
            toast.success(`${label} copied to clipboard!`);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const methodLabel =
        method === "card"
            ? "Debit Card"
            : method === "mobile"
              ? "Mobile Money"
              : "Bank Transfer";

    return (
        <div className="mx-auto w-full max-w-xl animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6 text-left">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2.5 py-1 rounded-full">
                    Step 3 of 3
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Review your transfer
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    {method === "bank"
                        ? "Transfer the funds to the account details below, then click \"I've Sent the Money\"."
                        : "Double-check all details below before authorizing the payment."}
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
                {/* Highlighted Amount Box */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                        <div>
                            <span className="text-[10px] uppercase font-mono text-gray-400 block">You send</span>
                            <span className="font-mono tabular-nums text-xl font-bold text-gray-950">
                                {Number(amount).toLocaleString()} {sendCurrency}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-mono text-gray-400 block">Recipient receives</span>
                            <span className="font-mono tabular-nums text-xl font-bold text-gray-950">
                                {recipientGets.toLocaleString("en-US", { maximumFractionDigits: 2 })} {targetCurrency}
                            </span>
                        </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-xs text-gray-500 font-mono tabular-nums">
                        <span>Guaranteed Rate</span>
                        <span className="font-semibold text-gray-900">
                            1 {sendCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
                        </span>
                    </div>
                </div>

                {/* Deposit Bank Account Details (Shown for Bank Transfer) */}
                {method === "bank" && (
                    <div className="rounded-xl border-2 border-black bg-zinc-50/80 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center">
                                    <Landmark size={14} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-950">
                                        Account to Send Money To
                                    </h3>
                                    <p className="text-[11px] text-gray-500">
                                        Transfer exactly{" "}
                                        <span className="font-bold text-black font-mono">
                                            {totalToPay.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}{" "}
                                            {sendCurrency}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full">
                                Instant Rails
                            </span>
                        </div>

                        {/* Account Details Box */}
                        <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2.5 font-mono">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-sans">Bank Name</span>
                                <span className="font-bold text-gray-950">{depositAccount.bank}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                                <span className="text-gray-500 font-sans">Account Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm sm:text-base text-gray-950 tracking-wider">
                                        {depositAccount.accountNumber}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(depositAccount.accountNumber, "Account number")
                                        }
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 hover:bg-black hover:text-white text-gray-700 text-[10px] font-sans font-semibold transition-colors"
                                        title="Copy account number"
                                    >
                                        {copiedField === "Account number" ? (
                                            <>
                                                <Check size={11} />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={11} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                                <span className="text-gray-500 font-sans">Account Name</span>
                                <span className="font-semibold text-gray-900 font-sans truncate ml-2">
                                    {depositAccount.accountName}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                                <span className="text-gray-500 font-sans">Payment Reference</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{paymentRef}</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(paymentRef, "Payment reference")}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 hover:bg-black hover:text-white text-gray-700 text-[10px] font-sans font-semibold transition-colors"
                                        title="Copy reference"
                                    >
                                        {copiedField === "Payment reference" ? (
                                            <>
                                                <Check size={11} />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={11} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            Open your banking app, transfer the exact amount using the details above, then click{" "}
                            <strong className="text-black font-semibold">&quot;I&apos;ve Sent the Money&quot;</strong> below.
                        </p>
                    </div>
                )}

                {/* Transfer Breakdown */}
                <div className="space-y-3 pt-1 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Recipient Name</span>
                        <span className="font-semibold text-gray-900">{accountName || "Beneficiary"}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Destination</span>
                        <span className="font-semibold text-gray-900">{country}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Recipient Bank / Provider</span>
                        <span className="font-semibold text-gray-900">{bankName}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Recipient Account / Phone</span>
                        <span className="font-mono font-semibold text-gray-900 tabular-nums">
                            {accountNumber}
                        </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Payment Source</span>
                        <span className="font-semibold text-gray-900">{methodLabel}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-500">Transfer Fee (1%)</span>
                        <span className="font-mono font-semibold text-gray-900 tabular-nums">
                            {feeAmount.toFixed(2)} {sendCurrency}
                        </span>
                    </div>

                    <div className="flex justify-between py-2 text-sm">
                        <span className="font-bold text-gray-900">Total you pay</span>
                        <span className="font-mono font-bold text-gray-950 tabular-nums text-base">
                            {totalToPay.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{" "}
                            {sendCurrency}
                        </span>
                    </div>
                </div>

                {/* Delivery Notice */}
                <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] text-gray-600">
                    <ShieldCheck size={14} className="text-black shrink-0" />
                    <span>Protected by Pan-African clearing rails. Arrival estimated under 90 seconds.</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="h-11 flex-1 rounded-xl border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={15} />
                        <span>Back</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="h-11 flex-1 rounded-xl bg-black text-sm font-semibold text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span>{method === "bank" ? "I've Sent the Money" : "Confirm & Send"}</span>
                        <ArrowRight size={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
