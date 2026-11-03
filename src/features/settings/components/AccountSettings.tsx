"use client";

import { useState, useEffect } from "react";
import { User, Building2, ArrowRight, ShieldCheck, Check, Loader2 } from "lucide-react";
import { AccountType } from "../hooks/useSettings";
import { cn } from "@/libs/utils";
import { useBusiness, ACCOUNT_TYPE_STORAGE_KEY } from "@/features/business/context/BusinessContext";

interface Props {
    accountType: AccountType;
    onSwitch: (type: AccountType) => void;
}

export function AccountSettings({ accountType, onSwitch }: Props) {
    const { initiateAccountSwitch } = useBusiness();
    const [isSwitching, setIsSwitching] = useState(false);
    const [switchingTo, setSwitchingTo] = useState<AccountType | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(ACCOUNT_TYPE_STORAGE_KEY) as AccountType | null;
            if (saved && saved !== accountType) {
                onSwitch(saved);
            }
        } catch {
            // ignore
        }
    }, [accountType, onSwitch]);

    const handleAccountClick = (targetType: AccountType) => {
        if (targetType === accountType) return;
        setIsSwitching(true);
        setSwitchingTo(targetType);
        initiateAccountSwitch(targetType);
    };

    const types = [
        {
            id: "personal" as AccountType,
            label: "Personal Account",
            sublabel: "Individual Pass-Through",
            description:
                "For individuals sending direct pass-through remittances to family, friends, or verified merchants across African corridors.",
            icon: User,
            features: [
                "Direct source-to-partner cross-border settlement",
                "Instant beneficiary bank & mobile money payouts",
                "Downloadable ISO-compliant payment receipts",
                "Zero wallet custody — funds move straight through",
            ],
        },
        {
            id: "business" as AccountType,
            label: "Business Account",
            sublabel: "Corporate & Batch Treasury",
            description:
                "For registered corporate entities managing supplier invoices, pan-African payroll batches, and maker-checker governance.",
            icon: Building2,
            features: [
                "Mass CSV/Excel batch payouts across African corridors",
                "Direct corporate bank & commercial card pass-through",
                "Maker-Checker role permissions & authorization limits",
                "Tax-verified corporate beneficiary directory (TIN/WHT)",
            ],
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-black">Account Type & Settlement Tier</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Click any account workspace to switch. For compliance and security, switching workspaces redirects to login to authenticate into that account.
                </p>
            </div>

            {/* Current badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-black">
                <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse" />
                <span>Active Workspace:</span>
                <span className="font-bold text-black uppercase tracking-wider font-mono font-tabular-nums">
                    {accountType === "personal" ? "Personal Account" : "Business Account"}
                </span>
            </div>

            {/* Account type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {types.map((type) => {
                    const Icon = type.icon;
                    const isActive = accountType === type.id;
                    const isTargetSwitch = switchingTo === type.id;

                    return (
                        <button
                            key={type.id}
                            type="button"
                            disabled={isSwitching}
                            onClick={() => handleAccountClick(type.id)}
                            className={cn(
                                "relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-200 cursor-pointer group",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                                isActive
                                    ? "border-black bg-black text-white shadow-md cursor-default"
                                    : "border-[#E5E5E5] bg-white hover:border-black hover:bg-zinc-50/60 shadow-xs"
                            )}
                        >
                            {/* Active badge or Switch Action Badge */}
                            {isActive ? (
                                <span className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-black px-2.5 py-0.5 rounded-full border border-white">
                                    Current Workspace
                                </span>
                            ) : (
                                <span className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 group-hover:bg-black text-black group-hover:text-white px-2.5 py-1 rounded-lg border border-[#E5E5E5] transition-all flex items-center gap-1 font-tabular-nums">
                                    {isTargetSwitch ? (
                                        <>
                                            <Loader2 size={11} className="animate-spin" />
                                            <span>Redirecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Switch &amp; Login</span>
                                            <ArrowRight size={11} />
                                        </>
                                    )}
                                </span>
                            )}

                            <div
                                className={cn(
                                    "flex size-11 items-center justify-center rounded-xl mb-4 transition-colors border",
                                    isActive
                                        ? "bg-white/10 text-white border-white/20"
                                        : "bg-zinc-100 text-black border-[#E5E5E5] group-hover:bg-black group-hover:text-white"
                                )}
                            >
                                <Icon size={20} strokeWidth={1.8} />
                            </div>

                            <p
                                className={cn(
                                    "text-[10px] font-mono font-bold uppercase tracking-widest mb-1",
                                    isActive ? "text-zinc-400" : "text-zinc-500"
                                )}
                            >
                                {type.sublabel}
                            </p>
                            <h3 className={cn("text-base font-bold mb-2", isActive ? "text-white" : "text-black")}>
                                {type.label}
                            </h3>
                            <p className={cn("text-xs leading-relaxed mb-4", isActive ? "text-zinc-300" : "text-zinc-500")}>
                                {type.description}
                            </p>

                            <ul
                                className={cn(
                                    "space-y-2 mt-auto w-full pt-3 border-t",
                                    isActive ? "border-white/15" : "border-[#E5E5E5]"
                                )}
                            >
                                {type.features.map((f) => (
                                    <li
                                        key={f}
                                        className={cn(
                                            "flex items-center gap-2 text-xs",
                                            isActive ? "text-zinc-200" : "text-zinc-700"
                                        )}
                                    >
                                        <Check size={13} className={isActive ? "text-white shrink-0" : "text-black shrink-0"} />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {!isActive && (
                                <div className="mt-4 pt-3 border-t border-[#E5E5E5] w-full flex items-center justify-between text-xs font-semibold text-black">
                                    <span className="font-mono text-[11px] text-zinc-500">
                                        Click to switch workspace
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:underline font-mono text-[11px]">
                                        Login to {type.label.split(" ")[0]} &rarr;
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="h-px w-full bg-[#E5E5E5]" />

            {/* Verification & Daily Clearing Limits Table */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-black">Compliance & Pass-Through Clearing Limits</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Tier-based maximum allowances under Central Bank AML & KYB regulations.
                        </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-black border border-black px-2.5 py-1 rounded-full">
                        Tier 2 Active
                    </span>
                </div>

                <div className="rounded-xl border border-[#E5E5E5] overflow-hidden text-xs">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-[#E5E5E5] text-zinc-500 font-semibold text-[11px] uppercase">
                            <tr>
                                <th className="px-4 py-2.5">Verification Tier</th>
                                <th className="px-4 py-2.5">Single Transfer</th>
                                <th className="px-4 py-2.5">Daily Limit</th>
                                <th className="px-4 py-2.5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] font-mono font-tabular-nums">
                            <tr className="text-zinc-500 bg-zinc-50/40">
                                <td className="px-4 py-3 font-sans font-medium">Tier 1 &bull; Phone & BVN</td>
                                <td className="px-4 py-3">$1,000 USD</td>
                                <td className="px-4 py-3">$5,000 USD</td>
                                <td className="px-4 py-3 text-right text-zinc-400 font-sans">Completed</td>
                            </tr>
                            <tr className="bg-white font-bold text-black">
                                <td className="px-4 py-3 font-sans flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-black" />
                                    <span>Tier 2 &bull; Government ID & Proof of Address</span>
                                </td>
                                <td className="px-4 py-3">$25,000 USD</td>
                                <td className="px-4 py-3">$50,000 USD</td>
                                <td className="px-4 py-3 text-right text-black font-sans underline">Active</td>
                            </tr>
                            <tr className="text-zinc-600 bg-zinc-50/40">
                                <td className="px-4 py-3 font-sans font-medium">Tier 3 &bull; Corporate KYB Resolution & Audit</td>
                                <td className="px-4 py-3">$500,000 USD</td>
                                <td className="px-4 py-3">$1,500,000 USD</td>
                                <td className="px-4 py-3 text-right text-black font-semibold font-sans">
                                    Business Enabled
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
