"use client";

import { useState } from "react";
import {
    ArrowRight,
    ArrowLeft,
    Globe2,
    ChevronDown,
    Zap,
    Clock,
    Landmark,
    LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
    { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
    { code: "XOF", symbol: "CFA", name: "West African CFA" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
    { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
    { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
];

// Baseline relative exchange rates to NGN
const africanRatesToNgn: Record<string, number> = {
    NGN: 1,
    ZAR: 91.38,
    KES: 11.74,
    GHS: 97.46,
    XOF: 2.59,
    EGP: 31.15,
    RWF: 1.14,
    UGX: 0.41,
};

const countries = [
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "🇳🇬" },
    { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", flag: "🇿🇦" },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪" },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "GH₵", flag: "🇬🇭" },
    { code: "SN", name: "Senegal", currency: "XOF", symbol: "CFA", flag: "🇸🇳" },
    { code: "EG", name: "Egypt", currency: "EGP", symbol: "E£", flag: "🇪🇬" },
    { code: "RW", name: "Rwanda", currency: "RWF", symbol: "FRw", flag: "🇷🇼" },
    { code: "UG", name: "Uganda", currency: "UGX", symbol: "USh", flag: "🇺🇬" },
];

const banks = [
    { id: "gtb", name: "Guaranty Trust Bank (GTB)", country: "NG" },
    { id: "access", name: "Access Bank", country: "NG" },
    { id: "zenith", name: "Zenith Bank", country: "NG" },
    { id: "standard-za", name: "Standard Bank", country: "ZA" },
    { id: "fnb-za", name: "First National Bank (FNB)", country: "ZA" },
    { id: "capitec", name: "Capitec Bank", country: "ZA" },
    { id: "kcb", name: "KCB Bank Kenya", country: "KE" },
    { id: "equity", name: "Equity Bank", country: "KE" },
    { id: "gcb", name: "GCB Bank", country: "GH" },
    { id: "ecobank-gh", name: "Ecobank Ghana", country: "GH" },
    { id: "cbao", name: "CBAO Groupe Attijariwafa", country: "SN" },
    { id: "cib-eg", name: "Commercial International Bank (CIB)", country: "EG" },
    { id: "bk-rw", name: "Bank of Kigali", country: "RW" },
    { id: "stanbic-ug", name: "Stanbic Bank Uganda", country: "UG" },
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

    const triggerLookup = (accNum: string, bank: string) => {
        if (accNum.length >= 10 && bank) {
            setIsFetchingAccount(true);
            setFetchError("");
            setAccountName("");

            setTimeout(() => {
                if (accNum === "0000000000") {
                    setFetchError("Account not found. Please verify the account number.");
                } else {
                    const mockNames = ["Amina Yusuf", "John Doe", "Chinedu Okafor", "Fatima Diallo", "Sipho Khumalo", "Kwame Asante"];
                    setAccountName(mockNames[Math.floor(Math.random() * mockNames.length)]);
                }
                setIsFetchingAccount(false);
            }, 1000);
        } else {
            setAccountName("");
            setFetchError("");
        }
    };

    const handleCountryChange = (newCountry: string) => {
        setCountry(newCountry);
        setBankName("");
        setAccountNumber("");
        setAccountName("");
        setFetchError("");
    };

    const handleBankChange = (newBank: string) => {
        setBankName(newBank);
        triggerLookup(accountNumber, newBank);
    };

    const handleAccountNumberChange = (val: string) => {
        const clean = val.replace(/\D/g, "");
        setAccountNumber(clean);
        triggerLookup(clean, bankName);
    };

    const selectedCountry = countries.find((c) => c.name === country);
    const availableBanks = banks.filter((b) => b.country === selectedCountry?.code);

    const numAmount = parseFloat(amount) || 0;
    const fromRate = africanRatesToNgn[sendCurrency] || 1;
    const toRate = selectedCountry ? africanRatesToNgn[selectedCountry.currency] || 1 : 1;
    const displayRate = fromRate / toRate;
    const convertedAmount = numAmount * displayRate;

    const currentSymbol = sendCurrencies.find((c) => c.code === sendCurrency)?.symbol || "₦";

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
                    <span>Pan-African Settlement</span>
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
                                    <Zap size={13} /> Guaranteed rate: 1 {sendCurrency} = {displayRate.toFixed(4)} {selectedCountry.currency}
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
                                    onChange={(e) => handleCountryChange(e.target.value)}
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
                                Recipient Bank
                            </label>
                            <div className="relative">
                                <select
                                    value={bankName}
                                    onChange={(e) => handleBankChange(e.target.value)}
                                    disabled={!country}
                                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm font-medium text-gray-900 transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
                                >
                                    <option value="" disabled>
                                        {country ? "Select a bank" : "Choose country first"}
                                    </option>
                                    {availableBanks.map((b) => (
                                        <option key={b.id} value={b.name}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <Landmark size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Account Number & Auto-Verified Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Account Number */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Account Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={12}
                                    value={accountNumber}
                                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                                    placeholder="e.g. 0123456789"
                                    disabled={!bankName}
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
                                />
                            </div>
                            {fetchError && (
                                <p className="text-xs text-red-500 font-medium pt-1">
                                    {fetchError}
                                </p>
                            )}
                        </div>

                        {/* Account Name (Verified Automatically) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Account Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={isFetchingAccount ? "Verifying bank details..." : accountName}
                                    readOnly
                                    placeholder="Auto-verifies upon number entry"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm font-medium text-gray-900 focus:outline-none cursor-default"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 flex items-center justify-between border-t border-gray-100">
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
                                        The rate is locked for 30 minutes. {selectedCountry ? `1 ${sendCurrency} = ${displayRate.toFixed(4)} ${selectedCountry.currency}` : "Select a country to see the rate."}
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
                                        Funds typically arrive within seconds via direct Pan-African interbank settlement.
                                    </p>
                                </div>
                            </div>

                            {/* Limits Box */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Zap size={14} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">Corridor Settlement</p>
                                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                        Zero currency intermediary route. Direct local central bank clearing.
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
                                Compliant with African central bank regulatory standards and end-to-end encryption.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
