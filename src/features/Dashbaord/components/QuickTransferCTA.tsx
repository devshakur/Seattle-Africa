"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CurrencyOption {
    code: string;
    label: string;
    flag: string;
    symbol: string;
}

const AFRICAN_CURRENCIES: CurrencyOption[] = [
    { code: "ZAR", label: "South African Rand", flag: "🇿🇦", symbol: "R" },
    { code: "NGN", label: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
    { code: "KES", label: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
    { code: "GHS", label: "Ghanaian Cedi", flag: "🇬🇭", symbol: "GH₵" },
    { code: "XOF", label: "West African CFA", flag: "🇸🇳", symbol: "CFA" },
];

// Intra-African cross exchange rates
const FX_RATES: Record<string, Record<string, number>> = {
    ZAR: { NGN: 91.38, KES: 7.78, GHS: 0.94, XOF: 35.27, ZAR: 1.0 },
    NGN: { GHS: 0.0103, KES: 0.0852, ZAR: 0.0109, XOF: 0.386, NGN: 1.0 },
    KES: { NGN: 11.74, GHS: 0.12, ZAR: 0.1285, XOF: 4.53, KES: 1.0 },
    GHS: { NGN: 97.46, KES: 8.3, ZAR: 1.064, XOF: 37.6, GHS: 1.0 },
    XOF: { NGN: 2.59, KES: 0.22, ZAR: 0.0284, GHS: 0.0266, XOF: 1.0 },
};

export function QuickTransferCTA() {
    const [sourceCurrency, setSourceCurrency] = useState("ZAR");
    const [targetCurrency, setTargetCurrency] = useState("NGN");
    const [sendAmount, setSendAmount] = useState("1000");

    const rate =
        FX_RATES[sourceCurrency]?.[targetCurrency] ?? 91.38;

    const numericAmount = parseFloat(sendAmount.replace(/,/g, "")) || 0;
    const receiveAmount = (numericAmount * rate).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Card className="mb-6 p-5 sm:p-6 border border-gray-200/90 bg-white shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-950 flex items-center gap-1.5">
                        <span>Pan-African Transfer</span>
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2 py-0.5 rounded-full">
                            <Zap size={10} className="fill-current" />
                            PAPSS Live
                        </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Intra-African clearing via Frankfurter feed
                    </p>
                </div>

                <div className="text-right">
                    <span className="text-[11px] font-mono font-medium text-gray-500">
                        Fee: <span className="font-bold text-gray-950">0.00%</span>
                    </span>
                </div>
            </div>

            {/* Inputs Container */}
            <div className="space-y-3">
                {/* Send Box */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 transition-colors focus-within:border-black focus-within:bg-white">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>You send</span>
                        <span className="font-mono text-[11px]">African Origin</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={sendAmount}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, "");
                                setSendAmount(val);
                            }}
                            className="w-full bg-transparent font-mono font-tabular-nums tabular-nums text-lg font-bold text-gray-950 outline-none"
                            placeholder="0.00"
                        />

                        {/* Quick Source Currency Selector */}
                        <div className="flex items-center gap-1 shrink-0">
                            <select
                                value={sourceCurrency}
                                onChange={(e) => {
                                    const next = e.target.value;
                                    setSourceCurrency(next);
                                    if (next === targetCurrency) {
                                        setTargetCurrency(next === "NGN" ? "KES" : "NGN");
                                    }
                                }}
                                className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-bold text-gray-900 cursor-pointer shadow-2xs outline-none focus:border-black"
                            >
                                {AFRICAN_CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Conversion Divider & Swap */}
                <div className="relative flex items-center justify-center my-1">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex items-center gap-2 bg-white px-3 py-0.5 rounded-full border border-gray-200 text-[11px] font-mono text-gray-600 shadow-2xs font-tabular-nums tabular-nums">
                        <ArrowDownUp size={11} className="text-gray-400" />
                        <span>
                            1 {sourceCurrency} = {rate.toLocaleString()} {targetCurrency}
                        </span>
                    </div>
                </div>

                {/* Recipient Gets Box */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Recipient gets (estimated)</span>
                        <span className="font-mono text-[11px]">African Destination</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="w-full font-mono font-tabular-nums tabular-nums text-lg font-bold text-gray-950 truncate">
                            {receiveAmount}
                        </div>

                        {/* Quick Target Currency Selector */}
                        <div className="flex items-center gap-1 shrink-0">
                            <select
                                value={targetCurrency}
                                onChange={(e) => setTargetCurrency(e.target.value)}
                                className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-bold text-gray-900 cursor-pointer shadow-2xs outline-none focus:border-black"
                            >
                                {AFRICAN_CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Note */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1 text-gray-500">
                    <ShieldCheck size={13} className="text-black" />
                    <span>Direct central bank clearing &bull; No FX spread</span>
                </div>
                <span className="font-mono font-medium text-black">Arrival: &lt; 90s</span>
            </div>

            {/* Persistent CTA Button */}
            <Link
                href={`/send-money?source=${sourceCurrency}&target=${targetCurrency}&amount=${sendAmount}`}
                className="block mt-4"
            >
                <Button
                    variant="primary"
                    className="w-full h-11 text-sm font-semibold rounded-xl bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                    <span>Send {sourceCurrency} to {targetCurrency}</span>
                    <ArrowRight size={15} />
                </Button>
            </Link>
        </Card>
    );
}
