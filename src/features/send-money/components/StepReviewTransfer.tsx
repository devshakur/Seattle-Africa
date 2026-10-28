"use client";

import {
    ArrowRight,
    ArrowLeft,
    User,
    Landmark,
    Hash,
    Globe2,
    Clock,
    Zap,
    Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
    amount: string;
    sendCurrency: string;
    country: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    onNext: () => void;
    onBack: () => void;
}

// Re-using mock data for calculations
const usdRates: Record<string, number> = { USD: 1, GBP: 1.27, EUR: 1.08, CAD: 0.74 };
const countries = [
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "🇳🇬", rateToUsd: 1450 },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "₵", flag: "🇬🇭", rateToUsd: 15.2 },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪", rateToUsd: 130.5 },
];

export function StepReviewTransfer({
    amount,
    sendCurrency,
    country,
    bankName,
    accountNumber,
    accountName,
    onNext,
    onBack,
}: Props) {
    const numAmount = parseFloat(amount) || 0;
    const selectedCountry = countries.find((c) => c.name === country);

    const fee = numAmount > 0 ? (sendCurrency === "USD" ? 2.0 : 2.0 / usdRates[sendCurrency]) : 0;
    const total = numAmount + fee;

    let displayRate = 0;
    let convertedAmount = 0;

    if (selectedCountry) {
        displayRate = selectedCountry.rateToUsd / usdRates[sendCurrency];
        convertedAmount = numAmount * displayRate;
    }

    const currentSymbol = sendCurrency === "GBP" ? "£" : sendCurrency === "EUR" ? "€" : "$";

    return (
        <div className="mx-auto w-full max-w-5xl animate-in fade-in-50 slide-in-from-bottom-4 duration-500">

            {/* Step Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 mb-3">
                    <Globe2 size={13} />
                    <span>Almost there</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Review Transfer
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Please confirm the details below are correct before proceeding to payment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Main Details Card (Takes up 2/3) */}
                <div className="lg:col-span-2 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

                    {/* Transfer Amount Summary */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Transfer Summary</h3>
                        <div className="flex items-end justify-between bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">You send</p>
                                <p className="text-2xl font-bold text-gray-900">{currentSymbol}{numAmount.toFixed(2)} <span className="text-base font-medium text-gray-400">{sendCurrency}</span></p>
                            </div>
                            <ArrowRight className="text-gray-300 mx-4 mb-2" />
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Recipient gets</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {selectedCountry?.symbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-base font-medium text-gray-400">{selectedCountry?.currency}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-100" />

                    {/* Recipient Details */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recipient Details</h3>
                            <button onClick={onBack} className="text-xs font-semibold text-gray-900 flex items-center gap-1 hover:underline">
                                <Pencil size={12} /> Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <User size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Name</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{accountName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Landmark size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Bank Name</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{bankName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Hash size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Number</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{accountNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Globe2 size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Destination</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                                        {selectedCountry?.flag} {country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="h-11 rounded-xl px-5 text-sm font-semibold text-gray-700 hover:bg-gray-100 border-gray-200"
                            >
                                <ArrowLeft size={16} className="mr-1.5" />
                                Back
                            </Button>

                            <Button
                                onClick={onNext}
                                className="h-11 rounded-xl px-6 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all shadow-sm"
                            >
                                Choose Payment Method
                                <ArrowRight size={16} className="ml-1.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Payment Breakdown Sidebar (Takes up 1/3) */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm sticky top-24">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Breakdown</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Amount</span>
                                <span className="font-medium text-gray-900">{currentSymbol}{numAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Transfer Fee</span>
                                <span className="font-medium text-gray-900">{currentSymbol}{fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Exchange Rate</span>
                                <span className="font-medium text-gray-900">1 {sendCurrency} = {displayRate.toFixed(2)} {selectedCountry?.currency}</span>
                            </div>

                            <div className="h-px w-full bg-gray-200 my-2" />

                            <div className="flex justify-between items-center pt-1">
                                <span className="text-base font-bold text-gray-900">Total to pay</span>
                                <span className="text-xl font-bold text-black">{currentSymbol}{total.toFixed(2)} {sendCurrency}</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Funds will arrive in the recipient's account within <strong className="text-gray-900">5-10 minutes</strong> after payment is confirmed.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Zap size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Exchange rate is guaranteed for this transaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}