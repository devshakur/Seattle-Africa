"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";
import {
    Copy,
    Info,
    CreditCard,
    Smartphone,
    Building2,
    ShieldCheck,
    LockKeyhole,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/libs/utils";

interface Props {
    method: PaymentMethod;
    amount: string;
    sendCurrency: string;
    fee: string;
    total: string;
    accountName: string;
    bankName: string;
    country: string;
    onNext: () => void;
    onBack: () => void;
}

export function StepPaymentDetails({
    method,
    amount,
    sendCurrency,
    fee,
    total,
    accountName,
    bankName,
    country,
    onNext,
    onBack,
}: Props) {
    const [copied, setCopied] = useState(false);

    const currentSymbol = sendCurrency === "GBP" ? "£" : sendCurrency === "EUR" ? "€" : sendCurrency === "CAD" ? "C$" : "$";
    const transactionId = "#SET-89210";

    const handleCopy = () => {
        navigator.clipboard.writeText("0123456789");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto w-full max-w-5xl animate-in fade-in-50 slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 mb-3">
                    <LockKeyhole size={13} />
                    <span>Secure Payment</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {method === "bank" ? "Complete your payment" : "Enter Payment Details"}
                </h1>
                <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                    {method === "bank"
                        ? `Please transfer exactly ${currentSymbol}${total} to the corporate account below to fund your transfer to ${accountName}.`
                        : `Please provide your payment details below to complete the ${currentSymbol}${total} transfer.`}
                </p>
            </div>

            {/* Two-Card Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Main Payment Card (Takes up 2/3) */}
                <div className="lg:col-span-2 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

                    {/* --- BANK TRANSFER VIEW --- */}
                    {method === "bank" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-5 space-y-5">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                                            <p className="font-semibold text-gray-900">Guaranty Trust Bank (GTB)</p>
                                        </div>
                                        <Building2 size={20} className="text-gray-300" />
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Account Name</p>
                                            <p className="font-semibold text-gray-900">Settle Africa Ltd</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                            <p className="text-2xl font-bold tracking-widest text-gray-900">0123456789</p>
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors flex items-center gap-2 text-sm font-semibold border border-gray-200"
                                        >
                                            {copied ? <CheckCircle2 size={16} className="text-black" /> : <Copy size={16} />}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Monochrome Info Box */}
                                <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-start gap-3">
                                    <Info size={18} className="text-gray-900 mt-0.5 shrink-0" />
                                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                        Please use your Transaction ID <strong className="font-bold text-black">{transactionId}</strong> as the transfer narration. Your beneficiary will receive funds within 5-10 minutes of confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CARD PAYMENT VIEW --- */}
                    {method === "card" && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pl-11 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name on Card</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Amina Yusuf"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- MOBILE MONEY VIEW --- */}
                    {method === "mobile" && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Mobile Money Provider</label>
                                <select className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 cursor-pointer">
                                    <option value="" disabled>Select provider</option>
                                    <option value="mpesa">M-Pesa</option>
                                    <option value="mtn">MTN MoMo</option>
                                    <option value="airtel">Airtel Money</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Mobile Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        placeholder="e.g. 0712 345 678"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pl-11 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 mt-2">
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    You will receive a prompt on your phone to authorize this payment. Please ensure you have sufficient funds in your mobile wallet.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons (Inside Left Card) */}
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <div className="flex items-center justify-between gap-3">
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
                                {method === "bank" ? "I have sent the money" : "Pay Now"}
                                <ArrowRight size={16} className="ml-1.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Order Summary Sidebar (Takes up 1/3) */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm sticky top-24">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h3>

                        {/* Recipient Info */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Sending to</p>
                            <p className="text-sm font-semibold text-gray-900">{accountName}</p>
                            <p className="text-xs text-gray-500">{bankName} • {country}</p>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Transfer amount</span>
                                <span className="font-medium text-gray-900">{currentSymbol}{amount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Fee</span>
                                <span className="font-medium text-gray-900">{currentSymbol}{fee}</span>
                            </div>

                            <div className="h-px w-full bg-gray-200 my-2" />

                            <div className="flex justify-between items-center pt-1">
                                <span className="text-base font-bold text-gray-900">Total to pay</span>
                                <span className="text-xl font-bold text-black">{currentSymbol}{total}</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 pt-6 border-t border-gray-200 flex items-start gap-3">
                            <ShieldCheck size={18} className="text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Your payment is protected by bank-grade 256-bit encryption. We never store your card details.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}