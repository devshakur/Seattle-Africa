"use client";

import { AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/Select";

export interface IndustrySelectProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const INDUSTRY_OPTIONS = [
    { value: "", label: "Select an industry..." },
    { value: "ecommerce", label: "E-commerce & Retail" },
    { value: "logistics", label: "Logistics & Supply Chain" },
    { value: "tech", label: "Technology & Software" },
    { value: "consulting", label: "Consulting & Professional Advisory" },
    { value: "fintech", label: "Financial Services & Fintech" },
    { value: "import-export", label: "Import, Export & Cross-Border Trade" },
    { value: "agriculture", label: "Agriculture & Commodities" },
    { value: "manufacturing", label: "Manufacturing & Industrial" },
];

export function IndustrySelect({
    value,
    onChange,
    error,
    label = "Business Industry",
    id = "business-industry",
    required = true,
    disabled = false,
    className,
}: IndustrySelectProps) {
    return (
        <div className="flex flex-col w-full text-left">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-semibold text-black tracking-tight mb-1.5 flex items-center justify-between"
                >
                    <span>
                        {label}
                        {required && <span className="ml-1 text-zinc-400">*</span>}
                    </span>
                </label>
            )}

            <Select
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder="Select an industry..."
                options={INDUSTRY_OPTIONS.filter((o) => o.value !== "")}
                className={className}
                triggerClassName="h-11 rounded-lg"
            />

            {error && (
                <p
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono font-medium text-black"
                >
                    <AlertCircle size={13} className="shrink-0 stroke-[2.2]" />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
}
