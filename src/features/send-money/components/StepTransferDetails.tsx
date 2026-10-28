"use client";

import { useEffect, useState } from "react";
import {
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Building2,
    Globe2,
    AlertCircle,
    ChevronDown,
    ShieldCheck,
    Zap,
    Clock,
    Landmark,
    LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utils";

interface Props {
    amount: string;
    setAmount: (val: string) => void;
    sendCurrency: string;
    setSendCurrency: (val: string) => void;
    country: string;
    setCountry: (val: string) => void;
    accountNumber: string;
    setAccountNumber: (val: string) => void;
    accountName: string;
    setAccountName: (val: string) => void;
    bankName: string;
    setBankName: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const sendCurrencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

// Mock rates relative to 1 USD
const usdRates: Record<string, number> = {
    USD: 1,
    GBP: 1.27,
    EUR: 1.08,
    CAD: 0.74,
};

const countries = [
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "🇳🇬", rateToUsd: 1450 },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "₵", flag: "🇬🇭", rateToUsd: 15.2 },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪", rateToUsd: 130.5 },
];

const banks = [
    { id: "gtb", name: "Guaranty Trust Bank (GTB)", country: "NG" },
    { id: "access", name: "Access Bank", country: "NG" },
    { id: "zenith", name: "Zenith Bank", country: "NG" },
    { id: "gcb", name: "GCB Bank", country: "GH" },
    { id: "kcb", name: "KCB Bank", country: "KE" },
];

export function StepTransferDetails({
    amount,
    setAmount,
    sendCurrency,
    setSendCurrency,
    country,
    setCountry,
    accountNumber,
    setAccountNumber,
    accountName,
    setAccountName,
    bankName,
    setBankName,
    onNext,
    onBack,
}: Props) {
    const [isFetchingAccount, setIsFetchingAccount] = useState(false);
    const [fetchError, setFetchError] = useState("");

    // Reset bank and account details when country changes
    useEffect(() => {
        setBankName("");
        setAccountNumber("");
        setAccountName("");
        setFetchError("");
    }, [country, setBankName, setAccountNumber, setAccountName]);

    // Simulated Account Lookup API
    useEffect(() => {
        if (accountNumber.length >= 10 && bankName) {
            setIsFetchingAccount(true);
            setFetchError("");
            setAccountName("");

            const timer = setTimeout(() => {
                if (accountNumber === "0000000000") {
                    setFetchError("Account not found. Please verify the account number.");
                    setIsFetchingAccount(false);
                    return;
                }

                const mockNames = ["Amina Yusuf", "John Doe", "Chinedu Okafor", "Fatima Diallo"];
                const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

                setAccountName(randomName);
                setIsFetchingAccount(false);
            }, 1400);

            return () => clearTimeout(timer);
        } else {
            setAccountName("");
        }
    }, [accountNumber, bankName, setAccountName]);

    const selectedCountry = countries.find((c) => c.name === country);
    const availableBanks = banks.filter((b) => b.country === selectedCountry?.code);

    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount > 0 ? (sendCurrency === "USD" ? 2.0 : 2.0 / usdRates[sendCurrency]) : 0; // Simple fee conversion

    // Calculate Cross-Rate (e.g., GBP to NGN)
    let displayRate = 0;
    let convertedAmount = 0;

    if (selectedCountry && sendCurrency) {
        // Rate: 1 GBP = X NGN
        displayRate = selectedCountry.rateToUsd / usdRates[sendCurrency];
        convertedAmount = numAmount * displayRate;
    }

    const currentSymbol = sendCurrencies.find((c) => c.code === sendCurrency)?.symbol || "$";

    const isFormValid =
        numAmount > 0 &&
        country !== "" &&
        bankName !== "" &&
        accountNumber.length >= 10 &&
        accountName !== "" &&
        !isFetchingAccount &&
        !fetchError;

    return (
        <div className="mx-auto w-full max-w-5xl animate-in fade-in-50 slide-in-from-bottom-4 duration-500">

            {/* Step Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 mb-3">
                    <Globe2 size={13} />
                    <span>International Transfer</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Transfer Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Enter the transfer amount and recipient bank account details below.
                </p>
            </div>

            {/* Two-Card Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Main Form Card (Takes up 2/3) */}
                <div className="lg:col-span-2 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

                    {/* Amount Input Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            You Send
                        </label>
                        <div className="group relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-1 transition-all focus-within:border-black focus-within:bg-white focus-within:ring-4 focus-within:ring-black/5 hover:border-gray-300">
                            <span className="pl-3.5 text-lg font-bold text-gray-400">
                                {currentSymbol}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-transparent px-2 py-2.5 text-2xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none"
                            />

                            {/* Currency Selector Dropdown */}
                            <div className="mr-1.5 relative">
                                <select
                                    value={sendCurrency}
                                    onChange={(e) => setSendCurrency(e.target.value)}
                                    className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-gray-800 shadow-sm focus:border-black focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    {sendCurrencies.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dynamic Conversion Estimation Badge */}
                        {numAmount > 0 && selectedCountry && (
                            <div className="flex items-center justify-between px-1 text-xs text-gray-500 pt-1">
                                <span className="flex items-center gap-1 text-gray-900 font-medium">
                                    <Zap size={13} /> Guaranteed rate: 1 {sendCurrency} = {displayRate.toFixed(2)} {selectedCountry.currency}
                                </span>
                                <span className="font-semibold text-gray-900">
                                    Recipient gets ~ {selectedCountry.symbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="h-px w-full bg-gray-100" />

                    {/* Recipient Country & Bank Selection */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Destination Country */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Destination Country
                            </label>
                            <div className="relative">
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm font-medium text-gray-900 transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 hover:border-gray-300 cursor-pointer"
                                >
                                    <option value="" disabled>
                                        Select country
                                    </option>
                                    {countries.map((c) => (
                                        <option key={c.code} value={c.name}>
                                            {c.flag} {c.name} ({c.currency})
                                        </option>
                                    ))}
                                </select>
                                <Globe2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Bank Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Bank Name
                            </label>
                            <div className="relative">
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    disabled={!country}
                                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm font-medium text-gray-900 transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
                                >
                                    <option value="" disabled>
                                        Select bank
                                    </option>
                                    {availableBanks.map((b) => (
                                        <option key={b.id} value={b.name}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Account Number Section */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Account Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                placeholder="e.g. 0123456789"
                                disabled={!bankName}
                                className={cn(
                                    "h-11 w-full rounded-xl border bg-white px-4 text-sm font-medium text-gray-900 transition-all focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
                                    fetchError
                                        ? "border-red-300 focus:border-red-600 focus:ring-red-600/10"
                                        : accountName
                                            ? "border-gray-900 focus:border-black focus:ring-black/10"
                                            : "border-gray-200 focus:border-black focus:ring-black/5 hover:border-gray-300"
                                )}
                            />
                            {isFetchingAccount && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-gray-900" />
                                </div>
                            )}
                        </div>

                        {/* Verification Feedback States */}
                        {isFetchingAccount && (
                            <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5 animate-pulse">
                                Verifying account information...
                            </p>
                        )}

                        {fetchError && (
                            <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50/80 p-3 border border-red-100 text-red-700">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span className="text-xs font-medium leading-relaxed">{fetchError}</span>
                            </div>
                        )}

                        {accountName && !isFetchingAccount && (
                            <div className="mt-2 flex items-center gap-2.5 rounded-lg bg-gray-50 p-3 border border-gray-200 text-gray-900">
                                <CheckCircle2 size={18} className="text-black shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Account Verified</p>
                                    <p className="text-sm font-semibold">{accountName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fee & Payment Summary Card */}
                    {numAmount > 0 && (
                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-2.5 text-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Transfer amount</span>
                                <span className="font-semibold text-gray-900">{currentSymbol}{numAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Transfer fee</span>
                                <span className="font-semibold text-gray-900">{currentSymbol}{fee.toFixed(2)}</span>
                            </div>
                            <div className="h-px w-full bg-gray-200/70 my-1" />
                            <div className="flex justify-between text-sm font-bold text-gray-900 pt-0.5">
                                <span>Total cost</span>
                                <span className="text-black">{currentSymbol}{(numAmount + fee).toFixed(2)} {sendCurrency}</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons inside the Card */}
                    <div className="pt-2">
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
                                disabled={!isFormValid}
                                className="h-11 rounded-xl px-6 text-sm font-semibold bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm"
                            >
                                Review Transfer
                                <ArrowRight size={16} className="ml-1.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Information Sidebar Card (Takes up 1/3) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Transfer Information</h3>

                        <div className="space-y-5">
                            {/* Rate Box */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Landmark size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Locked Exchange Rate</p>
                                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                        The rate is locked for 30 minutes. {selectedCountry ? `1 ${sendCurrency} = ${displayRate.toFixed(2)} ${selectedCountry.currency}` : "Select a country to see the rate."}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Time Box */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Clock size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Estimated Delivery</p>
                                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                        Funds typically arrive within 5-10 minutes after payment is confirmed.
                                    </p>
                                </div>
                            </div>

                            {/* Limits Box */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Zap size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Transfer Limits</p>
                                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                        Daily limit: 10,000 {sendCurrency}. Monthly limit: 50,000 {sendCurrency}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge Card */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex items-start gap-3">
                        <LockKeyhole size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-gray-900">Bank-grade Security</p>
                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                Your data is protected with 256-bit encryption. We never store your banking passwords.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}