"use client";

import { useState } from "react";
import { User, Building2, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AccountType } from "../hooks/useSettings";
import { cn } from "@/libs/utils";

interface Props {
    accountType: AccountType;
    onSwitch: (type: AccountType) => void;
}

export function AccountSettings({ accountType, onSwitch }: Props) {
    const [pendingType, setPendingType] = useState<AccountType | null>(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const [switched, setSwitched] = useState(false);

    const handleConfirmSwitch = () => {
        if (!pendingType || pendingType === accountType) return;
        setIsSwitching(true);
        setTimeout(() => {
            onSwitch(pendingType);
            setIsSwitching(false);
            setPendingType(null);
            setSwitched(true);
            setTimeout(() => setSwitched(false), 2500);
        }, 1400);
    };

    const types = [
        {
            id: "personal" as AccountType,
            label: "Personal Account",
            sublabel: "Individual Remittances",
            description: "For individuals sending money to family, friends, or verified merchants across African corridors.",
            icon: User,
            features: ["Multi-currency African wallets", "Instant beneficiary transfers", "Downloadable payment receipts", "24/7 fraud protection"],
        },
        {
            id: "business" as AccountType,
            label: "Business Account",
            sublabel: "Corporate & Treasury",
            description: "For registered entities managing supplier invoices, cross-border payroll, and wholesale liquidity.",
            icon: Building2,
            features: ["Bulk supplier payouts & batch processing", "Multi-user role access & approval workflows", "Dedicated treasury account manager", "Custom settlement API integrations"],
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-950">Account Type & Settlement Tier</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage your account classification and view your correspondent clearing limits.
                </p>
            </div>

            {/* Current badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Active Plan:</span>
                <span className="font-bold text-black uppercase tracking-wider font-mono">
                    {accountType === "personal" ? "Personal Account" : "Business Account"}
                </span>
            </div>

            {/* Account type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {types.map((type) => {
                    const Icon = type.icon;
                    const isActive = accountType === type.id;
                    const isPending = pendingType === type.id;

                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                                if (!isActive) setPendingType(type.id);
                            }}
                            className={cn(
                                "relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-200 cursor-pointer group",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                                isActive
                                    ? "border-black bg-black text-white shadow-md"
                                    : isPending
                                      ? "border-black/60 bg-gray-50 shadow-xs ring-2 ring-black/20"
                                      : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-xs"
                            )}
                        >
                            {/* Active badge */}
                            {isActive && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-white text-black px-2.5 py-0.5 rounded-full">
                                    Current
                                </span>
                            )}
                            {isPending && !isActive && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
                                    Selected
                                </span>
                            )}

                            <div
                                className={cn(
                                    "flex size-11 items-center justify-center rounded-xl mb-4 transition-colors",
                                    isActive ? "bg-white/10 text-white" : "bg-gray-100 text-gray-800 group-hover:bg-gray-200"
                                )}
                            >
                                <Icon size={20} strokeWidth={1.8} />
                            </div>

                            <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isActive ? "text-white/60" : "text-gray-400")}>
                                {type.sublabel}
                            </p>
                            <h3 className={cn("text-base font-bold mb-2", isActive ? "text-white" : "text-gray-950")}>
                                {type.label}
                            </h3>
                            <p className={cn("text-xs leading-relaxed mb-4", isActive ? "text-white/70" : "text-gray-500")}>
                                {type.description}
                            </p>

                            <ul className="space-y-2 mt-auto w-full pt-2 border-t border-white/10 border-gray-100">
                                {type.features.map((f) => (
                                    <li
                                        key={f}
                                        className={cn(
                                            "flex items-center gap-2 text-xs",
                                            isActive ? "text-white/90" : "text-gray-600"
                                        )}
                                    >
                                        <Check size={13} className={isActive ? "text-white shrink-0" : "text-black shrink-0"} />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            {/* Pending switch confirmation */}
            {pendingType && pendingType !== accountType && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3.5 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-950">
                                Switch to {pendingType === "personal" ? "Personal" : "Business"} Account?
                            </p>
                            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                                Your past transaction receipts, linked cards, and saved beneficiaries will remain intact.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-xl px-4 text-xs border-amber-300 text-amber-900 hover:bg-amber-100"
                            onClick={() => setPendingType(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={isSwitching}
                            className="h-9 rounded-xl px-5 text-xs bg-black text-white hover:bg-gray-800"
                            onClick={handleConfirmSwitch}
                        >
                            {isSwitching ? "Switching..." : "Confirm Switch"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Success confirmation */}
            {switched && (
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 animate-in fade-in duration-300">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-xs font-semibold text-emerald-800">
                        Account type switched to {accountType === "personal" ? "Personal" : "Business"} successfully.
                    </p>
                </div>
            )}

            <div className="h-px w-full bg-gray-100" />

            {/* Verification & Daily Clearing Limits Table */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-950">Compliance & Settlement Limits</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Tier-based maximum allowances under Central Bank AML regulations.
                        </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        Tier 2 Active
                    </span>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden text-xs">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[11px] uppercase">
                            <tr>
                                <th className="px-4 py-2.5">Verification Tier</th>
                                <th className="px-4 py-2.5">Single Transfer</th>
                                <th className="px-4 py-2.5">Daily Limit</th>
                                <th className="px-4 py-2.5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono">
                            <tr className="text-gray-500 bg-gray-50/30">
                                <td className="px-4 py-3 font-sans font-medium">Tier 1 &bull; Phone & BVN</td>
                                <td className="px-4 py-3">$1,000 USD</td>
                                <td className="px-4 py-3">$5,000 USD</td>
                                <td className="px-4 py-3 text-right text-gray-400 font-sans">Completed</td>
                            </tr>
                            <tr className="bg-white font-bold text-gray-950">
                                <td className="px-4 py-3 font-sans flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-600" />
                                    <span>Tier 2 &bull; Government ID & Proof of Address</span>
                                </td>
                                <td className="px-4 py-3">$25,000 USD</td>
                                <td className="px-4 py-3">$50,000 USD</td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-sans">Active</td>
                            </tr>
                            <tr className="text-gray-500 bg-gray-50/30">
                                <td className="px-4 py-3 font-sans font-medium">Tier 3 &bull; Corporate Resolution & Audit</td>
                                <td className="px-4 py-3">$250,000 USD</td>
                                <td className="px-4 py-3">Unlimited</td>
                                <td className="px-4 py-3 text-right text-black font-semibold font-sans hover:underline cursor-pointer">
                                    Upgrade &rarr;
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
