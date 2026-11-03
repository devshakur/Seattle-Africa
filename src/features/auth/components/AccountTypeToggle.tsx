"use client";

import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";
import { cn } from "@/libs/utils";

export type AccountType = "personal" | "business";

interface AccountTypeToggleProps {
    value: AccountType;
    onChange: (value: AccountType) => void;
    className?: string;
    disabled?: boolean;
}

export function AccountTypeToggle({
    value,
    onChange,
    className,
    disabled = false,
}: AccountTypeToggleProps) {
    const tabs: Array<{
        id: AccountType;
        label: string;
        icon: typeof User;
        sublabel: string;
    }> = [
        {
            id: "personal",
            label: "Personal",
            icon: User,
            sublabel: "Individual Wallets & Transfers",
        },
        {
            id: "business",
            label: "Business",
            icon: Building2,
            sublabel: "Corporate Treasury & Liquidity",
        },
    ];

    return (
        <div
            role="tablist"
            aria-label="Account type"
            className={cn(
                "relative flex w-full items-center rounded-xl border border-[#E5E5E5] bg-zinc-100/80 p-1 select-none",
                disabled && "opacity-60 pointer-events-none",
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = value === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        role="tab"
                        type="button"
                        id={`tab-${tab.id}`}
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.id}`}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative z-10 flex flex-1 items-center justify-center gap-2 py-2 text-xs font-semibold tracking-tight transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg",
                            isActive
                                ? "text-white"
                                : "text-zinc-600 hover:text-black"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeAccountTypePill"
                                className="absolute inset-0 z-[-1] rounded-lg bg-black shadow-sm"
                                transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 34,
                                }}
                            />
                        )}
                        <Icon size={14} className={isActive ? "text-white" : "text-zinc-500"} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
