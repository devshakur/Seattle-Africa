"use client";

import { useState } from "react";
import { User, Building2, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
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
            label: "Personal",
            sublabel: "Individual",
            description: "For individuals sending money to family, friends or businesses across Africa.",
            icon: User,
            features: ["Personal transfers", "Beneficiary management", "Transaction history"],
        },
        {
            id: "business" as AccountType,
            label: "Business",
            sublabel: "Company / Organisation",
            description: "For businesses managing payroll, supplier payments or bulk international transfers.",
            icon: Building2,
            features: ["Bulk payments", "Team access & roles", "API integration", "Priority support"],
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Account Type</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Switch between a Personal and Business account. Your transfer history and beneficiaries are preserved.
                </p>
            </div>

            {/* Current badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                <span className="w-2 h-2 rounded-full bg-black inline-block" />
                Current: {accountType === "personal" ? "Personal Account" : "Business Account"}
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
                                    ? "border-black bg-black text-white shadow-lg"
                                    : isPending
                                        ? "border-black/60 bg-gray-50 shadow-sm ring-2 ring-black/20"
                                        : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
                            )}
                        >
                            {/* Active badge */}
                            {isActive && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-white text-black px-2.5 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}
                            {isPending && !isActive && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
                                    Selected
                                </span>
                            )}

                            <div className={cn(
                                "flex size-12 items-center justify-center rounded-xl mb-4 transition-colors",
                                isActive ? "bg-white/10 text-white" : "bg-gray-100 text-gray-800 group-hover:bg-gray-200"
                            )}>
                                <Icon size={22} strokeWidth={1.8} />
                            </div>

                            <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isActive ? "text-white/60" : "text-gray-500")}>
                                {type.sublabel}
                            </p>
                            <h3 className={cn("text-lg font-bold mb-2", isActive ? "text-white" : "text-gray-950")}>
                                {type.label}
                            </h3>
                            <p className={cn("text-xs leading-relaxed mb-4", isActive ? "text-white/70" : "text-gray-500")}>
                                {type.description}
                            </p>

                            <ul className="space-y-1.5">
                                {type.features.map((f) => (
                                    <li key={f} className={cn("flex items-center gap-2 text-[12px] font-medium", isActive ? "text-white/80" : "text-gray-600")}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-white/50" : "bg-gray-400")} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            {/* Pending switch confirmation */}
            {pendingType && pendingType !== accountType && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-900">
                                Switch to {pendingType === "personal" ? "Personal" : "Business"} Account?
                            </p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                Your existing transfers, beneficiaries and account history will be preserved. Some features may change based on your account type.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-xl px-5 text-sm border-amber-300 text-amber-800 hover:bg-amber-100"
                            onClick={() => setPendingType(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={isSwitching}
                            className="h-9 rounded-xl px-6 text-sm bg-black text-white hover:bg-gray-800"
                            onClick={handleConfirmSwitch}
                        >
                            {isSwitching ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Switching…
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Confirm Switch <ArrowRight size={14} />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Success confirmation */}
            {switched && (
                <div className="flex items-center gap-2.5 rounded-xl bg-green-50 border border-green-200 px-5 py-3.5 animate-in fade-in duration-300">
                    <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                    <p className="text-sm font-semibold text-green-800">
                        Account switched to {accountType === "personal" ? "Personal" : "Business"} successfully.
                    </p>
                </div>
            )}
        </div>
    );
}

