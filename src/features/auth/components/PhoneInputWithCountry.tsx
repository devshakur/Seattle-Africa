"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AFRICAN_CURRENCIES, CurrencyConfig } from "@/features/currency/CurrencyContext";

export interface PhoneInputWithCountryProps {
    id: string;
    label?: string;
    country: CurrencyConfig;
    onCountryChange: (country: CurrencyConfig) => void;
    phoneNumber: string;
    onPhoneNumberChange: (val: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

const COUNTRY_PLACEHOLDERS: Record<string, string> = {
    "+234": "803 123 4567",
    "+27": "82 123 4567",
    "+254": "712 345 678",
    "+233": "24 123 4567",
    "+221": "77 123 4567",
    "+20": "10 1234 5678",
    "+250": "78 123 4567",
    "+256": "77 123 4567",
};

export function PhoneInputWithCountry({
    id,
    label = "Phone number",
    country,
    onCountryChange,
    phoneNumber,
    onPhoneNumberChange,
    error,
    disabled = false,
    required = true,
    placeholder,
}: PhoneInputWithCountryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const activePlaceholder =
        placeholder || COUNTRY_PLACEHOLDERS[country.phonePrefix] || "803 123 4567";

    return (
        <div className="w-full text-left">
            {/* Label */}
            {label && (
                <div className="flex items-center justify-between mb-1.5">
                    <label
                        htmlFor={id}
                        className="text-xs font-semibold text-black tracking-tight"
                    >
                        {label} {required && <span className="text-zinc-400">*</span>}
                    </label>
                </div>
            )}

            {/* Two-Part Phone Input Container */}
            <div
                className={`relative flex items-center rounded-xl border bg-white transition-all overflow-visible ${
                    error
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                        : "border-[#E5E5E5] focus-within:border-black focus-within:ring-1 focus-within:ring-black"
                } ${disabled ? "opacity-60 bg-zinc-50 cursor-not-allowed" : ""}`}
            >
                {/* Part 1: Country Flag & Dial Code Selector */}
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        id={`${id}-country-selector`}
                        disabled={disabled}
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-expanded={isOpen}
                        aria-label={`Select country code. Current: ${country.country} ${country.phonePrefix}`}
                        className="flex items-center gap-2 h-11 px-3 bg-zinc-50 hover:bg-zinc-100 border-r border-[#E5E5E5] text-zinc-900 transition-colors focus:outline-none rounded-l-xl select-none"
                    >
                        <span className="text-base leading-none select-none" aria-hidden="true">
                            {country.flag}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-black">
                            {country.phonePrefix}
                        </span>
                        <ChevronDown
                            size={14}
                            className={`text-zinc-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Country Dropdown Popover */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 2, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-xl z-50 text-left"
                            >
                                <div className="px-2.5 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1">
                                    Select African Country
                                </div>
                                <div className="max-h-56 overflow-y-auto no-scrollbar space-y-0.5">
                                    {AFRICAN_CURRENCIES.map((c) => {
                                        const isSelected = c.code === country.code;
                                        return (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => {
                                                    onCountryChange(c);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                                                    isSelected
                                                        ? "bg-black text-white font-semibold"
                                                        : "text-zinc-800 hover:bg-zinc-100"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base select-none">{c.flag}</span>
                                                    <span className="truncate">{c.country}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`font-mono text-xs font-semibold ${
                                                            isSelected ? "text-zinc-300" : "text-zinc-500"
                                                        }`}
                                                    >
                                                        {c.phonePrefix}
                                                    </span>
                                                    {isSelected && <Check size={13} className="text-white shrink-0" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Part 2: Actual Phone Number Input */}
                <input
                    id={id}
                    type="tel"
                    value={phoneNumber}
                    disabled={disabled}
                    required={required}
                    autoComplete="tel-national"
                    placeholder={activePlaceholder}
                    onChange={(e) => {
                        // Allow digits, spaces, and hyphens
                        const val = e.target.value.replace(/[^\d\s-]/g, "");
                        onPhoneNumberChange(val);
                    }}
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-mono font-tabular-nums tabular-nums rounded-r-xl"
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-red-600 font-medium tracking-tight">
                    {error}
                </p>
            )}
        </div>
    );
}
