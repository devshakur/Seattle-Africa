"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { countries, banks, flagSrc } from "../data";

interface Props {
    country: string;
    setCountry: (val: string) => void;
    bankName: string;
    setBankName: (val: string) => void;
    accountNumber: string;
    setAccountNumber: (val: string) => void;
    accountName: string;
    setAccountName: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const countryOptions = countries.map((c) => ({
    value: c.name,
    label: c.name,
    description: c.currency,
    leadingNode: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={flagSrc(c.code)}
            alt=""
            width={20}
            height={14}
            className="h-3.5 w-5 rounded-[2px] object-cover border border-gray-200"
        />
    ),
}));

export function StepRecipient({
    country,
    setCountry,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountName,
    setAccountName,
    onNext,
    onBack,
}: Props) {
    const [isVerifying, setIsVerifying] = useState(false);

    const selectedCountryObj = countries.find((c) => c.name === country) || countries[0];
    const availableBanks = banks.filter((b) => b.country === selectedCountryObj.code);

    // Auto-select first bank if country changes and current bank is not available
    useEffect(() => {
        if (!availableBanks.some((b) => b.name === bankName) && availableBanks.length > 0) {
            setBankName(availableBanks[0].name);
        }
    }, [country, availableBanks, bankName, setBankName]);

    // Simulated account lookup when account number reaches >= 8 digits
    useEffect(() => {
        const clean = accountNumber.replace(/\D/g, "");
        if (clean.length >= 8 && !accountName) {
            setIsVerifying(true);
            const timer = setTimeout(() => {
                const sampleNames = [
                    "Abdulshakur Dauda",
                    "Chinedu Okafor",
                    "Kwame Mensah",
                    "David Osei",
                    "Fatima Diallo",
                    "Naledi Sithole",
                ];
                const random = sampleNames[Math.floor(Math.random() * sampleNames.length)];
                setAccountName(random);
                setIsVerifying(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [accountNumber, accountName, setAccountName]);

    const isValid =
        Boolean(country) &&
        Boolean(bankName) &&
        accountNumber.replace(/\D/g, "").length >= 6;

    return (
        <div className="mx-auto w-full max-w-xl animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6 text-left">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2.5 py-1 rounded-full">
                    Step 2 of 3
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Who are you sending to?
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Choose recipient country and enter their bank account or mobile wallet.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
                {/* Destination Country */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-black tracking-tight">
                        Destination Country
                    </label>
                    <Select
                        value={country}
                        onChange={(v) => v && setCountry(v)}
                        options={countryOptions}
                        searchable
                        searchPlaceholder="Search country..."
                        leadingIcon={<Globe2 size={16} />}
                        triggerClassName="h-11 rounded-lg"
                    />
                </div>

                {/* Recipient Bank / Provider */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-black tracking-tight">
                        Recipient Bank or Wallet Provider
                    </label>
                    <Select
                        value={bankName}
                        onChange={(v) => v && setBankName(v)}
                        options={availableBanks.map((b) => ({ value: b.name, label: b.name }))}
                        searchable
                        searchPlaceholder="Search bank..."
                        leadingIcon={<Landmark size={16} />}
                        triggerClassName="h-11 rounded-lg"
                    />
                </div>

                {/* Account / Mobile Number */}
                <Input
                    id="recipient-account"
                    label="Account or Mobile Money Number"
                    placeholder="e.g. 0123 456 789"
                    value={accountNumber}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setAccountNumber(val);
                    }}
                />

                {/* Account Name */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            Recipient Legal Name
                        </label>
                        {accountName && !isVerifying && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <CheckCircle2 size={12} />
                                Verified
                            </span>
                        )}
                    </div>
                    <Input
                        id="recipient-name"
                        placeholder={isVerifying ? "Verifying account name..." : "e.g. Abdulshakur Dauda"}
                        value={accountName}
                        disabled={isVerifying}
                        onChange={(e) => setAccountName(e.target.value)}
                    />
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
                        disabled={!isValid}
                        onClick={onNext}
                        className="h-11 flex-1 rounded-xl bg-black text-sm font-semibold text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Review Transfer</span>
                        <ArrowRight size={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

