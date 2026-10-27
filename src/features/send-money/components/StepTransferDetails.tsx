"use client";

import { useEffect, useState } from "react";
import {
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Building2,
    Globe2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utils";

interface Props {
    amount: string;
    setAmount: (val: string) => void;
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

const countries = [
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "₵" },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh" },
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
                // Simulate random failure (e.g., 10% chance)
                if (accountNumber === "0000000000") {
                    setFetchError("Account not found. Please check the number.");
                    setIsFetchingAccount(false);
                    return;
                }

                // Mock successful lookup
                const mockNames = ["Amina Yusuf", "John Doe", "Chinedu Okafor", "Fatima Diallo"];
                const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

                setAccountName(randomName);
                setIsFetchingAccount(false);
            }, 1500); // 1.5s delay

            return () => clearTimeout(timer);
        } else {
            setAccountName("");
        }
    }, [accountNumber, bankName, setAccountName]);

    const selectedCountry = countries.find((c) => c.name === country);
    const availableBanks = banks.filter((b) => b.country === selectedCountry?.code);

    // Calculate fees (Mock logic: $2 flat fee)
    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount > 0 ? 2.00 : 0;
    const total = numAmount + fee;

    const isFormValid =
        numAmount > 0 &&
        country !== "" &&
        bankName !== "" &&
        accountNumber.length >= 10 &&
        accountName !== "" &&
        !isFetchingAccount &&
        !fetchError;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col animate-in slide-in-from-right-8 duration-300">

            {/* Heading */}
            <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Send money <span className="mx-1 text-gray-300">/</span> Transfer Details
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                    Who are you sending to?
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Enter the amount and the recipient's bank details.
                </p>
            </div>

            <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">

                {/* Amount Input */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount to send (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="h-12 w-full rounded-xl border border-gray-200 pl-8 pr-4 text-lg font-semibold text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                        />
                    </div>
                </div>

                {/* Country & Bank */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Destination Country</label>
                        <div className="relative">
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="h-12 w-full appearance-none rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all bg-white"
                            >
                                <option value="" disabled>Select country</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <Globe2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Bank Name</label>
                        <div className="relative">
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                disabled={!country}
                                className="h-12 w-full appearance-none rounded-xl border border-gray-200 pl-10 pr-4 text-sm font-medium text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="" disabled>Select bank</option>
                                {availableBanks.map((b) => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                            <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Account Number */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Account Number</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} // Only numbers, max 10
                            placeholder="Enter 10-digit account number"
                            disabled={!bankName}
                            className={cn(
                                "h-12 w-full rounded-xl border px-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-400",
                                fetchError
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                    : "border-gray-200 focus:border-gray-400 focus:ring-gray-900/10"
                            )}
                        />
                        {isFetchingAccount && (
                            <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                        )}
                    </div>

                    {/* Account Resolution States */}
                    {isFetchingAccount && (
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                            Resolving account name...
                        </p>
                    )}
                    {fetchError && (
                        <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                            <AlertCircle size={14} /> {fetchError}
                        </p>
                    )}
                    {accountName && !isFetchingAccount && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-3 border border-green-100">
                            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                            <p className="text-sm font-semibold text-green-800">{accountName}</p>
                        </div>
                    )}
                </div>

                {/* Fee Breakdown (Only shows if amount > 0) */}
                {numAmount > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transfer amount</span>
                            <span className="font-medium text-gray-900">${numAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Processing fee</span>
                            <span className="font-medium text-gray-900">${fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total to pay</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-11 rounded-xl px-6"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                </Button>

                <Button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="h-11 rounded-xl px-6"
                >
                    Continue to Payment
                    <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>
    );
}