"use client";

import { forwardRef } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/libs/utils";

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

export const IndustrySelect = forwardRef<HTMLSelectElement, IndustrySelectProps>(
    (
        {
            value,
            onChange,
            error,
            label = "Business Industry",
            id = "business-industry",
            required = true,
            disabled = false,
            className,
        },
        ref
    ) => {
        const errorId = `${id}-error`;

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

                <div className="relative w-full">
                    <select
                        ref={ref}
                        id={id}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => onChange(e.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : undefined}
                        className={cn(
                            "flex h-11 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 py-2 text-sm text-black transition-colors duration-150 focus:outline-none focus:ring-1 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
                            !value && "text-zinc-400",
                            error
                                ? "border-black ring-1 ring-black bg-zinc-50/40"
                                : "border-[#E5E5E5] hover:border-zinc-400 focus:border-black focus:ring-black",
                            className
                        )}
                    >
                        {INDUSTRY_OPTIONS.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.value === ""}
                                className="text-black bg-white"
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <ChevronDown size={15} />
                    </div>
                </div>

                {error && (
                    <p
                        id={errorId}
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
);

IndustrySelect.displayName = "IndustrySelect";

